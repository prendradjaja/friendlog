import { format, formatRelative } from "date-fns";
import { enUS } from "date-fns/locale";

export function getToday(): string {
  return format(new Date(), "yyyy-MM-dd");
}
