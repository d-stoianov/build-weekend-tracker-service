import express from 'express'
import { requireAuth } from '../middlewares/auth.js'
import {
  createUserEndpoint,
  getUser,
  deleteUserEndpoint,
} from '../controllers/userController.js'

const router = express.Router()

router.get('/', requireAuth, getUser)
router.post('/', requireAuth, createUserEndpoint)
router.delete('/', requireAuth, deleteUserEndpoint)

export default router
