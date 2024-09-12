import type * as tables from "./raw-database-types";
import type { Selectable, Insertable, Updateable } from "kysely";

export type Account = Selectable<tables.Account>;
export type NewAccount = Insertable<tables.Account>;
export type AccountUpdate = Updateable<tables.Account>;

export type Friend = Selectable<tables.Friend>;
export type NewFriend = Insertable<tables.Friend>;
export type FriendUpdate = Updateable<tables.Friend>;

export type Hangout = Selectable<tables.Hangout>;
export type NewHangout = Insertable<tables.Hangout>;
export type HangoutUpdate = Updateable<tables.Hangout>;

export type FriendHangout = Selectable<tables.FriendHangout>;
export type NewFriendHangout = Insertable<tables.FriendHangout>;
export type FriendHangoutUpdate = Updateable<tables.FriendHangout>;

export type { DB } from "./raw-database-types";
