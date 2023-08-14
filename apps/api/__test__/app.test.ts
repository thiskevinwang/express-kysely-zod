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
})
