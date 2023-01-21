import 'dotenv/config'
import multer, { FileFilterCallback } from 'multer'
import multerS3 from 'multer-s3'
import { S3Client } from '@aws-sdk/client-s3'
import { Request } from 'express'
import path from 'path'
import crypto from 'crypto'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const region = process.env.AWS_REGION
const accessKey = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const storageType = process.env.STORAGE_TYPE

const s3Config = new S3Client({
  region,
  credentials: {
    accessKeyId: accessKey!,
    secretAccessKey: secretAccessKey!,
  },
})

const storageTypes = {
  local: multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb: DestinationCallback
    ) => {
      cb(null, path.join(__dirname, '/../../uploads/'))
    },
    filename: (
      req: Request,
      file: Express.Multer.File,
      cb: FileNameCallback
    ) => {
      crypto.randomBytes(16, (error, hash) => {
        if (error) {
          cb(error, '')
        }

        const fileName = `${hash.toString('hex')}-${file.originalname}`
        cb(null, fileName)
      })
    },
  }),
  s3: multerS3({
    s3: s3Config,
    bucket: 'nalyx-files-upload',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: 'public-read',
    key: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
      crypto.randomBytes(16, (error, hash) => {
        if (error) {
          cb(error, '')
        }

        const fileName = `${hash.toString('hex')}-${file.originalname}`
        file.fieldname = fileName
        cb(null, fileName)
      })
    },
  }),
}

const multerConfig = {
  dest: path.join(__dirname, '/../../uploads/'),
  storage: (storageTypes as Record<string, multer.StorageEngine>)[
    storageType ? storageType : 'local'
  ],
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const allowedMimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif',
      'application/pdf',
    ]

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  },
}

export default multerConfig
