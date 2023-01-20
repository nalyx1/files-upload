import { Router } from 'express'
import multer from 'multer'
import multerConfig from '@/config/multer'
import controller from '@/controllers/controller'

const routes = Router()

routes.post('/posts', multer(multerConfig).single('file'), controller.handle)

export default routes
