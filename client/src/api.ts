import { ExampleMessage } from "shared";
import { baseUrl } from "./base-url";

async function myFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(baseUrl + path, options);
  if (res.status === 200) {
    return res.json();
  } else {
    return Promise.reject(await res.json());
  }
}

export function getExampleMessageById(
  messageId: number,
): Promise<ExampleMessage> {
  return myFetch("/api/example-messages/" + messageId);
}
