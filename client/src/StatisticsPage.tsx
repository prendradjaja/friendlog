import StyleWrapper from "./StatisticsPage.styles";
import {
  useLoaderData,
  LoaderFunctionArgs,
  useNavigate,
} from "react-router-dom";
import * as api from "./api";
import { Friend, Hangout } from "shared";
import { useState } from "react";
import { Heading, Text, TextField, Button } from "@radix-ui/themes";

interface LoaderData {
  hangouts: Hangout[];
}

export function StatisticsPage() {
  const { hangouts } = useLoaderData() as LoaderData;

  const friends = hangouts
    .flatMap((hangout) => hangout.friends)
    .map((friend) => friend.name);

  const friendsByCount = countsToTuplesSorted(getCounts(friends));

  return (
    <StyleWrapper>
      <Heading>Statistics</Heading>
      <table>
        <tbody>
          {friendsByCount.map(([friend, count]) => (
            <tr key={friend}>
              <td>{friend}</td>
              <td>{count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </StyleWrapper>
  );
}

function getCounts(arr: string[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of arr) {
    if (item in counts) {
      counts[item]!++;
    } else {
      counts[item] = 1;
    }
  }
  return counts;
}

function countsToTuplesSorted(
  dictionary: Record<string, number>,
): [string, number][] {
  return Object.entries(dictionary).sort(
    ([, countA], [, countB]) => countB - countA,
  );
}

StatisticsPage.loader = async ({ params }: LoaderFunctionArgs) => {
  const hangouts = await api.getMyHangouts();
  return { hangouts };
};
