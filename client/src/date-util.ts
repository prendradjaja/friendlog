import { format, formatRelative } from "date-fns";
import { enUS } from "date-fns/locale";

export function getToday(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function formatRelativeToToday(date: string): string {
  let result = formatRelative(date, getToday(), { locale: enUS });
  result = removeTimePortion(result);
  result = capitalizeFirstCharacter(result);
  return result;
}

function removeTimePortion(relativeDate: string): string {
  const at = " at ";
  if (relativeDate.includes(at)) {
    return relativeDate.split(at)[0];
  } else {
    return relativeDate;
  }
}

function capitalizeFirstCharacter(s: string): string {
  const first = s.slice(0, 1);
  const rest = s.slice(1);
  return first.toUpperCase() + rest;
}
