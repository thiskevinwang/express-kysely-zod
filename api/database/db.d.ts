import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Persons {
  id: Generated<string>;
  first_name: string;
  last_name: string | null;
  gender: string;
  created_at: Generated<Timestamp>;
}

export interface DB {
  persons: Persons;
}
