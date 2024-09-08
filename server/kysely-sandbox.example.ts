import { Kysely } from "kysely";
import { DB } from "./raw-database-types";

export function makeQueries(db: Kysely<DB>, dbAny: Kysely<any>) {
  let queries = [];

  queries.push(
    dbAny.schema
      .createTable("book")
      .addColumn("title", "varchar(1000)", (col) => col.notNull())
  );

  // queries.push(
  //   db
  //     .insertInto("book")
  //     .values([{}])
  // );

  return queries;
}
