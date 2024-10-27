// This is basically a homegrown naive date library
// Consider using a pre-built one
// - If Date() methods only, maybe use https://github.com/chaitanyagupta/naive-date
// - If want more, maybe use date-fns/utc: https://github.com/date-fns/utc

const weekdays = {
  0: "Sunday",
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
} as const;

const weekdaysShort = {
  0: "Sun",
  1: "Mon",
  2: "Tue",
  3: "Wed",
  4: "Thu",
  5: "Fri",
  6: "Sat",
} as const;

// todo Rename to NaiveDate
export interface NaiveDateTuple {
  year: number;
  month: number; // 1-indexed
  day: number;
}
export type NaiveDate = NaiveDateTuple; // todo Remove after I rename existing usages

export function getToday(): string {
  const now = new Date();
  const year = now.getFullYear().toString();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Format the given "timezone-naive" date relative to the browser's current date.
export function formatRelative(
  naiveDateString: string,
  fakeToday?: NaiveDateTuple, // For unit testing
): string {
  function toDate(date: NaiveDateTuple): Date {
    return new Date(Date.UTC(date.year, date.month - 1, date.day));
  }

  function isPreviousMonth(
    date1: NaiveDateTuple,
    date2: NaiveDateTuple,
  ): boolean {
    if (date1.year === date2.year && date1.month === date2.month - 1) {
      return true;
    } else if (
      date1.year === date2.year - 1 &&
      date1.month === 12 &&
      date2.month === 1
    ) {
      return true;
    } else {
      return false;
    }
  }

  function getMonthLength(date: NaiveDateTuple): number {
    // Because NaiveDateTuple is 1-indexed and Date is 0-indexed, nextMonth is simply the following.
    // This works even if date.month === 12; Date constructor parameters are allowed to overflow and
    // "carry over."
    const nextMonth = date.month;
    return new Date(date.year, nextMonth, 0).getDate();
  }

  // Returns the difference if the dates are close enough. Otherwise return undefined.
  function maybeDifference(
    date1: NaiveDateTuple,
    date2: NaiveDateTuple,
  ): number | undefined {
    if (
      date1.year === date2.year &&
      date1.month === date2.month &&
      date1.day === date2.day
    ) {
      return 0;
    } else if (date1.year === date2.year && date1.month === date2.month) {
      return date1.day - date2.day;
    } else if (isPreviousMonth(date1, date2)) {
      const day1 = date1.day;
      const day2 = date2.day + getMonthLength(date1);
      return day1 - day2;
    } else {
      return undefined;
    }
  }

  const date = parse(naiveDateString);
  const fakeUTCDate = toDate(date);

  const now = new Date();
  const today: NaiveDateTuple = fakeToday ?? {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
  };

  const weekdayShort =
    weekdaysShort[fakeUTCDate.getUTCDay() as keyof typeof weekdaysShort];
  const basicFormat = `${weekdayShort} ${date.month}/${date.day}`;

  const difference = maybeDifference(date, today);
  if (difference === undefined) {
    return basicFormat;
  } else if (difference === 0) {
    return "Today";
  } else if (difference === -1) {
    return "Yesterday";
  } else if (-7 <= difference && difference <= -2) {
    return weekdays[fakeUTCDate.getUTCDay() as keyof typeof weekdays];
  } else {
    return basicFormat;
  }
}

export function parse(dateString: string): NaiveDate {
  const [year, month, day] = dateString.split("-");
  return {
    year: +year,
    month: +month,
    day: +day,
  };
}

// @gx
export function addDays(d: NaiveDate, n: number): NaiveDate {
  const date = new Date(d.year, d.month - 1, d.day);
  date.setDate(date.getDate() + n);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

// @gx
export function getWeekStart(d: NaiveDate): NaiveDate {
  const date = new Date(d.year, d.month - 1, d.day);

  const dayOfWeek = date.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  date.setDate(date.getDate() - daysToMonday);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}

export function format(d: NaiveDate): string {
  return `${d.month}/${d.day}`;
}

export function getTodayObject(): NaiveDate {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  return { year, month, day };
}

export function getDateRange(start: NaiveDate, stop: NaiveDate, step = 1) {
  const result: NaiveDate[] = [];
  for (let d = start; !equals(d, stop); d = addDays(d, step)) {
    result.push({ ...d });
  }
  return result;
}

function equals(date1: NaiveDate, date2: NaiveDate): boolean {
  return (
    date1.year === date2.year &&
    date1.month === date2.month &&
    date1.day === date2.day
  );
}
