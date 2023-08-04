import { Router } from 'express'

import { UsersController } from '@/api/controllers/users.controller'

export default Router()
  .get('/users', UsersController.getUsers.handler())
  .get('/users/:user_id', UsersController.getUser.handler())
