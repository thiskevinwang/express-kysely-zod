import type { ColumnType } from "kysely";
import type { IPostgresInterval } from "postgres-interval";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Interval = ColumnType<IPostgresInterval, IPostgresInterval | number, IPostgresInterval | number>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Actions {
  id: Generated<string>;
  name: string;
  time_window: Generated<Interval>;
  max_allowed: Generated<number>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface Completions {
  id: Generated<string>;
  prompt: string;
  completion: string;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface UserActionBuckets {
  id: Generated<string>;
  user_id: string;
  action_id: string;
  count: Generated<number>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface UserCompletions {
  id: Generated<string>;
  user_id: string;
  completion_id: string;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface Users {
  id: Generated<string>;
  email: string;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
}

export interface DB {
  actions: Actions;
  completions: Completions;
  user_action_buckets: UserActionBuckets;
  user_completions: UserCompletions;
  users: Users;
}
