export function encodeNewlines(s: string): string {
  return s.replaceAll("\n", "<>");
}

export function decodeNewlines(s: string): string {
  return s.replaceAll("<>", "\n");
}
