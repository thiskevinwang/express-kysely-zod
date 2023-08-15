import express from 'express'
import { sql } from 'kysely'

import { db } from '@/database/client'

const router = express()
export default router

router.get('/', async (req, res) => {
  res.send('hello world')
})

router.get('/health', async (req, res) => {
  const result = await sql<{ names: string[] }>`
  SELECT array_agg(table_name)::text[] AS names
  FROM information_schema.tables
  WHERE table_schema = 'public';
  `.execute(db)

  res.json(result.rows[0].names)
})
