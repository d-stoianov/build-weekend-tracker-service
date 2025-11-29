import { Request, Response } from 'express'
import {
  getTrackersByUserId,
  getTrackerById,
  createTracker,
  updateTracker,
  deleteTracker,
  getTrackerHistory,
} from '../services/trackerService.js'
import { getUserPrimaryKeyByAuthId } from '../services/userService.js'
import type { Tracker } from '../models/types.js'

export const getTrackers = async (
  req: Request & { user?: any },
  res: Response,
) => {
  try {
    const authUser = req.user
    if (!authUser) return res.status(401).json({ error: 'Not authenticated' })

    const userId = await getUserPrimaryKeyByAuthId(authUser.id)
    if (!userId) {
      return res.status(404).json({ error: 'User not found' })
    }

    const trackers = await getTrackersByUserId(userId)
    res.json(trackers)
  } catch (err) {
    console.error('Error in getTrackers controller:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getTracker = async (
  req: Request & { user?: any },
  res: Response,
) => {
  try {
    const authUser = req.user
    if (!authUser) return res.status(401).json({ error: 'Not authenticated' })

    const userId = await getUserPrimaryKeyByAuthId(authUser.id)
    if (!userId) {
      return res.status(404).json({ error: 'User not found' })
    }

    const { id } = req.params
    const tracker = await getTrackerById(id, userId)

    if (!tracker) {
      return res.status(404).json({ error: 'Tracker not found' })
    }

    res.json(tracker)
  } catch (err) {
    console.error('Error in getTracker controller:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const createTrackerEndpoint = async (
  req: Request & { user?: any },
  res: Response,
) => {
  try {
    const authUser = req.user
    if (!authUser) return res.status(401).json({ error: 'Not authenticated' })

    const userId = await getUserPrimaryKeyByAuthId(authUser.id)
    if (!userId) {
      return res.status(404).json({ error: 'User not found' })
    }

    const trackerData: Omit<Tracker, 'id'> = req.body
    const tracker = await createTracker(userId, trackerData)

    res.status(201).json(tracker)
  } catch (err) {
    console.error('Error in createTracker controller:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const updateTrackerEndpoint = async (
  req: Request & { user?: any },
  res: Response,
) => {
  try {
    const authUser = req.user
    if (!authUser) return res.status(401).json({ error: 'Not authenticated' })

    const userId = await getUserPrimaryKeyByAuthId(authUser.id)
    if (!userId) {
      return res.status(404).json({ error: 'User not found' })
    }

    const { id } = req.params
    const trackerData: Partial<Omit<Tracker, 'id'>> = req.body

    try {
      const tracker = await updateTracker(id, userId, trackerData)
      res.json(tracker)
    } catch (err) {
      if (err instanceof Error && err.message === 'Tracker not found') {
        return res.status(404).json({ error: 'Tracker not found' })
      }
      throw err
    }
  } catch (err) {
    console.error('Error in updateTracker controller:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const deleteTrackerEndpoint = async (
  req: Request & { user?: any },
  res: Response,
) => {
  try {
    const authUser = req.user
    if (!authUser) return res.status(401).json({ error: 'Not authenticated' })

    const userId = await getUserPrimaryKeyByAuthId(authUser.id)
    if (!userId) {
      return res.status(404).json({ error: 'User not found' })
    }

    const { id } = req.params

    try {
      await deleteTracker(id, userId)
      res.status(204).send()
    } catch (err) {
      if (err instanceof Error && err.message === 'Tracker not found') {
        return res.status(404).json({ error: 'Tracker not found' })
      }
      throw err
    }
  } catch (err) {
    console.error('Error in deleteTracker controller:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getTrackerHistoryEndpoint = async (
  req: Request & { user?: any },
  res: Response,
) => {
  try {
    const authUser = req.user
    if (!authUser) return res.status(401).json({ error: 'Not authenticated' })

    const userId = await getUserPrimaryKeyByAuthId(authUser.id)
    if (!userId) {
      return res.status(404).json({ error: 'User not found' })
    }

    const { id } = req.params

    try {
      const history = await getTrackerHistory(id, userId)
      res.json(history)
    } catch (err) {
      if (err instanceof Error && err.message === 'Tracker not found') {
        return res.status(404).json({ error: 'Tracker not found' })
      }
      throw err
    }
  } catch (err) {
    console.error('Error in getTrackerHistory controller:', err)
    res.status(500).json({ error: 'Server error' })
  }
}
