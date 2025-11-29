import express from 'express'
import { requireAuth } from '../middlewares/auth.js'
import { getScenarios } from '../controllers/scenarioController.js'

const router = express.Router()

router.get('/', requireAuth, getScenarios)

export default router
