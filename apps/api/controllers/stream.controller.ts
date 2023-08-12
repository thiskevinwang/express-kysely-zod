// transitive dependency of `@asteasolutions/zod-to-openapi`
import type { TagObject } from 'openapi3-ts/oas31'
import { z } from 'zod'
import { validateRequest } from 'zod-express-middleware'

import { registry } from '@/spec/registry'
import { makeHandlers } from '@/utils/express-types'

export class StreamController {
  // For ApiDocs
  static spec: {
    tag: TagObject
  } = {
    tag: {
      name: 'Stream',
      description: 'Operations for testing streaming data',
    },
  }

  static getStream = {
    response: z.string(),
    query: z
      .object({
        delay: z
          .preprocess((input) => {
            const processed = z
              .string()
              .regex(/^\d+$/)
              .transform(Number)
              .safeParse(input)
            return processed.success ? processed.data : input
          }, z.number().min(0).max(100))
          .optional(),
      })
      .openapi({
        example: { delay: 100 },
        description: 'Delay in ms; Cannot exceed 100ms',
      }),
    handler() {
      const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms))
      const handlers = makeHandlers(
        validateRequest({
          query: StreamController.getStream.query,
        }),
        async (req, res) => {
          const waitTime = (req.query.delay || 50) as number
          for (let i = 0; i < 10; i++) {
            await sleep(waitTime)
            res.write(`data: ${i}\n`)
          }
          res.end()
        }
      )
      return handlers
    },
  }
}

registry.registerPath({
  method: 'get',
  operationId: 'getStream',
  path: '/stream',
  tags: [StreamController.spec.tag.name],
  summary: 'Stream data',
  description: 'Stream',
  request: {
    query: StreamController.getStream.query,
  },
  responses: {
    200: {
      description: 'A stream of data',
      content: {
        'text/html; charset=UTF-8': {
          schema: StreamController.getStream.response,
        },
      },
    },
  },
})
