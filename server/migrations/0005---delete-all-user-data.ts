import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.deleteFrom("friend_hangout").execute();
  await db.deleteFrom("friend").execute();
  await db.deleteFrom("hangout").execute();
  await db.deleteFrom("account").execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  throw new Error("down() not implemented");
}
