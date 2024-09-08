import { useRef } from "react";
import * as api from "./api";

interface Props {
  onAdd: () => void;
}

export function CreateHangout({ onAdd }: Props) {
  const friendsRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  async function handleAdd() {
    const friends = friendsRef
      .current!.value.trim()
      .split(",")
      .map((n) => +n);
    const title = titleRef.current!.value.trim();
    const hangout_date_string = dateRef.current!.value.trim();

    friendsRef.current!.value = "";
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
      <input ref={friendsRef} placeholder="Friend ids" />
      <br />
      <input ref={titleRef} placeholder="Title" />
      <br />
      <input ref={dateRef} placeholder="Date" />
      <br />
      <button onClick={handleAdd}>Add</button>
    </>
  );
}
