import { config } from 'dotenv'
import express from 'express'

import apiDocsRouter from '@/api/routes/api-docs/route.ts'
import rootRouter from '@/api/routes/root.ts'
import streamRouter from '@/api/routes/stream.ts'
import usersRouter from '@/api/routes/users/route.ts'

//sad
config()

const app = express()

app.use(rootRouter)
app.use(streamRouter)
app.use(usersRouter)
app.use(apiDocsRouter)

app.listen(process.env.PORT, () => {
  console.log(`server running on port: ${process.env.PORT}`)
})
