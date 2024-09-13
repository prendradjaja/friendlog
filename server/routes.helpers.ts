import type { Repository } from "./repository";
import { Hangout } from "shared";

export function unflattenHangouts(
  rows: Awaited<ReturnType<Repository["getHangouts"]>>,
): Hangout[] {
  const resultsMap: Map<number, Hangout> = new Map();
  for (const row of rows) {
    const { friend_id, friend_name, friend_owner_id, ...hangoutProperties } =
      row;
    let hangout = resultsMap.get(row.id);
    if (!hangout) {
      hangout = {
        ...hangoutProperties,
        friends: [],
      };
      resultsMap.set(row.id, hangout);
    }
    hangout.friends.push({
      id: friend_id,
      name: friend_name,
      owner_id: friend_owner_id,
    });
  }
  return Array.from(resultsMap.values());
}
