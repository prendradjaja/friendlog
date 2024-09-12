import { useRef, useMemo, useState } from "react";
import * as api from "./api";
import { Friend } from "shared";
import { SelectFriends, SelectFriendsHandle } from "./SelectFriends";
import { useLoaderData, useNavigate } from "react-router-dom";
import StyleWrapper from "./CreateHangoutPage.styles";
import { Button, Heading, TextField } from "@radix-ui/themes";
import { getToday } from "./date-util";

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
    <StyleWrapper>
      <Heading as="h1">Create hangout</Heading>

      <Heading as="h2" size="3">
        Who
      </Heading>
      <SelectFriends ref={friendsRef} allFriends={allFriends} />

      <Heading as="h2" size="3">
        What
      </Heading>
      <TextField.Root ref={titleRef} placeholder="e.g. Coffee at Timeless" />

      <Heading as="h2" size="3">
        When
      </Heading>
      <input ref={dateRef} type="date" defaultValue={today} />

      <div className="button-container">
        <Button onClick={handleAdd} disabled={saving}>
          Add
        </Button>
      </div>
    </StyleWrapper>
  );
}

CreateHangoutPage.loader = async (): Promise<LoaderData> => {
  const allFriends = await api.getMyFriends();
  return { allFriends };
};
