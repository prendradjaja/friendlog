import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  // Session table is required for connect-pg-simple, which is part of our
  // auth+sessions stack.
  //
  // See readme: https://www.npmjs.com/package/connect-pg-simple
  //
  // This SQL code is copied from the SQL file provided by that library.
  //
  // Here's the version I fetched:
  //
  // https://github.com/voxpelli/node-connect-pg-simple/blob/21e41c445318a5337cc155fd8dad5820601b6ef2/table.sql

  sql`

    CREATE TABLE "session" (
      "sid" varchar NOT NULL COLLATE "default",
      "sess" json NOT NULL,
      "expire" timestamp(6) NOT NULL
    )
    WITH (OIDS=FALSE);

    ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

    CREATE INDEX "IDX_session_expire" ON "session" ("expire");

  `.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  throw new Error("down() not implemented");
}
