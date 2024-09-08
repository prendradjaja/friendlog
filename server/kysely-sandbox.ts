import { Kysely, PostgresDialect, KyselyConfig } from "kysely";
import { Pool } from "pg";
import { DB } from "./raw-database-types";

interface Compilable {
  compile: () => { sql: string };
}

async function main() {
  const { db, dbAny } = getDatabases();

  let queries: Compilable[] = [];

  queries.push(
    dbAny.schema
      .createTable("book")
      .addColumn("title", "varchar(1000)", (col) => col.notNull()),
  );

  // queries.push(db.selectFrom("book"));

  for (const query of queries) {
    const compiled = query.compile();
    console.log(compiled.sql);
    console.log((compiled as any).parameters); // todo Make this typesafe
    console.log();
  }
}

function getDatabases() {
  const dialect = new PostgresDialect({
    pool: new Pool({
      connectionString: "postgres://localhost/nonexistent_database",
    }),
  });
  const databaseConfig: KyselyConfig = {
    dialect,
  };

  const dbAny = new Kysely<any>(databaseConfig);
  const db = new Kysely<DB>(databaseConfig);

  return { db, dbAny };
}

main();
