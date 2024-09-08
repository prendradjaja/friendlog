import * as db from "server/database-types";
import type { Repository } from "server/repository";

export interface ExampleMessage {
  value: string;
}

export type Hangout = db.Hangout & {
  friends: db.Friend[];
};

export type Friend = db.Friend;

export type NewFriend = Pick<db.NewFriend, "name">;

export type NewHangout = Omit<db.NewHangout, "owner_id"> & {
  friends: number[];
};

export type MyFriendsResponse = ReturnType<Repository["getMyFriends"]>;
export type MyHangoutsResponse = Hangout[];
