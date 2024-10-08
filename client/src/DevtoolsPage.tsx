import { useState, useEffect, useRef } from "react";
import StyleWrapper from "./DevtoolsPage.styles";
import * as api from "./api";
import { Friend, Hangout } from "shared";

export function DevtoolsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [hangouts, setHangouts] = useState<Hangout[]>([]);

  const friendsLoaded = friends.length > 0;

  const newFriendRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFriends();
    loadHangouts();
  }, []);

  async function loadFriends() {
    const results = await api.getMyFriends();
    setFriends(results);
  }

  async function loadHangouts() {
    const results = await api.getMyHangouts();
    setHangouts(results);
  }

  async function handleCreateFriend() {
    const name = newFriendRef.current!.value;
    newFriendRef.current!.value = "";
    await api.createMyFriend({ name });
    loadFriends();
  }

  return (
    <StyleWrapper>
      <div>
        <h2>Sandbox</h2>
      </div>

      <hr />
      <div>
        <h2>Create friend</h2>
        <input ref={newFriendRef} />
        <button onClick={handleCreateFriend}>Add</button>
      </div>

      <hr />
      <div>
        <h2>Friends</h2>
        {friends.map((friend) => (
          <div key={friend.id}>{friend.name}</div>
        ))}
      </div>

      <hr />
      <div>
        <h2>Hangouts</h2>
        {hangouts.map((hangout) => (
          <pre key={hangout.id}>{JSON.stringify(hangout, null, 2)}</pre>
        ))}
      </div>
    </StyleWrapper>
  );
}
