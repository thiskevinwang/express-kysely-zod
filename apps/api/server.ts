import bodyParser from 'body-parser'
import { config } from 'dotenv'
import express from 'express'

import { createLoggingMiddleware } from '@/middleware/logging.ts'
import apiDocsRouter from '@/routes/api-docs/route.ts'
import rootRouter from '@/routes/root.ts'
import streamRouter from '@/routes/stream.ts'
import usersRouter from '@/routes/users/route.ts'

config()

const app = express()

app.use(createLoggingMiddleware())

// parse application/json
app.use(bodyParser.json())

app.use(
  '/test',
  (req, res, next) => {
    next()
  },
  (req, res) => {
    res.json({ message: 'test' })
  }
)

app.use(rootRouter)
app.use(streamRouter)
app.use(usersRouter)
app.use(apiDocsRouter)

app.listen(process.env.PORT, () => {
  console.log(`server running on port: ${process.env.PORT}`)
})
