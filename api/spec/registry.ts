import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

// This injects the `openapi` method on zod objects
extendZodWithOpenApi(z)

/**
 * Files that want to register openapi objects (paths, components, etc.)
 * should import `registry` and use its methods.
 */
export const registry = new OpenAPIRegistry()
