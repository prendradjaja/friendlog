import {
  LoginStatus,
  ExampleMessage,
  MyFriendsResponse,
  NewFriend,
  NewHangout,
  Hangout,
  CreateFriendResponse,
  HangoutUpdate,
  FriendUpdate,
} from "shared";
import { baseUrl } from "./base-url";
import { getEncryptionKeySnapshot } from "./local-storage-items";
import {
  decryptHangout,
  decryptFriend,
  encryptFriendUpdate,
  encryptHangoutUpdate,
} from "./encryption/encrypt-data";

const encryptionKey = getEncryptionKeySnapshot();

async function myFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(baseUrl + path, options);
  if (res.status === 200) {
    return res.json();
  } else {
    return Promise.reject(await res.json());
  }
}

export function getLoginStatus(): Promise<LoginStatus> {
  return myFetch("/api/me");
}

export function getExampleMessageById(
  messageId: number,
): Promise<ExampleMessage> {
  return myFetch("/api/example-messages/" + messageId);
}

export async function getMyFriends(): Promise<MyFriendsResponse> {
  const friends = await myFetch<MyFriendsResponse>("/api/me/friends");
  return friends.map((friend) => decryptFriend(friend, encryptionKey));
}

export function createMyFriend(
  newFriend: NewFriend,
): Promise<CreateFriendResponse> {
  const newFriendEncrypted = encryptFriendUpdate(newFriend, encryptionKey);
  return myFetch("/api/me/friends", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newFriendEncrypted),
  });
}

export function updateFriend(
  friendId: number,
  friendUpdate: FriendUpdate,
): Promise<void> {
  const friendUpdateEncrypted = encryptFriendUpdate(
    friendUpdate,
    encryptionKey,
  );
  return myFetch(`/api/me/friends/${friendId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(friendUpdateEncrypted),
  });
}

export async function getMyHangouts(): Promise<Hangout[]> {
  const hangouts = await myFetch<Hangout[]>("/api/me/hangouts");
  return hangouts.map((hangout) => decryptHangout(hangout, encryptionKey));
}

export async function getMyHangoutsWithOneFriend(
  friendId: number,
): Promise<Hangout[]> {
  const hangouts = await myFetch<Hangout[]>(
    `/api/me/friends/${friendId}/hangouts`,
  );
  return hangouts.map((hangout) => decryptHangout(hangout, encryptionKey));
}

export function createMyHangout(newHangout: NewHangout): Promise<{}> {
  const newHangoutEncrypted = encryptHangoutUpdate(newHangout, encryptionKey);
  return myFetch("/api/me/hangouts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newHangoutEncrypted),
  });
}

export async function getHangout(hangoutId: number): Promise<Hangout> {
  const hangout = await myFetch<Hangout>("/api/me/hangouts/" + hangoutId);
  return decryptHangout(hangout, encryptionKey);
}

export function updateHangout(
  hangoutId: number,
  hangoutUpdate: HangoutUpdate,
): Promise<{}> {
  const hangoutUpdateEncrypted = encryptHangoutUpdate(
    hangoutUpdate,
    encryptionKey,
  );
  return myFetch("/api/me/hangouts/" + hangoutId, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(hangoutUpdateEncrypted),
  });
}

export function deleteHangout(hangoutId: number): Promise<{}> {
  return myFetch("/api/me/hangouts/" + hangoutId, {
    method: "DELETE",
  });
}
