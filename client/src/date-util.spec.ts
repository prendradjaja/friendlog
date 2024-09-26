// todo Add a testing library

import { formatRelative, NaiveDateTuple } from "./date-util";

const wedSep25 = { year: 2024, month: 9, day: 25 };
const tueOct1 = { year: 2024, month: 10, day: 1 };

const testCases: [string, NaiveDateTuple, string][] = [
  // Within the past 8 days
  ["2024-09-25", wedSep25, "Today"],
  ["2024-09-24", wedSep25, "Yesterday"],
  ["2024-09-23", wedSep25, "Monday"],
  ["2024-09-18", wedSep25, "Wednesday"],
  ["2024-09-17", wedSep25, "Tue 9/17"],

  // Within the past 8 days, but across a month boundary
  ["2024-10-01", tueOct1, "Today"],
  ["2024-09-30", tueOct1, "Yesterday"],
  ["2024-09-29", tueOct1, "Sunday"],
  ["2024-09-24", tueOct1, "Tuesday"],
  ["2024-09-23", tueOct1, "Mon 9/23"],

  // Far past dates
  ["2024-01-01", wedSep25, "Mon 1/1"],
  ["2023-12-31", wedSep25, "Sun 12/31"],

  // Future dates
  ["2025-01-01", wedSep25, "Wed 1/1"],
];

function main() {
  testCases.forEach((testCase) => runTestCase(...testCase));
}

function runTestCase(
  input: string,
  today: NaiveDateTuple,
  expected: string,
): void {
  const actual = formatRelative(input, today);
  if (actual === expected) {
    console.log("- Pass");
  } else {
    console.log("- Fail:", JSON.stringify({ input, today, actual, expected }));
  }
}

main();
