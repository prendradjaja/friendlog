import { Kysely } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable("friend")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("owner_id", "integer", (col) =>
      col.references("account.id").notNull(),
    )
    .addColumn("name", "varchar(1000)", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("hangout")
    .addColumn("id", "serial", (col) => col.primaryKey())
    .addColumn("owner_id", "integer", (col) =>
      col.references("account.id").notNull(),
    )
    .addColumn("hangout_date", "date", (col) => col.notNull())
    .addColumn("title", "varchar(1000)", (col) => col.notNull())
    .addColumn("description", "varchar(1000)", (col) => col.notNull())
    .execute();

  await db.schema
    .createTable("friend_hangout")
    .addColumn("friend_id", "integer", (col) =>
      col.references("friend.id").notNull(),
    )
    .addColumn("hangout_id", "integer", (col) =>
      col.references("hangout.id").notNull(),
    )
    .addPrimaryKeyConstraint("friend_hangout_pkey", ["friend_id", "hangout_id"])
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  throw new Error("down() not implemented");
}
