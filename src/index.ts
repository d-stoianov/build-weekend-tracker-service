import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import { PORT } from './config.js'

const app = express()
app.use(express.json())
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)

app.get('/', (_req, res) => res.send('server is up'))

app.use('/user', userRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
