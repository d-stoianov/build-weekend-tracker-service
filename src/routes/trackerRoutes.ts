import express from 'express'
import { requireAuth } from '../middlewares/auth.js'
import {
  getTrackers,
  getTracker,
  createTrackerEndpoint,
  updateTrackerEndpoint,
  deleteTrackerEndpoint,
  getTrackerHistoryEndpoint,
} from '../controllers/trackerController.js'

const router = express.Router()

router.get('/', requireAuth, getTrackers)
router.get('/:id', requireAuth, getTracker)
router.post('/', requireAuth, createTrackerEndpoint)
router.put('/:id', requireAuth, updateTrackerEndpoint)
router.delete('/:id', requireAuth, deleteTrackerEndpoint)
router.get('/:id/history', requireAuth, getTrackerHistoryEndpoint)

export default router
