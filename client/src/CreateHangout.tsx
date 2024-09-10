import { useRef, useMemo } from "react";
import * as api from "./api";
import { Friend } from "shared";
import { SelectFriends, SelectFriendsHandle } from "./SelectFriends";
import { format } from "date-fns";

interface Props {
  onAdd: () => void;
  allFriends: Friend[];
}

export function CreateHangout({ onAdd, allFriends }: Props) {
  const friendsRef = useRef<SelectFriendsHandle>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  const today = useMemo(getToday, []);

  async function handleAdd() {
    const { friendIds: existingFriendIds, friendNamesToCreate } =
      friendsRef.current!.getValue();
    const title = titleRef.current!.value.trim();
    const hangout_date_string = dateRef.current!.value;

    titleRef.current!.value = "";

    // todo Can add a bulk-create endpoint or just parallelize
    const createdFriendIds: number[] = [];
    for (const name of friendNamesToCreate) {
      const { id } = await api.createMyFriend({ name });
      createdFriendIds.push(id);
    }

    const friendIds = [...existingFriendIds, ...createdFriendIds];

    await api.createMyHangout({
      title,
      hangout_date_string,
      description: "",
      friends: friendIds,
    });
    onAdd();
  }

  return (
    <>
      <SelectFriends ref={friendsRef} allFriends={allFriends} />
      <br />
      <input ref={titleRef} placeholder="Title" />
      <br />
      <input ref={dateRef} type="date" defaultValue={today} />
      <br />
      <button onClick={handleAdd}>Add</button>
    </>
  );
}

function getToday(): string {
  return format(new Date(), "yyyy-MM-dd");
}
