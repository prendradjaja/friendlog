import { useRef } from "react";
import * as api from "./api";

interface Props {
  onAdd: () => void;
}

export function CreateHangout({ onAdd }: Props) {
  const friendsRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  async function handleAdd() {
    const friends = friendsRef
      .current!.value.trim()
      .split(",")
      .map((n) => +n);
    const title = titleRef.current!.value.trim();
    friendsRef.current!.value = "";
    titleRef.current!.value = "";
    await api.createMyHangout({
      title,
      hangout_date: new Date(),
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
      <button onClick={handleAdd}>Add</button>
    </>
  );
}
