// Usage:
//   npm run migrate-to-latest-local
//     OR
//   npm run migrate-to-latest-prod
//
// This file is mostly copied directly from the documentation:
// https://kysely.dev/docs/migrations

import * as path from "path";
import { Pool } from "pg";
import { promises as fs } from "fs";
import {
  Kysely,
  Migrator,
  PostgresDialect,
  FileMigrationProvider,
} from "kysely";
import { loadConfig } from "./config";
import { databaseConfig } from "./database";

async function migrateToLatest() {
  const { databaseUrl } = loadConfig();

  const db = new Kysely<unknown>(databaseConfig);

  // As long as this script is run via `npm run`, the working directory will
  // be the server directory
  const serverDir = process.cwd();

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      // This needs to be an absolute path. (See https://kysely.dev/docs/migrations)
      migrationFolder: path.join(serverDir, "migrations"),
    }),
  });

  const { error, results } = await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === "Success") {
      console.log(`migration "${it.migrationName}" was executed successfully`);
    } else if (it.status === "Error") {
      console.error(`failed to execute migration "${it.migrationName}"`);
    }
  });

  if (error) {
    console.error("failed to migrate");
    console.error(error);
    process.exit(1);
  }

  await db.destroy();
}

migrateToLatest();
