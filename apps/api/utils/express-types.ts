import type { RequestHandler } from 'express'

type InferParams<T> = T extends RequestHandler<infer P, any, infer _, infer _>
  ? P
  : never
type InferBody<T> = T extends RequestHandler<infer _, any, infer B, infer _>
  ? B
  : never
type InferQuery<T> = T extends RequestHandler<infer _, any, infer _, infer Q>
  ? Q
  : never
type InferObj<T> = T extends RequestHandler<infer P, any, infer B, infer Q>
  ? {
      params: P
      body: B
      query: Q
    }
  : never

/**
 * @usage
 *
 * ```ts
 * import { z } from 'zod'
 * import { validateRequest } from 'zod-express-middleware'
 *
 * const middleware = validateRequest({
 *   params: z.object({
 *     user_id: z.string(),
 *   }),
 * })
 *
 * const handler: InferredHandler<typeof middleware> = (req, res) => {
 *   // req.params is typed as { user_id: string } ✅
 * }
 * ```
 */
type InferredHandler<T> = RequestHandler<
  InferParams<T>,
  any,
  InferBody<T>,
  InferQuery<T>,
  any
>

/**
 * @usage
 * ```ts
 * const handlers = makeHandlers(
 *   validateRequest({
 *     // ...
 *   }),
 *   (req, res) => {
 *     // req.[params|body|query] will be
 *     // typed based on the previous middleware
 *   },
 * )
 * ```
 *
 * for generic `res` & `req` typing, pass `null` to the first argument
 *
 * ```ts
 * const handlers = makeHandlers(
 *   null,
 *   (req, res) => {}
 * )
 * ```
 */
export function makeHandlers<T = any>(
  middleware: T | null,
  handler: T extends null ? RequestHandler : InferredHandler<T>
) {
  if (middleware === null) {
    return [handler]
  }
  return [middleware, handler]
}
