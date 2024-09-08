import { useState, useEffect, useRef } from "react";
import * as api from "./api";
import { Friend, Hangout } from "shared";
import { Card, Link, Button, Text } from "@radix-ui/themes";
import { Link as RouterLink } from "react-router-dom";
import StyleWrapper from "./HomePage.styles";

export function HomePage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [hangouts, setHangouts] = useState<Hangout[]>([]);

  useEffect(() => {
    loadFriends();
    loadHangouts();
  }, []);

  async function loadFriends() {
    const results = await api.getMyFriends();
    setFriends(results);
  }

  async function loadHangouts(friendId?: number) {
    let getResults;
    if (friendId === undefined) {
      getResults = api.getMyHangouts;
    } else {
      getResults = () => api.getMyHangoutsWithOneFriend(friendId);
    }
    setHangouts([]);
    const results = await getResults();
    console.log(results[0].hangout_date);
    setHangouts(results);
  }

  return (
    <StyleWrapper>
      <div className="header">
        <Link weight="bold" href="#" size="6" onClick={() => loadHangouts()}>
          Friendlog
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
                  <RouterLink to="#" onClick={() => loadHangouts(friend.id)}>
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
