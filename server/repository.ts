import { Kysely, sql } from "kysely";
import { DB } from "./database-types";
import * as db from "./database-types";
import { Hangout, NewFriend, NewHangout } from "shared";
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
    let query = this.getHangoutsQuery(userId);
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
    return this.getHangoutsQuery(userId)
      .where("hangout.id", "=", hangoutId)
      .execute();
  }

  private getHangoutsQuery(userId: number) {
    return this.db
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
