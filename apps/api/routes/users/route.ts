import { Router } from 'express'

import { UsersController } from '@/controllers/users.controller'

export default Router()
  .get('/users', UsersController.getUsers.handler())
  .post('/users', UsersController.createUser.handler())
  .get('/users/:user_id', UsersController.getUser.handler())
