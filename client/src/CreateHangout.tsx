import { useRef } from "react";
import * as api from "./api";
import { Friend } from "shared";
import { SelectFriends, SelectFriendsHandle } from "./SelectFriends";

interface Props {
  onAdd: () => void;
  allFriends: Friend[];
}

export function CreateHangout({ onAdd, allFriends }: Props) {
  const friendsRef = useRef<SelectFriendsHandle>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  async function handleAdd() {
    const friends = friendsRef.current!.getValue();
    const title = titleRef.current!.value.trim();
    const hangout_date_string = dateRef.current!.value.trim();

    titleRef.current!.value = "";
    dateRef.current!.value = "";

    await api.createMyHangout({
      title,
      hangout_date_string,
      description: "",
      friends,
    });
    onAdd();
  }

  return (
    <>
      <SelectFriends ref={friendsRef} allFriends={allFriends} />
      <br />
      <input ref={titleRef} placeholder="Title" />
      <br />
      <input ref={dateRef} placeholder="Date" />
      <br />
      <button onClick={handleAdd}>Add</button>
    </>
  );
}
