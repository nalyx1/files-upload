import express, { Express } from 'express'
import cors from 'cors'
import morgan from 'morgan'
import routes from '@/routes/router'

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
  }

  routes() {
    this.server.use(routes)
  }
}

export default new App().server
