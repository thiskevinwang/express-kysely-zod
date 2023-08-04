import { Router } from 'express'

export default Router().get('/', async (req, res) => {
  res.send('hello world')
})
