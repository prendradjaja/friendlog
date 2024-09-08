import { Pool } from "pg";
import { Kysely, KyselyConfig, PostgresDialect } from "kysely";
import { loadConfig } from "./config";

const { databaseUrl, useSSLForDatabaseConnection } = loadConfig();

const sslOptions = {
  // Heroku documentation says to use this, but is it insecure?
  rejectUnauthorized: false,
};

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: databaseUrl,
    ssl: useSSLForDatabaseConnection ? sslOptions : undefined,
  }),
});

export const databaseConfig: KyselyConfig = {
  dialect,
};
