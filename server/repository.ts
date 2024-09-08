import { Kysely, sql } from "kysely";
import { DB } from "./database-types";
import * as db from "./database-types";
import { NewFriend, NewHangout } from "shared";

const panduAccountId = 1;

export class Repository {
  constructor(private db: Kysely<DB>) {}

  public getMyFriends(): Promise<db.Friend[]> {
    return this.db
      .selectFrom("friend")
      .selectAll()
      .where("owner_id", "=", panduAccountId)
      .execute();
  }

  public getFriend(friendId: number): Promise<db.Friend> {
    return this.db
      .selectFrom("friend")
      .selectAll()
      .where("id", "=", friendId)
      .executeTakeFirstOrThrow();
  }

  public createMyFriend(newFriend: NewFriend) {
    return this.db
      .insertInto("friend")
      .values({
        ...newFriend,
        owner_id: panduAccountId,
      })
      .execute();
  }

  public getMyHangouts() {
    return this.db
      .selectFrom("hangout")
      .select([
        "description",
        sql<string>`to_char(hangout_date, 'YYYY-MM-DD')`.as(
          "hangout_date_string",
        ),
        "id",
        "owner_id",
        "title",
      ])
      .where("owner_id", "=", panduAccountId)
      .execute();
  }

  // Given a hangout id, return all the friends associated with that hangout
  public getHangoutFriends(hangoutId: number) {
    return this.db
      .selectFrom("friend_hangout")
      .selectAll()
      .where("hangout_id", "=", hangoutId)
      .execute();
  }

  public async createMyHangout(newHangout: NewHangout) {
    await this.db.transaction().execute(async (trx) => {
      const { friends, ...newHangoutRow } = newHangout;
      const hangout = await trx
        .insertInto("hangout")
        .values([
          {
            ...newHangoutRow,
            owner_id: panduAccountId,
          },
        ])
        .returning("id")
        .executeTakeFirstOrThrow();

      const hangout_id = hangout.id;
      const rows = friends.map((friend_id) => ({
        friend_id,
        hangout_id,
      }));
      await trx.insertInto("friend_hangout").values(rows).execute();
    });
  }
}
