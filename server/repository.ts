import { Kysely, sql } from "kysely";
import { DB } from "./database-types";
import * as db from "./database-types";
import {
  FriendUpdate,
  Hangout,
  HangoutUpdate,
  NewFriend,
  NewHangout,
} from "shared";
import { databaseConfig } from "./database";

export class Repository {
  private db = new Kysely<DB>(databaseConfig);

  public getMyFriends(userId: number): Promise<db.Friend[]> {
    return this.db
      .selectFrom("friend")
      .selectAll()
      .where("owner_id", "=", userId)
      .orderBy("name asc")
      .execute();
  }

  public getFriend(friendId: number): Promise<db.Friend> {
    // todo Maybe prevent getting another user's data
    return this.db
      .selectFrom("friend")
      .selectAll()
      .where("id", "=", friendId)
      .executeTakeFirstOrThrow();
  }

  public updateFriend(
    userId: number,
    friendId: number,
    friendUpdate: FriendUpdate,
  ): Promise<void> {
    return this.db
      .updateTable("friend")
      .set(friendUpdate)
      .where("id", "=", friendId)
      .where("owner_id", "=", userId)
      .execute()
      .then(() => {});
  }

  public createMyFriend(userId: number, newFriend: NewFriend) {
    return this.db
      .insertInto("friend")
      .values({
        ...newFriend,
        owner_id: userId,
      })
      .returning("id")
      .execute();
  }

  /**
   * For a given user, get:
   * - all hangouts, OR
   * - all hangouts with a given friend
   */
  public async getHangouts(userId: number, friendId?: number) {
    // todo Maybe prevent getting another user's data
    let query = this.getHangoutsQuery(this.db, userId);
    if (friendId !== undefined) {
      query = query.where("hangout.id", "in", (qb) =>
        qb
          .selectFrom("friend_hangout")
          .select("hangout_id")
          .where("friend_id", "=", friendId),
      );
    }
    return query.execute();
  }

  public async getHangout(userId: number, hangoutId: number) {
    return this.getHangoutsQuery(this.db, userId)
      .where("hangout.id", "=", hangoutId)
      .execute();
  }

  private getHangoutsQuery(dbOrTransaction: Kysely<DB>, userId: number) {
    return dbOrTransaction
      .selectFrom("hangout")
      .innerJoin("friend_hangout as fh", "hangout.id", "fh.hangout_id")
      .innerJoin("friend", "friend.id", "fh.friend_id")
      .orderBy(["hangout_date desc", "id desc"])
      .where("hangout.owner_id", "=", userId)
      .select([
        "hangout.id",
        sql<string>`to_char(hangout_date, 'YYYY-MM-DD')`.as(
          "hangout_date_string",
        ),
        "hangout.title",
        "hangout.owner_id",
        "hangout.description",

        "friend.id as friend_id",
        "friend.name as friend_name",
        "friend.owner_id as friend_owner_id",
      ]);
  }

  public async createMyHangout(userId: number, newHangout: NewHangout) {
    // todo Probably check the friends all belong to the given user
    await this.db.transaction().execute(async (trx) => {
      const { friends, hangout_date_string, ...newHangoutRow } = newHangout;
      const hangout = await trx
        .insertInto("hangout")
        .values([
          {
            ...newHangoutRow,
            hangout_date: hangout_date_string,
            owner_id: userId,
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

  public async updateHangout(
    userId: number,
    hangoutId: number,
    hangoutUpdate: HangoutUpdate,
  ) {
    // todo Probably check the friends all belong to the given user
    await this.db.transaction().execute(async (trx) => {
      const {
        friends: newFriends,
        hangout_date_string: hangout_date,
        ...hangoutUpdate2
      } = hangoutUpdate; // todo hangoutUpdate2 (& 3) are a code smell: Maybe split into smaller functions

      // Add and/or remove friends
      const oldFriends = (
        await this.getHangoutsQuery(trx, userId)
          .where("hangout.id", "=", hangoutId)
          .execute()
      ).map((hangout) => hangout.friend_id);
      const oldFriendsSet = new Set(oldFriends);
      const newFriendsSet = new Set(newFriends);
      const friendsToAdd = Array.from(
        setDifference(newFriendsSet, oldFriendsSet),
      );
      const friendsToRemove = Array.from(
        setDifference(oldFriendsSet, newFriendsSet),
      );
      const rowsToAdd = friendsToAdd.map((friend_id) => ({
        friend_id,
        hangout_id: hangoutId,
      }));
      if (rowsToAdd.length) {
        await trx.insertInto("friend_hangout").values(rowsToAdd).execute();
      }
      if (friendsToRemove.length) {
        await trx
          .deleteFrom("friend_hangout")
          .where("hangout_id", "=", hangoutId)
          .where("friend_id", "in", friendsToRemove)
          .execute();
      }

      // Update the other columns
      const hangoutUpdate3 = {
        ...hangoutUpdate2,
        hangout_date,
      };
      await trx
        .updateTable("hangout")
        .set(hangoutUpdate3)
        .where("id", "=", hangoutId)
        .execute();
    });
  }

  public async deleteHangout(userId: number, hangoutId: number) {
    await this.db.transaction().execute(async (trx) => {
      const { owner_id } = await trx
        .selectFrom("hangout")
        .select("owner_id")
        .where("id", "=", hangoutId)
        .executeTakeFirstOrThrow();

      if (owner_id !== userId) {
        throw new Error("Can't delete another user's hangout");
      }

      await trx
        .deleteFrom("friend_hangout")
        .where("hangout_id", "=", hangoutId)
        .execute();

      await trx.deleteFrom("hangout").where("id", "=", hangoutId).execute();
    });
  }

  // Auth methods

  public async getAccountIdViaFederatedIdentity(
    provider: string,
    subject: string,
  ): Promise<number | undefined> {
    const rows = await this.db
      .selectFrom("federated_credential")
      .select(["account_id"])
      .where("provider", "=", provider)
      .where("subject", "=", subject)
      .limit(1)
      .execute();

    if (rows.length) {
      return rows[0].account_id;
    } else {
      return undefined;
    }
  }

  public getAccount(id: number) {
    return this.db
      .selectFrom("account")
      .select(["id", "name"])
      .where("id", "=", id)
      .executeTakeFirstOrThrow();
  }

  public async createAccount(name: string): Promise<number> {
    const rows = await this.db
      .insertInto("account")
      .values([
        {
          name,
        },
      ])
      .returning(["id"])
      .execute();
    return rows[0].id;
  }

  public createFederatedCredential(
    account_id: number,
    provider: string,
    subject: string,
  ) {
    return this.db
      .insertInto("federated_credential")
      .values([
        {
          account_id,
          provider,
          subject,
        },
      ])
      .execute();
  }
}

// todo Use built-in Set.difference() -- need to change some config to enable this
function setDifference<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  const result = new Set<T>();
  for (const item of set1) {
    if (!set2.has(item)) {
      result.add(item);
    }
  }
  return result;
}
