import { LoginStatus } from "shared";
import * as api from "./api";

let loginStatus: LoginStatus | undefined;

export async function getLoginStatus(): Promise<LoginStatus> {
  if (loginStatus !== undefined) {
    return loginStatus;
  } else {
    loginStatus = await api.getLoginStatus();
    return loginStatus;
  }
}
