import { Kysely, sql } from "kysely";
import { DB } from "./database-types";
import * as db from "./database-types";
import { NewFriend, NewHangout } from "shared";
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

  public getMyHangouts(userId: number) {
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
      .where("owner_id", "=", userId)
      .orderBy(["hangout_date desc", "id desc"])
      .execute();
  }

  // Given a hangout id, return all the friends associated with that hangout
  public getHangoutFriends(hangoutId: number) {
    // todo Maybe prevent getting another user's data
    return this.db
      .selectFrom("friend_hangout")
      .selectAll()
      .where("hangout_id", "=", hangoutId)
      .execute();
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

  // Auth methods

  public async getAccountIdViaFederatedIdentity(
    provider: string,
    subject: string,
  ): Promise<number | undefined> {
    const rows = await this.db
      .selectFrom("federated_credential")
      .select(["account_id"]) // todo Passportjs example used SELECT *
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
    // Promise<{ id: number, name: string }>
    return this.db
      .selectFrom("account")
      .select(["id", "name"]) // todo Passportjs example used SELECT *
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
