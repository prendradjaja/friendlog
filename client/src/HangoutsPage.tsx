import * as api from "./api";
import { Hangout } from "shared";
import { Card, Link, Text } from "@radix-ui/themes";
import {
  LoaderFunctionArgs,
  Link as RouterLink,
  useLoaderData,
} from "react-router-dom";
import StyleWrapper from "./HangoutsPage.styles";

interface LoaderData {
  hangouts: Hangout[];
}

export function HangoutsPage() {
  const { hangouts } = useLoaderData() as LoaderData;

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
              <>
                <Link asChild key={friend.id} weight="bold">
                  <RouterLink to={"/friends/" + friend.id}>
                    {friend.name}
                  </RouterLink>
                </Link>
                {i < friends.length - 1 ? <Text>{", "}</Text> : null}
              </>
            ))}
          </div>
          <Text as="div">{hangout.title}</Text>
        </Card>
      ))}
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
