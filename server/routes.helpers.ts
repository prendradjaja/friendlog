import type { Repository } from "./repository";
import { Hangout } from "shared";

async function main() {
  const { Repository } = await import("./repository");
  const repo = new Repository();
  const rows = await repo.getHangouts(3, 10);
  const results = unflattenHangouts(rows);
  console.log(JSON.stringify(results, null, 2));
}

export function unflattenHangouts(
  rows: Awaited<ReturnType<Repository["getHangouts"]>>,
): Hangout[] {
  const results: Hangout[] = [];
  for (const row of rows) {
    const { friend_id, friend_name, friend_owner_id, ...hangoutProperties } =
      row;
    let hangout: Hangout;
    const match = results.find((result) => result.id === row.id);
    if (match !== undefined) {
      hangout = match;
    } else {
      hangout = {
        ...hangoutProperties,
        friends: [],
      };
      results.push(hangout);
    }
    hangout.friends.push({
      id: friend_id,
      name: friend_name,
      owner_id: friend_owner_id,
    });
  }
  return results;
}

main();
