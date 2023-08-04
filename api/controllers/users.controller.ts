// transitive dependency of `@asteasolutions/zod-to-openapi`
import { Selectable } from 'kysely'
import type { TagObject } from 'openapi3-ts/oas31'
import { z } from 'zod'
import { validateRequest } from 'zod-express-middleware'

import { db } from '@/api/database/client'
import { DB } from '@/api/database/db'
import { registry } from '@/api/spec/registry'
import { makeHandlers } from '@/api/utils/express-types'

const userSchema = z.object({
  // manual layer to decouple DB schema from
  // application interface
  id: z.string(),
  firstName: z.string(),
  lastName: z.string().nullable(),
  gender: z.string(),
  createdAt: z.date(),
})
type userSchema = z.infer<typeof userSchema>

// Person to Response
const personToResponse = (person: Selectable<DB['persons']>): userSchema => {
  const response = {
    id: person.id,
    firstName: person.first_name,
    lastName: person.last_name,
    gender: person.gender,
    createdAt: person.created_at,
  } satisfies userSchema
  return response
}

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
    response: z.array(userSchema),
    handler() {
      const handlers = makeHandlers(null, async (req, res) => {
        // query the DB
        const users = await db.selectFrom('persons').selectAll().execute()
        // manually map DB schema to application interface
        const mappedUsers = users.map((user) => personToResponse(user))
        const parseResult =
          UsersController.getUsers.response.safeParse(mappedUsers)

        if (!parseResult.success) {
          res.status(500).json({
            error: parseResult.error,
          })
        }

        if (parseResult.success) {
          res.json(parseResult.data)
        }
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
    response: userSchema,
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

  static createUser = {
    body: userSchema.omit({ id: true, createdAt: true }),
    response: userSchema,
    handler() {
      const handlers = makeHandlers(
        validateRequest({
          body: UsersController.createUser.body,
        }),
        async (req, res) => {
          // insert into DB
          const insertResult = await db
            .insertInto('persons')
            .values({
              first_name: req.body.firstName,
              last_name: req.body.lastName,
              gender: req.body.gender,
            })
            .returningAll()
            .execute()
          // manually map DB schema to application interface
          const mappedUser = personToResponse(insertResult[0])

          const parseResult =
            UsersController.createUser.response.safeParse(mappedUser)

          if (!parseResult.success) {
            res.status(500).json({
              error: parseResult.error,
            })
          }
          if (parseResult.success) {
            res.status(201).json(parseResult.data)
          }
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
