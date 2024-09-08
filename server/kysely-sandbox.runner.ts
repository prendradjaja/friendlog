import { Kysely, PostgresDialect, KyselyConfig } from "kysely";
import { Pool } from "pg";
import { DB } from "./raw-database-types";

export interface Compilable {
  compile: () => { sql: string };
}

async function main() {
  let makeQueries;
  try {
    // @ts-ignore
    makeQueries = (await import("./kysely-sandbox")).makeQueries;
  } catch {
    console.log("kysely-sandbox requires setup:");
    console.log("  cp kysely-sandbox.example.ts kysely-sandbox.ts");
    console.log("  npm run kysely-sandbox");
    return;
  }

  const { db, dbAny } = getDatabases();

  const queries: Compilable[] = makeQueries(db, dbAny);

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
