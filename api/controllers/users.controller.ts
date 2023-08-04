// transitive dependency of `@asteasolutions/zod-to-openapi`
import type { TagObject } from 'openapi3-ts/oas31'
import { z } from 'zod'
import { validateRequest } from 'zod-express-middleware'

import { registry } from '@/api/spec/registry'
import { makeHandlers } from '@/api/utils/express-types'

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
    response: z.object({
      users: z.array(
        z.object({
          id: z.string(),
        })
      ),
    }),
    handler() {
      const handlers = makeHandlers(null, (req, res) => {
        res.json({
          users: [
            {
              id: '1212121',
            },
          ],
        })
      })
      return handlers
    },
  }

  static getUser = {
    params: z
      .object({
        user_id: z.string(),
      })
      .openapi({ example: { user_id: '1212121' } }),
    response: z.array(
      z.object({
        user: z.object({
          id: z.string(),
        }),
      })
    ),
    handler() {
      const handlers = makeHandlers(
        validateRequest({
          params: UsersController.getUser.params,
        }),
        (req, res) => {
          res.json({
            user: {
              id: req.params.user_id,
            },
          })
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
