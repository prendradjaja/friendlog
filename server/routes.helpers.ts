import type { Repository } from "./repository";
import { Hangout } from "shared";

async function main() {
  const { Repository } = await import("./repository");
  const repo = new Repository();
  const rows = await repo.getHangouts(3, 13);
  console.table(rows);
  const results = unflattenHangouts(rows);
  console.log(JSON.stringify(results, null, 2));
}

export function unflattenHangouts(
  rows: Awaited<ReturnType<Repository["getHangouts"]>>,
): Hangout[] {
  const resultsMap: Map<number, Hangout> = new Map();
  for (const row of rows) {
    const { friend_id, friend_name, friend_owner_id, ...hangoutProperties } =
      row;
    let hangout: Hangout;
    const match = resultsMap.get(row.id);
    if (match !== undefined) {
      hangout = match;
    } else {
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
  const results: Hangout[] = Array.from(resultsMap.values());
  return results;
}

main();
