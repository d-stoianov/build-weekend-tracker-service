import { Request, Response } from 'express'
import { getAllScenarios } from '../services/scenarioService.js'

export const getScenarios = async (
  req: Request & { user?: any },
  res: Response,
) => {
  try {
    const authUser = req.user
    if (!authUser) return res.status(401).json({ error: 'Not authenticated' })

    const scenarios = await getAllScenarios()
    res.json(scenarios)
  } catch (err) {
    console.error('Error in getScenarios controller:', err)
    res.status(500).json({ error: 'Server error' })
  }
}
