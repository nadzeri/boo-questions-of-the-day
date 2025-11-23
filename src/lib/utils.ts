import { formatDistanceToNow } from "date-fns";

/**
 * Formats a date to a short relative time string (e.g., "16d", "2h", "5m")
 * @param date - The date to format (can be a Date object or ISO string)
 * @returns A short relative time string
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  
  return formatDistanceToNow(dateObj, {
    addSuffix: false,
  })
    .replace("about ", "")
    .replace("over ", "")
    .replace("almost ", "")
    .replace("less than ", "")
    .replace("a ", "1")
    .replace("an ", "1")
    .replace(" minute", "m")
    .replace(" minutes", "m")
    .replace(" hour", "h")
    .replace(" hours", "h")
    .replace(" day", "d")
    .replace(" days", "d")
    .replace(" week", "w")
    .replace(" weeks", "w")
    .replace(" month", "mo")
    .replace(" months", "mo")
    .replace(" year", "y")
    .replace(" years", "y")
    .replace("ds", "d");
}

