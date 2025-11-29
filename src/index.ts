import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'
import trackerRoutes from './routes/trackerRoutes.js'
import scenarioRoutes from './routes/scenarioRoutes.js'
import { APP_ORIGIN, PORT } from './config.js'

const app = express()
app.use(express.json())
app.use(
  cors({
    origin: APP_ORIGIN,
    credentials: true,
  }),
)

app.get('/', (_req, res) => res.send('server is up'))

app.use('/user', userRoutes)
app.use('/trackers', trackerRoutes)
app.use('/scenarios', scenarioRoutes)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
