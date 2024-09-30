import { Hangout, NewFriend, Friend, NewHangout, HangoutUpdate } from "shared";
import { encrypt, decrypt } from "./encrypt-string";

export function encryptHangoutUpdate(
  hangout: HangoutUpdate | NewHangout,
  key: string,
): HangoutUpdate | NewHangout {
  return {
    ...hangout,
    title: encrypt(hangout.title, key),
  };
}

export function decryptHangout(hangout: Hangout, key: string): Hangout {
  return {
    ...hangout,
    title: decrypt(hangout.title, key),
    friends: hangout.friends.map((friend) => decryptFriend(friend, key)),
  };
}

export function encryptFriendUpdate(friend: NewFriend, key: string): NewFriend {
  return {
    ...friend,
    name: encrypt(friend.name, key),
  };
}

export function decryptFriend(friend: Friend, key: string): Friend {
  return {
    ...friend,
    name: decrypt(friend.name, key),
  };
}
