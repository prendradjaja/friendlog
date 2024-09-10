import * as api from "./api";
import { Hangout } from "shared";
import { Card, Link, Text } from "@radix-ui/themes";
import {
  LoaderFunctionArgs,
  Link as RouterLink,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { IconButton } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import StyleWrapper from "./HangoutsPage.styles";
import * as React from "react";

interface LoaderData {
  hangouts: Hangout[];
}

export function HangoutsPage() {
  const { hangouts } = useLoaderData() as LoaderData;
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
        <div>
          <Link asChild weight="bold">
            <RouterLink to="/devtools">Devtools</RouterLink>
          </Link>
        </div>
      </div>
      {hangouts.map((hangout) => (
        <Card key={hangout.id}>
          <div>
            {hangout.friends.map((friend, i, friends) => (
              <React.Fragment key={friend.id}>
                <Link asChild weight="bold">
                  <RouterLink to={"/friends/" + friend.id}>
                    {friend.name}
                  </RouterLink>
                </Link>
                {i < friends.length - 1 ? <Text>{", "}</Text> : null}
              </React.Fragment>
            ))}
          </div>
          <Text as="div" size="2" color="gray">
            {hangout.hangout_date_string}
          </Text>
          <Text as="div">{hangout.title}</Text>
        </Card>
      ))}

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
  const friendId = params.friendId;
  if (friendId === undefined) {
    const hangouts = await api.getMyHangouts();
    return { hangouts };
  } else {
    const hangouts = await api.getMyHangoutsWithOneFriend(+friendId);
    return { hangouts };
  }
};
