import StyleWrapper from "./EditFriendPage.styles";
import {
  useLoaderData,
  LoaderFunctionArgs,
  useNavigate,
} from "react-router-dom";
import { getMyFriends } from "./api";
import { Friend } from "shared";
import { useState } from "react";
import { Heading, Text, TextField, Button } from "@radix-ui/themes";
import { updateFriend } from "./api";

interface LoaderData {
  friend: Friend;
}

export function EditFriendPage() {
  const { friend } = useLoaderData() as LoaderData;
  const [name, setName] = useState(friend.name);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  async function handleSave(): Promise<void> {
    const friendUpdate = { name };
    setSaving(true);
    await updateFriend(friend.id, friendUpdate);
    navigate("/");
  }

  return (
    <StyleWrapper>
      <Heading>Edit friend</Heading>
      <Text>Name:</Text>
      <TextField.Root
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Button onClick={handleSave} disabled={saving}>
        Save
      </Button>
    </StyleWrapper>
  );
}

EditFriendPage.loader = async ({ params }: LoaderFunctionArgs) => {
  const friendId: number = +(params.friendId ?? -1);
  const allFriends = await getMyFriends();
  const friend = allFriends.find((friend) => friend.id === friendId)!;
  return { friend };
};
