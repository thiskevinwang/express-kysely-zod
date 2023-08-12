import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // create uuid_with_prefix function
  await sql`
  CREATE OR REPLACE FUNCTION uuid_with_prefix(prefix text) RETURNS TEXT AS $$
  BEGIN
    RETURN concat(prefix, '_', gen_random_uuid());
  END;
  $$ LANGUAGE plpgsql;  
  `.execute(db)

  // create tables
  await sql`
  CREATE TABLE users (
    id         TEXT         PRIMARY KEY DEFAULT uuid_with_prefix('user'),
    CONSTRAINT valid_prefixed_uuid_format CHECK (id ~ '^user_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'),
    email      VARCHAR(50)  UNIQUE NOT NULL,

    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  );
  `.execute(db)

  await sql`
  CREATE TABLE actions (
    id          TEXT         PRIMARY KEY DEFAULT uuid_with_prefix('action'),
    CONSTRAINT  valid_prefixed_uuid_format CHECK (id ~ '^action_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'),
    name        VARCHAR(50)  NOT NULL,
    time_window INTERVAL     NOT NULL DEFAULT '1 hour',
    max_allowed INTEGER      NOT NULL DEFAULT 10,

    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  );
  `.execute(db)

  await sql`
  CREATE TABLE user_action_buckets (
    id           TEXT         PRIMARY KEY DEFAULT uuid_with_prefix('user_action'),
    CONSTRAINT   valid_prefixed_uuid_format CHECK (id ~ '^user_action_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'),
    user_id      TEXT         NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
    action_id    TEXT         NOT NULL REFERENCES actions(id) ON DELETE CASCADE,
    count        INTEGER      NOT NULL DEFAULT 0,

    created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  );
  `.execute(db)

  // create index on users.email for faster lookup
  await sql`
  CREATE INDEX users_email ON users(email);
  `.execute(db)

  // create index on actions.name for faster lookup
  await sql`
  CREATE INDEX actions_name ON actions(name);
  `.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`
  DROP TABLE user_action_log;
  `.execute(db)

  await sql`
  DROP TABLE actions;
  `.execute(db)

  await sql`
  DROP TABLE users;
  `.execute(db)

  await sql`
  DROP FUNCTION IF EXISTS uuid_with_prefix;
  `.execute(db)
}
