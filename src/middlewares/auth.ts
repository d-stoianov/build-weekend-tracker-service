import { supabase } from '../db/supabase.js'

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    const token =
      authHeader?.split(' ')[1] || req.cookies?.sb_token?.access_token

    if (!token) {
      return res.status(401).json({ error: 'No auth token provided' })
    }

    const { data, error } = await supabase.auth.getUser(token)

    console.log(token)

    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid session' })
    }

    req.user = data.user
    next()
  } catch (err) {
    console.error('Auth middleware error:', err)
    res.status(500).json({ error: 'Server error' })
  }
}
