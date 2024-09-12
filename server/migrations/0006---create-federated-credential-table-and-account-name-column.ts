import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable("account")
    .addColumn("name", "varchar(1000)", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("federated_credential")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("account_id", "integer", (col) =>
      col.references("account.id").notNull(),
    )
    .addColumn("provider", "varchar(1000)", (col) => col.notNull())
    .addColumn("subject", "varchar(1000)", (col) => col.notNull())
    .addUniqueConstraint("", ["provider", "subject"])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  throw new Error("down() not implemented");
}
