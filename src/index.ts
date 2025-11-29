import 'dotenv/config'
import express from 'express'
import { createClient } from '@supabase/supabase-js'

const app = express()
const PORT = process.env.PORT || 3000

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_API_KEY!,
)

app.get('/', (_req, res) => {
  res.send('server is up')
})

// Example endpoint hitting Supabase
app.get('/users', async (_req, res) => {
  const { data, error } = await supabase.from('users').select('*')

  if (error) return res.status(500).json({ error: error.message })
  res.json({ users: data })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
