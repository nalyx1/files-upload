import multer, { FileFilterCallback } from 'multer'
import { Request } from 'express'
import path from 'path'
import crypto from 'crypto'

type DestinationCallback = (error: Error | null, destination: string) => void
type FileNameCallback = (error: Error | null, filename: string) => void

const multerConfig = {
  dest: path.join(__dirname, '/../../uploads/'),
  storage: multer.diskStorage({
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
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
  ) => {
    const allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif']

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Invalid file type'))
    }
  },
}

export default multerConfig
