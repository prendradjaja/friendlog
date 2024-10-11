import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("hangout")
    .addColumn("private", "boolean", (cb) => cb.notNull().defaultTo("false"))
    .execute();
  await db.schema
    .alterTable("hangout")
    .alterColumn("private", (cb) => cb.dropDefault())
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  throw new Error("down() not implemented");
}
