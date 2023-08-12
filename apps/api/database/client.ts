import { config } from 'dotenv'
import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'

// @ts-ignore - this is a generated file and is expected to cause a type error if not generated yet
import { DB } from '../generated/db'

config()

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

export const db = new Kysely<DB>({
  dialect,
})
