import { Kysely, sql } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  // case-insensitive text type
  await sql`
  CREATE EXTENSION IF NOT EXISTS citext;
  `.execute(db)

  await sql`
  CREATE TABLE completions (
    id          TEXT         PRIMARY KEY DEFAULT uuid_with_prefix('completion'),
    CONSTRAINT  valid_prefixed_uuid_format CHECK (id ~ '^completion_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'),
    prompt      CITEXT       NOT NULL,
    completion  CITEXT       NOT NULL,

    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
  );

  CREATE TRIGGER completions_updated_at
  BEFORE UPDATE ON completions
  FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);
  `.execute(db)

  await sql`
  CREATE TABLE user_completions (
    id            TEXT          PRIMARY KEY DEFAULT uuid_with_prefix('usr_cmp'),
    CONSTRAINT    valid_prefixed_uuid_format CHECK (id ~ '^usr_cmp_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'),
    user_id       TEXT          NOT NULL REFERENCES users(id)       ON DELETE CASCADE,
    completion_id TEXT          NOT NULL REFERENCES completions(id) ON DELETE CASCADE,

    created_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ    NOT NULL DEFAULT NOW()
  );

  CREATE TRIGGER user_completions_updated_at
  BEFORE UPDATE ON user_completions
  FOR EACH ROW EXECUTE PROCEDURE moddatetime(updated_at);
  `.execute(db)

  // Restrict to maximum of one user_completion per user and completion
  await sql`
  CREATE UNIQUE INDEX users_completions_idx ON user_completions(user_id, completion_id);
  `.execute(db)
}

export async function down(db: Kysely<any>): Promise<void> {}
