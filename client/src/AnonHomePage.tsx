import { Link } from "@radix-ui/themes";
import { redirect } from "react-router-dom";
import { getLoginStatus } from "./login-status-store";

export function AnonHomePage() {
  return (
    <>
      <Link href="/login/federated/google">Sign in with Google</Link>
    </>
  );
}

AnonHomePage.loader = async () => {
  const { isLoggedIn } = await getLoginStatus();
  if (isLoggedIn) {
    return redirect("/home");
  }
  return null;
};
