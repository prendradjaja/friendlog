import { Hangout } from "shared";
import {
  addDays,
  format,
  getDateRange,
  getTodayObject,
  getWeekStart,
  NaiveDate,
  parse,
} from "./date-util";
import { useMemo } from "react";
import StyleWrapper from "./Calendar.styles";

interface Props {
  hangouts: Hangout[];
}

export function Calendar({ hangouts }: Props) {
  const weekStarts = useMemo(getWeeks, []);

  const byDay: Partial<Record<string, Hangout[]>> = {};
  for (const hangout of hangouts) {
    const day = toUniqueId(parse(hangout.hangout_date_string));
    if (!(day in byDay)) {
      byDay[day] = [];
    }
    byDay[day]!.push(hangout);
  }

  return (
    <StyleWrapper className="calendar">
      {weekStarts.map((weekStart) => (
        <div className="week" key={toUniqueId(weekStart)}>
          {getDaysInWeek(weekStart).map((day) => (
            <div className="day" key={toUniqueId(day)}>
              <div className="label">{format(day) + " "}</div>
              <div>
                {(byDay[toUniqueId(day)] ?? []).map((hangout) => (
                  <>*</>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </StyleWrapper>
  );
}

function toUniqueId(d: NaiveDate) {
  return format(d); // todo Isn't unique across years
}

/**
 * Returns the start of the first week and the *start* of the last week
 */
function getWeeks() {
  const countVisibleWeeks = 8;
  const today = getTodayObject();
  const thisWeekStart = getWeekStart(today);
  const nextWeekStart = addDays(thisWeekStart, 7);
  const calendarStart = addDays(nextWeekStart, -7 * countVisibleWeeks);
  return getDateRange(calendarStart, nextWeekStart, 7);
}

function getDaysInWeek(weekStart: NaiveDate): NaiveDate[] {
  return getDateRange(weekStart, addDays(weekStart, 7));
}
