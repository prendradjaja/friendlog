import StyleWrapper from "./EditFriendPage.styles";
import { useLoaderData, LoaderFunctionArgs, redirect } from "react-router-dom";
import { getMyFriends } from "./api";
import { Friend } from "shared";
import { useState } from "react";
import { Heading, Text, TextField, Button } from "@radix-ui/themes";

interface LoaderData {
  friend: Friend;
}

export function EditFriendPage() {
  const { friend } = useLoaderData() as LoaderData;
  const [name, setName] = useState(friend.name);

  async function handleSave(): Promise<void> {}

  return (
    <StyleWrapper>
      <Heading>Edit friend</Heading>
      <Text>Name:</Text>
      <TextField.Root
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <Button onClick={handleSave}>Save</Button>
    </StyleWrapper>
  );
}

EditFriendPage.loader = async ({ params }: LoaderFunctionArgs) => {
  const friendId: number = +(params.friendId ?? -1);
  const allFriends = await getMyFriends();
  const friend = allFriends.find((friend) => friend.id === friendId)!;
  return { friend };
};
