// transitive dependency of `@asteasolutions/zod-to-openapi`
import type { TagObject } from 'openapi3-ts/oas31'
import { z } from 'zod'
import { validateRequest } from 'zod-express-middleware'

import { UserAppToDbSchema, UserRepository } from '@/models/user.model'
import { registry } from '@/spec/registry'
import { makeHandlers } from '@/utils/express-types'

export class UsersController {
  // For ApiDocs
  static spec: {
    tag: TagObject
  } = {
    tag: {
      name: 'Users',
      description: 'Operations about users',
    },
  }

  static getUsers = {
    params: undefined,
    response: z.array(UserAppToDbSchema),
    handler() {
      const handlers = makeHandlers(null, async (req, res) => {
        const users = await UserRepository.getAll()
        res.json(users)
      })
      return handlers
    },
  }

  static getUser = {
    params: z
      .object({
        user_id: z.string(),
      })
      .openapi({
        example: { user_id: 'user_5385a833-2935-4bca-bd59-379366a027ea' },
      }),
    response: UserAppToDbSchema,
    handler() {
      const handlers = makeHandlers(
        validateRequest({
          params: UsersController.getUser.params,
        }),
        async (req, res) => {
          const user = await UserRepository.getOneById(req.params.user_id)
          res.json(user)
        }
      )
      return handlers
    },
  }

  static createUser = {
    body: z.object({ email: z.string().email() }),
    response: UserAppToDbSchema,
    handler() {
      const handlers = makeHandlers(
        validateRequest({
          body: UsersController.createUser.body,
        }),
        async (req, res) => {
          const user = await UserRepository.createOne(req.body)
          res.status(201).json(user)
        }
      )
      return handlers
    },
  }
}

registry.registerPath({
  method: 'get',
  operationId: 'getUsers',
  path: '/users',
  tags: [UsersController.spec.tag.name],
  summary: 'Get all users',
  description: 'Get all users',
  request: {},
  responses: {
    200: {
      description: 'Array of users.',
      content: {
        'application/json': {
          schema: UsersController.getUser.response,
        },
      },
    },
  },
})

registry.registerPath({
  method: 'get',
  operationId: 'getUser',
  path: '/users/{id}',
  tags: [UsersController.spec.tag.name],
  description: 'Get user data by its id',
  summary: 'Get a single user',
  request: {
    params: UsersController.getUser.params,
  },
  responses: {
    200: {
      description: 'Object with user data.',
      content: {
        'application/json': {
          schema: UsersController.getUser.response,
        },
      },
    },
  },
})

registry.registerPath({
  method: 'post',
  operationId: 'createUser',
  path: '/users',
  tags: [UsersController.spec.tag.name],
  description: 'Create a new user',
  summary: 'Create a new user',
  request: {
    body: {
      description: 'Payload for creating a new user.',
      content: {
        'application/json': {
          schema: UsersController.createUser.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Object with user data.',
      content: {
        'application/json': {
          schema: UsersController.createUser.response,
        },
      },
    },
  },
})
