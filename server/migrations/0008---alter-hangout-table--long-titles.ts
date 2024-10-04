import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("hangout")
    .alterColumn("title", (cb) => cb.setDataType("varchar(10000)"))
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  throw new Error("down() not implemented");
}
