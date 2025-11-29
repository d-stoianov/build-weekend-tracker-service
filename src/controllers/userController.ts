import { createUser, getUserById } from '../services/userService.js'

export const createUserEndpoint = async (req, res) => {
  try {
    const authUser = req.user
    if (!authUser) return res.status(401).json({ error: 'Not authenticated' })

    const profile = await createUser(authUser.id, authUser.email)

    res.status(201).json(profile)
  } catch (err) {
    console.error('Error in createUser controller:', err)
    res.status(500).json({ error: 'Server error' })
  }
}

export const getUser = async (req, res) => {
  try {
    // req.user is set by the auth middleware
    const authUser = req.user
    if (!authUser) return res.status(401).json({ error: 'Not authenticated' })

    console.log(authUser)

    const profile = await getUserById(authUser.id)

    if (!profile) return res.status(404).json({ error: 'User not found' })

    res.json(profile)
  } catch (err) {
    console.error('Error in getUser controller:', err)
    res.status(500).json({ error: 'Server error' })
  }
}
