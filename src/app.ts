import express, { Express } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import filesRoutes from '@/routes/files-upload.routes'
import path from 'path'

class App {
  server: Express
  constructor() {
    this.server = express()
    this.middlewares()
    this.routes()
  }

  middlewares() {
    this.server.use(express.json())
    this.server.use(express.urlencoded({ extended: true }))
    this.server.use(morgan('dev'))
    this.server.use(cors())
    this.server.use(
      '/files',
      express.static(path.join(__dirname, '/../uploads/'))
    )
  }

  routes() {
    this.server.use(filesRoutes)
  }
}

export default new App().server
