import * as api from "./api";
import { LoginStatus, Hangout } from "shared";
import { Link, Heading } from "@radix-ui/themes";
import {
  LoaderFunctionArgs,
  Link as RouterLink,
  useLoaderData,
  useNavigate,
  redirect,
} from "react-router-dom";
import { IconButton, Button } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import StyleWrapper from "./HangoutsPage.styles";
import { getLoginStatus } from "./login-status-store";
import { HangoutCard } from "./HangoutCard";
import { useMemo } from "react";
import { useEncryptionKey, useIsUnlocked } from "./local-storage-items";
import { KeyboardListener } from "./KeyboardListener";
import { NavMenu } from "./NavMenu";
import { Calendar } from "./Calendar";

interface LoaderData {
  hangouts: Hangout[];
  loginStatus: LoginStatus;
}

const createHangoutUrl = "/hangouts/new";

export function HangoutsPage() {
  const { hangouts, loginStatus } = useLoaderData() as LoaderData;
  const navigate = useNavigate();
  const [encryptionKey, saveEncryptionKey] = useEncryptionKey();
  const [isUnlocked, saveIsUnlocked] = useIsUnlocked();

  const visibleHangouts = isUnlocked
    ? hangouts
    : hangouts.filter((hangout) => !hangout.private);

  function handleAddHangout() {
    navigate(createHangoutUrl);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (
      event.key === "c" &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey
    ) {
      navigate(createHangoutUrl);
    }
  }

  return (
    <StyleWrapper>
      <div className="header">
        <Heading>
          <Link asChild>
            <RouterLink to="/">Friendlog</RouterLink>
          </Link>
          {isUnlocked && <span className="unlocked">*</span>}
        </Heading>
        <NavMenu />
      </div>

      <Calendar hangouts={visibleHangouts} />

      <div>
        {visibleHangouts.map((hangout) => (
          <HangoutCard key={hangout.id} hangout={hangout} />
        ))}
      </div>

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
      <KeyboardListener onKeyDown={handleKeyDown} />
    </StyleWrapper>
  );
}

HangoutsPage.loader = async ({ params }: LoaderFunctionArgs) => {
  // todo Don't fetch login status in each route
  const loginStatus = await getLoginStatus();

  if (!loginStatus.isLoggedIn) {
    return redirect("/");
  }

  const friendId = params.friendId;
  let result: LoaderData;
  if (friendId === undefined) {
    const hangouts = await api.getMyHangouts();
    result = { loginStatus, hangouts };
  } else {
    const hangouts = await api.getMyHangoutsWithOneFriend(+friendId);
    result = { loginStatus, hangouts };
  }
  return result;
};
