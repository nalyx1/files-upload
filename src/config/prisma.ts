import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// use `prisma` in your application to read and write data in your DB
prisma.$use(async (params, next) => {
  if (params.action === 'create') {
    if (!params.args.data.url) {
      params.args.data.url = `${process.env.APP_URL}/files/${params.args.data.key}`
    }
  }

  const result = await next(params)
  return result
})

export default prisma
