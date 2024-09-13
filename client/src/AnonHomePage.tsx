import { Link, Heading } from "@radix-ui/themes";
import { redirect } from "react-router-dom";
import { getLoginStatus } from "./login-status-store";
import StyleWrapper from "./AnonHomePage.styles";

export function AnonHomePage() {
  return (
    <StyleWrapper>
      <div>
        <Heading as="h1">Friendlog</Heading>
        <Link href="/login/federated/google">Sign in with Google</Link>
      </div>
    </StyleWrapper>
  );
}

AnonHomePage.loader = async () => {
  const { isLoggedIn } = await getLoginStatus();
  if (isLoggedIn) {
    return redirect("/home");
  }
  return null;
};
