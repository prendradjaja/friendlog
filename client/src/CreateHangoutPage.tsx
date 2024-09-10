import { useRef, useMemo, useState } from "react";
import * as api from "./api";
import { Friend } from "shared";
import { SelectFriends, SelectFriendsHandle } from "./SelectFriends";
import { format } from "date-fns";
import { useLoaderData, useNavigate } from "react-router-dom";

interface LoaderData {
  allFriends: Friend[];
}

export function CreateHangoutPage() {
  const { allFriends } = useLoaderData() as LoaderData;

  const friendsRef = useRef<SelectFriendsHandle>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  const today = useMemo(getToday, []);

  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  async function handleAdd() {
    setSaving(true);

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
    navigate("/");
  }

  return (
    <>
      <SelectFriends ref={friendsRef} allFriends={allFriends} />
      <br />
      <input ref={titleRef} placeholder="Title" />
      <br />
      <input ref={dateRef} type="date" defaultValue={today} />
      <br />
      <button onClick={handleAdd} disabled={saving}>
        Add
      </button>
    </>
  );
}

CreateHangoutPage.loader = async (): Promise<LoaderData> => {
  const allFriends = await api.getMyFriends();
  return { allFriends };
};

function getToday(): string {
  return format(new Date(), "yyyy-MM-dd");
}
