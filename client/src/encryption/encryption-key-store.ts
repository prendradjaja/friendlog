const localStoragePrefix = "friendlog/";

const encryptionKeyKey = localStoragePrefix + "encryption-key";

export function getEncryptionKey(): string {
  const item = localStorage.getItem(encryptionKeyKey);
  if (item === null) {
    return "";
  }
  return item;
}

export function setEncryptionKey(encryptionKey: string): void {
  localStorage.setItem(encryptionKeyKey, encryptionKey);
}
