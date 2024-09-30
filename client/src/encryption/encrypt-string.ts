// Simple encryption scheme: Vigenere cipher applied with ASCII printable characters instead of A-Z
//
// This encryption doesn't need to be very strong; it's mainly intended just to prevent me from
// accidentally looking at other users' data.

const minPrintable = 32;
const maxPrintable = 126;
const printableRangeWidth = maxPrintable - minPrintable + 1;

export function encrypt(
  plaintext: string,
  key: string,
  decrypt = false,
): string {
  return _encrypt(plaintext, key, true);
}

export function decrypt(plaintext: string, key: string): string {
  return _encrypt(plaintext, key, false);
}

function _encrypt(plaintext: string, key: string, forwards: boolean): string {
  key = key || " "; // If no key is provided, use the empty key, which provides no encryption.
  const cycledKey = cycle(toInts(key));

  const plaintextInts = toInts(plaintext);
  const ciphertextInts: number[] = [];
  for (const plaintextByte of plaintextInts) {
    const keyByte = cycledKey.next().value as number;
    const offset = forwards ? keyByte : -keyByte;
    const ciphertextByte = modulo(plaintextByte + offset, printableRangeWidth);
    ciphertextInts.push(ciphertextByte);
  }

  return fromInts(ciphertextInts);
}

function* cycle(key: number[]) {
  while (true) {
    for (const n of key) {
      yield n;
    }
  }
}

function toInts(text: string): number[] {
  return Array.from(text).map((ch) => ch.charCodeAt(0) - minPrintable);
}

function fromInts(ints: number[]): string {
  return ints.map((n) => String.fromCharCode(n + minPrintable)).join("");
}

function modulo(n: number, m: number): number {
  return ((n % m) + m) % m;
}
