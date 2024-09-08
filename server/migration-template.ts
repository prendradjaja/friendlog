import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  //
}

export async function down(db: Kysely<any>): Promise<void> {
  throw new Error("down() not implemented");
}
