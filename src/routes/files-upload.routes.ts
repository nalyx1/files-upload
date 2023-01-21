import { Router } from 'express'
import multer from 'multer'
import multerConfig from '@/config/multer'
import filesUploadController from '@/controllers/files-upload.controllers'

const routes = Router()

routes.get('/files', filesUploadController.listAll)

routes.post(
  '/files',
  multer(multerConfig).single('file'),
  filesUploadController.create
)

routes.delete('/files/:fileId', filesUploadController.delete)

export default routes
