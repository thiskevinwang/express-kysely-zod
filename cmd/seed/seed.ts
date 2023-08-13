import { db } from '~shared/database/client'

async function seed() {
  console.log('seeding...')

  // insert 100 users
  await db.transaction().execute(async (trx) => {
    const promises = Array.from({ length: 100 }, (_, i) => {
      return trx
        .insertInto('users')
        .values({ email: `user-${i}@user.com` })
        .returningAll()
        .executeTakeFirstOrThrow()
    })

    await Promise.all(promises)
  })

  // insert 100 actions
  await db.transaction().execute(async (trx) => {
    const promises = Array.from({ length: 100 }, (_, i) => {
      return trx
        .insertInto('actions')
        .values({ name: `action-${i}` })
        .executeTakeFirstOrThrow()
    })
    await Promise.all(promises)
  })
}

seed()
  .then(() => {
    console.log('ok!')
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
