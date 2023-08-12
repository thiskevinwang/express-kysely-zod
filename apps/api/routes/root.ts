import express from 'express'

const router = express()
export default router

// handler that logs the mountpath
router.get('/', async (req, res) => {
  res.send('hello world')
})
