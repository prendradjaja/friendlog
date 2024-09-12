import { Friend } from "shared";
import { Button, IconButton } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { useState, useImperativeHandle, forwardRef } from "react";
import StyleWrapper from "./SelectFriends.styles";

interface Props {
  allFriends: Friend[];
}

export interface SelectFriendsValue {
  friendIds: number[];
  friendNamesToCreate: string[];
}

export interface SelectFriendsHandle {
  getValue: () => SelectFriendsValue;
}

export const SelectFriends = forwardRef(({ allFriends }: Props, ref) => {
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);
  const [friendsToAdd, setFriendsToAdd] = useState<string[]>([]);

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        const friendIds = selectedFriends.slice();
        friendIds.sort();
        const friendNamesToCreate = friendsToAdd.slice();
        friendNamesToCreate.sort();
        return {
          friendIds,
          friendNamesToCreate,
        };
      },
    } satisfies SelectFriendsHandle;
  }, [selectedFriends, friendsToAdd]);

  function handleToggle(friendId: number) {
    const index = selectedFriends.indexOf(friendId);
    if (index === -1) {
      setSelectedFriends([...selectedFriends, friendId]);
    } else {
      setSelectedFriends(selectedFriends.filter((each) => each !== friendId));
    }
  }

  function handleClickAdd() {
    const name = (prompt() ?? "").trim();
    const existingNames = allFriends.map((f) => f.name);
    if (name === "") {
      return;
    } else if (existingNames.includes(name)) {
      return;
    } else if (friendsToAdd.includes(name)) {
      return;
    } else {
      setFriendsToAdd([...friendsToAdd, name]);
    }
  }

  function handleCancelCreate(name: string) {
    setFriendsToAdd(friendsToAdd.filter((each) => each !== name));
  }

  return (
    <StyleWrapper>
      {allFriends.map((friend) => (
        <ToggleFriend
          key={friend.id}
          name={friend.name}
          selected={selectedFriends.includes(friend.id)}
          onToggle={() => handleToggle(friend.id)}
        ></ToggleFriend>
      ))}
      {friendsToAdd.map((name) => (
        <Button key={name} onClick={() => handleCancelCreate(name)}>
          ({name})
        </Button>
      ))}
      <IconButton variant="outline" onClick={handleClickAdd}>
        <PlusIcon />
      </IconButton>
    </StyleWrapper>
  );
});

interface ToggleFriendProps {
  name: string;
  selected: boolean;
  onToggle: () => void;
}

// todo Maybe inline this component
function ToggleFriend({ name, selected, onToggle }: ToggleFriendProps) {
  return (
    <Button variant={selected ? "solid" : "outline"} onClick={onToggle}>
      {name}
    </Button>
  );
}
