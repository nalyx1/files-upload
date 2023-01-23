import prisma from '@/config/prisma'
import { Request, Response } from 'express'
import { S3 } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'

const region = process.env.AWS_REGION
const accessKey = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
const storageType = process.env.STORAGE_TYPE

const s3 = new S3({
  region,
  credentials: {
    accessKeyId: accessKey!,
    secretAccessKey: secretAccessKey!,
  },
})

class FilesUploadController {
  async listAll(request: Request, response: Response) {
    try {
      const files = await prisma.file.findMany()

      return response.status(200).send(files)
    } catch (error) {
      console.log(error)
      response.status(500).send(error)
    }
  }

  async create(request: Request, response: Response) {
    try {
      const { file } = request

      if (file) {
        const post = await prisma.file.create({
          data: {
            name: file.originalname,
            size: file.size,
            key: file.key ? file.key : file.filename,
            url: file.location || '',
          },
        })

        response.status(200).send(post)
      }
    } catch (error) {
      console.log(error)
      response.status(500).send(error)
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const { fileId } = request.params

      const file = await prisma.file.findUnique({
        where: {
          id: fileId,
        },
      })

      if (file) {
        if (storageType === 's3') {
          await s3.deleteObject({
            Bucket: 'nalyx-files-upload',
            Key: file.key,
          })
        } else {
          fs.unlinkSync(path.join(__dirname, `/../../uploads/${file.key}`))
        }

        await prisma.file.delete({
          where: {
            id: fileId,
          },
        })
        response.status(204).send()
      } else {
        throw new Error('arquivo não encontrado')
      }
    } catch (error) {
      console.log(error)
      response.status(500).send(error)
    }
  }
}

export default new FilesUploadController()
