import { db } from '~shared/database/client'

async function seed() {
  console.log('seeding...')

  // insert 100 users
  db.transaction().execute(async (trx) => {
    const promises = Array.from({ length: 100 }, (_, i) => {
      return trx
        .insertInto('users')
        .values({ email: `user-${i}@user.com` })
        .returningAll()
        .executeTakeFirstOrThrow()
    })

    await Promise.all(promises)
  })
}

seed()
