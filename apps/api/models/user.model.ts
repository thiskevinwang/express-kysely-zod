import { Selectable } from 'kysely'
import { z } from 'zod'

import { db } from '@/database/client'
import { DB } from '@/generated/db'

const RX = /^user_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

/** schema from the database */ type UserDBSchema = Selectable<DB['users']>

/** schema for the application */ type UserAppSchema = {
  id: string
  email: string
  createdAt: Date
}

// See "ZodType with ZodEffects" to get a sense of the verbose schemas in this file.
// https://github.com/colinhacks/zod#zodtype-with-zodeffects

const UserDbToAppSchema: z.ZodType<UserAppSchema, z.ZodTypeDef, UserDBSchema> =
  z
    /*from db*/ .object({
      id: z.string().regex(RX),
      email: z.string().email(),
      created_at: z.date(),
    })
    /*to app*/ .transform((user) => ({
      id: user.id,
      email: user.email,
      createdAt: user.created_at,
    }))
type UserDbToAppSchema = z.infer<typeof UserDbToAppSchema>

// opposite of UserDbToAppSchema
export const UserAppToDbSchema: z.ZodType<
  UserDBSchema,
  z.ZodTypeDef,
  UserAppSchema
> = z
  /*from app*/ .object({
    id: z.string().regex(RX),
    email: z.string().email(),
    createdAt: z.date(),
  })
  /*to db*/ .transform((user) => ({
    id: user.id,
    email: user.email,
    created_at: user.createdAt,
  }))
type UserAppToDbSchema = z.infer<typeof UserAppToDbSchema>

// A class to abstract away the db-and-app schema transformation logic
// behind simple methods
class User implements UserAppSchema {
  id: string
  email: string
  createdAt: Date

  constructor({ id, email, createdAt }: UserAppSchema) {
    this.id = id
    this.email = email
    this.createdAt = createdAt
  }

  // zod parsing and transformation happens within these methods
  static fromDb(data: UserDBSchema): User {
    const res = UserDbToAppSchema.safeParse(data)

    if (!res.success) {
      console.error(res.error)
      throw new Error(`[User.fromDb] invalid user schema`)
    }

    return new User(res.data)
  }
  toDb(this: User): UserAppToDbSchema {
    const res = UserAppToDbSchema.safeParse({
      id: this.id,
      email: this.email,
      createdAt: this.createdAt,
    })

    // Should not realistically happen
    if (!res.success) {
      console.error(res.error)
      throw new Error(`[User.toDb] invalid user schema`)
    }

    return res.data
  }
}

// What the app will actually consume, and get nicely typed interfaces...
// - UserRepository.getOneById("user_...")
// - UserRepository.createOne({ email: "..." })
export class UserRepository {
  // arbitrary database queries with full type safety
  static async getOneById(id: string) {
    const data = await db
      .selectFrom('users')
      .where('id', '=', id)
      .select(['id', 'email', 'created_at'])
      .executeTakeFirstOrThrow()

    return User.fromDb(data)
  }

  static async getAll() {
    const data = await db
      .selectFrom('users')
      .select(['id', 'email', 'created_at'])
      .orderBy('created_at', 'desc')
      .execute()

    return data.map(User.fromDb)
  }

  static async createOne({ email }: Omit<UserAppSchema, 'id' | 'createdAt'>) {
    const data = await db
      .insertInto('users')
      .values({
        email: email,
      })
      .returning(['id', 'email', 'created_at'])
      .executeTakeFirstOrThrow()

    return User.fromDb(data)
  }

  static async updateOne(data: User) {
    const res = await db
      .updateTable('users')
      .set({ created_at: data.createdAt, email: data.email })
      .where('id', '=', data.id)
      .returning(['id', 'email', 'created_at'])
      .executeTakeFirstOrThrow()

    return User.fromDb(res)
  }
}
