import { Kysely } from "kysely";

import { encrypt, decrypt } from "client/src/encryption/encrypt-string";

import { accountId, key } from "./TEMP_encrypt-existing-data.secrets";
import { databaseConfig } from "./database";
import { DB } from "./database-types";

async function main() {
  const db = new Kysely<DB>(databaseConfig);

  console.log("Getting hangouts...");
  const hangouts = await db
    .selectFrom("hangout")
    .select(["id", "title"])
    .where("owner_id", "=", accountId)
    .execute();
  console.log(`Got ${hangouts.length} hangouts.`);

  console.log("\nEncrypting hangout titles...");
  let i = 0;
  for (const hangout of hangouts) {
    i++;
    await db
      .updateTable("hangout")
      .set({ title: encrypt(hangout.title, key) })
      .where("id", "=", hangout.id)
      .execute();
    console.log(i);
  }

  console.log("\nGetting friends...");
  const friends = await db
    .selectFrom("friend")
    .select(["id", "name"])
    .where("owner_id", "=", accountId)
    .execute();
  console.log(`Got ${friends.length} friends.`);

  console.log("\nEncrypting friend names...");
  i = 0;
  for (const friend of friends) {
    i++;
    await db
      .updateTable("friend")
      .set({ name: encrypt(friend.name, key) })
      .where("id", "=", friend.id)
      .execute();
    console.log(i);
  }
}

main();
