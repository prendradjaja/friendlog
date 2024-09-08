import {
  ExampleMessage,
  MyFriendsResponse,
  NewFriend,
  NewHangout,
  Hangout,
} from "shared";
import { baseUrl } from "./base-url";

async function myFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(baseUrl + path, options);
  if (res.status === 200) {
    return res.json();
  } else {
    return Promise.reject(await res.json());
  }
}

export function getExampleMessageById(
  messageId: number,
): Promise<ExampleMessage> {
  return myFetch("/api/example-messages/" + messageId);
}

export function getMyFriends(): Promise<MyFriendsResponse> {
  return myFetch("/api/me/friends");
}

export function createMyFriend(newFriend: NewFriend): Promise<{}> {
  return myFetch("/api/me/friends", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newFriend),
  });
}

export function getMyHangouts(): Promise<Hangout[]> {
  return myFetch("/api/me/hangouts");
}

export function getMyHangoutsWithOneFriend(
  friendId: number,
): Promise<Hangout[]> {
  return myFetch(`/api/me/friends/${friendId}/hangouts`);
}

export function createMyHangout(newHangout: NewHangout): Promise<{}> {
  return myFetch("/api/me/hangouts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newHangout),
  });
}
