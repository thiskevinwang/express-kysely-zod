import * as path from 'path'

import { config } from 'dotenv'
import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'

config({
  // note: this relative path creation is a bit tedious helps
  // avoid having a nested `.env` file, and leveraging a root
  // `.env` file instead
  path: path.join(__dirname, '../../..', '.env'),
  debug: true,
})

const dialect = new PostgresDialect({
  pool: new Pool({
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
      ? parseInt(process.env.POSTGRES_PORT)
      : undefined,
    max: 10,
  }),
})

export const db = new Kysely({
  dialect,
})
