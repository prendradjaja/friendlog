export function sortBy<T>(arr: T[], keyFn: (item: T) => number | string): T[] {
  return [...arr].sort((a, b) => {
    const keyA = keyFn(a);
    const keyB = keyFn(b);

    if (keyA < keyB) {
      return -1;
    } else if (keyA > keyB) {
      return 1;
    } else {
      return 0;
    }
  });
}
