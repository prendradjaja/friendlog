import { Pool } from "pg";
import { Kysely, KyselyConfig, PostgresDialect } from "kysely";
import { loadConfig } from "./config";

const { databaseUrl, useSSLForDatabaseConnection } = loadConfig();

const sslOptions = {
  // Heroku documentation says to use this, but is it insecure?
  rejectUnauthorized: false,
};

export const dbPool = new Pool({
  connectionString: databaseUrl,
  ssl: useSSLForDatabaseConnection ? sslOptions : undefined,
});

const dialect = new PostgresDialect({
  pool: dbPool,
});

export const databaseConfig: KyselyConfig = {
  dialect,
};
