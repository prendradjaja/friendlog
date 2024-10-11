import { useLocalStorage } from "@uidotdev/usehooks";

const localStoragePrefix = "friendlog/";

export function useEncryptionKey() {
  return useLocalStorage(localStoragePrefix + "encryption-key-2", "");
}

// Not reactive. Usually use useEncryptionKey. A function like this won't be necessary for most
// other local storage items.
export function getEncryptionKeySnapshot(): string {
  const item = localStorage.getItem(localStoragePrefix + "encryption-key-2");
  if (item === null) {
    return "";
  }
  return JSON.parse(item);
}

export function useIsUnlocked() {
  return useLocalStorage(localStoragePrefix + "is-unlocked", false);
}
