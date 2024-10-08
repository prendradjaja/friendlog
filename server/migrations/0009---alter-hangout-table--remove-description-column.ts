import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable("hangout").dropColumn("description").execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  throw new Error("down() not implemented");
}