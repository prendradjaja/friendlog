import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.insertInto("account").defaultValues().execute();
  await db.insertInto("account").defaultValues().execute();
  // i.e. add two rows to the table (with auto-generated ids)
  //
  // These will have ids 1 and 2
  //
  // id 1 is Pandu
  // id 2 is dummy user
}

export async function down(db: Kysely<any>): Promise<void> {
  throw new Error("down() not implemented");
}
