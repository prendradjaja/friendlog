import { Friend } from "shared";
import { Button } from "@radix-ui/themes";
import { useState, useImperativeHandle, forwardRef } from "react";

interface Props {
  allFriends: Friend[];
}

export interface SelectFriendsHandle {
  getValue: () => number[];
}

export const SelectFriends = forwardRef(({ allFriends }: Props, ref) => {
  const [selectedFriends, setSelectedFriends] = useState<number[]>([]);

  useImperativeHandle(ref, () => {
    return {
      getValue() {
        const result = selectedFriends.slice();
        result.sort();
        return result;
      },
    } satisfies SelectFriendsHandle;
  }, [selectedFriends]);

  function handleToggle(friendId: number) {
    const index = selectedFriends.indexOf(friendId);
    if (index === -1) {
      setSelectedFriends([...selectedFriends, friendId]);
    } else {
      setSelectedFriends(selectedFriends.filter((each) => each !== friendId));
    }
  }

  return (
    <>
      {allFriends.map((friend) => (
        <ToggleFriend
          key={friend.id}
          name={friend.name}
          selected={selectedFriends.includes(friend.id)}
          onToggle={() => handleToggle(friend.id)}
        ></ToggleFriend>
      ))}
    </>
  );
});

interface ToggleFriendProps {
  name: string;
  selected: boolean;
  onToggle: () => void;
}

function ToggleFriend({ name, selected, onToggle }: ToggleFriendProps) {
  return (
    <>
      <Button variant={selected ? "solid" : "outline"} onClick={onToggle}>
        {name}
      </Button>{" "}
    </>
  );
}
