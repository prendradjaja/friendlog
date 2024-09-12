import * as api from "./api";
import { LoginStatus, Hangout } from "shared";
import { Link } from "@radix-ui/themes";
import {
  LoaderFunctionArgs,
  Link as RouterLink,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { IconButton, Button } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import StyleWrapper from "./HangoutsPage.styles";
import { getLoginStatus } from "./login-status-store";
import { HangoutCard } from "./HangoutCard";

interface LoaderData {
  hangouts: Hangout[];
  loginStatus: LoginStatus;
}

export function HangoutsPage() {
  const { hangouts, loginStatus } = useLoaderData() as LoaderData;
  const navigate = useNavigate();

  function handleAddHangout() {
    navigate("/hangouts/new");
  }

  return (
    <StyleWrapper>
      <div className="header">
        <Link asChild weight="bold" size="6">
          <RouterLink to="/">Friendlog</RouterLink>
        </Link>
      </div>

      {hangouts.map((hangout) => (
        <HangoutCard key={hangout.id} hangout={hangout} />
      ))}

      <form method="post" action="/logout">
        <Button type="submit" size="1" variant="outline">
          Log out{" "}
          {loginStatus.isLoggedIn ? loginStatus.user.name : "(Not logged in)"}
        </Button>
      </form>

      {/* todo Maybe use a link instead of a button. Would have to do it myself: Radix Themes
      doesn't have such a "link that looks like a button" component. */}
      {/* todo Maybe make it bigger. Would have to do it myself: This is the max size for the Radix
      Themes button. */}
      <IconButton
        className="floating-action-button"
        radius="full"
        size="4"
        onClick={handleAddHangout}
      >
        <PlusIcon width="30" height="30" />
      </IconButton>
    </StyleWrapper>
  );
}

HangoutsPage.loader = async ({
  params,
}: LoaderFunctionArgs): Promise<LoaderData> => {
  // todo Don't fetch login status in each route
  const loginStatus = await getLoginStatus();

  const friendId = params.friendId;
  if (friendId === undefined) {
    const hangouts = await api.getMyHangouts();
    return { loginStatus, hangouts };
  } else {
    const hangouts = await api.getMyHangoutsWithOneFriend(+friendId);
    return { loginStatus, hangouts };
  }
};
