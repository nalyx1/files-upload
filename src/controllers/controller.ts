import prisma from '@/config/prisma'
import { Request, Response } from 'express'

class Controller {
  async handle(request: Request, response: Response) {
    try {
      const { file } = request

      if (file) {
        const post = await prisma.file.create({
          data: {
            name: file.originalname,
            size: file.size,
            key: file.filename,
            url: '',
          },
        })

        response.status(200).send(post)
      }
    } catch (error) {
      console.log(error)
      response.status(500).send(error)
    }
  }
}

export default new Controller()
