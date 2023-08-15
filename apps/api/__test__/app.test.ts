import request from 'supertest'

import { app } from '@/app'

describe('app', () => {
  it('should be defined', () => {
    expect(app).toBeDefined()
  })

  describe('GET /', () => {
    it('should return a basic response', async () => {
      const response = await request(app).get('/')
      expect(response.text).toEqual('hello world')
    })
  })

  describe('GET /health', () => {
    it('should return a basic response', async () => {
      const response = await request(app).get('/health')
      expect(response.body).toMatchInlineSnapshot(`
[
  "kysely_migration",
  "kysely_migration_lock",
  "users",
  "actions",
  "user_action_buckets",
  "completions",
  "user_completions",
]
`)
    })
  })
})
