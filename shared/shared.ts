import * as db from "server/database-types";
import type { Repository } from "server/repository";
import { Prettify } from "ts-essentials";

export type LoginStatus =
  | {
      isLoggedIn: false;
    }
  | {
      isLoggedIn: true;
      user: { name: string };
    };

export interface ExampleMessage {
  value: string;
}

export type Friend = db.Friend;
export type NewFriend = Pick<db.NewFriend, "name">;

export type Hangout = Prettify<
  Omit<db.Hangout, "hangout_date"> & {
    friends: db.Friend[];
    hangout_date_string: string;
  }
>;
export type NewHangout = Prettify<
  Omit<db.NewHangout, "id" | "owner_id" | "hangout_date"> & {
    friends: number[];
    hangout_date_string: string;
  }
>;
export type HangoutUpdate = NewHangout;

export type MyFriendsResponse = ReturnType<Repository["getMyFriends"]>;
export type MyHangoutsResponse = Hangout[];

export interface CreateFriendResponse {
  id: number;
}
