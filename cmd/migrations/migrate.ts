import { promises as fs } from 'fs'
import * as path from 'path'

import { FileMigrationProvider, Migrator, NO_MIGRATIONS } from 'kysely'
import { db } from '~shared/database/client'

async function migrateToLatest() {
  const migrationsFolder = path.join(__dirname, 'files')

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: migrationsFolder,
    }),
  })
  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('failed to migrate')
    console.error(error)
    process.exit(1)
  }

  console.log('OK!')

  await db.destroy()
}

async function tearDown() {
  const migrationsFolder = path.join(__dirname, 'migrations')

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: migrationsFolder,
    }),
  })
  const { error, results } = await migrator.migrateTo(NO_MIGRATIONS)
  console.log(results)
  // {
  //   migrationName: '2023-07-30T16:19:09Z',
  //   direction: 'Down',
  //   status: 'Success'
  // }
  console.log(error)

  await db.destroy()
}

migrateToLatest()
// tearDown()
