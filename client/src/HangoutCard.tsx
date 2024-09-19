import * as api from "./api";
import { Hangout } from "shared";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Flex, Link, Text, AlertDialog, DropdownMenu } from "@radix-ui/themes";
import { Link as RouterLink } from "react-router-dom";
import { IconButton, Button } from "@radix-ui/themes";
import StyleWrapper from "./HangoutCard.styles";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  hangout: Hangout;
}

export function HangoutCard({ hangout }: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  async function handleSaveClick() {
    setIsDeleting(true);
    await api.deleteHangout(hangout.id);

    // todo Maybe use some state management instead of this blunt approach
    // todo This implementation doesn't support HangoutsPage's "one friend" view
    navigate("/home"); // Refresh HangoutsPage
  }

  const friendNames = hangout.friends.map((friend, i, friends) => (
    <React.Fragment key={friend.id}>
      <Link asChild weight="bold">
        <RouterLink to={"/friends/" + friend.id}>{friend.name}</RouterLink>
      </Link>
      {i < friends.length - 1 && <Text>{", "}</Text>}
    </React.Fragment>
  ));

  const dropdown = (
    <>
      <DropdownMenu.Root open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenu.Trigger>
          <IconButton
            variant="ghost"
            onPointerDown={(e) => e.preventDefault()}
            onClick={() => setIsDropdownOpen(true)}
          >
            <HamburgerMenuIcon />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item disabled>Edit</DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => setIsDeleteModalOpen(true)}>
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );

  const deleteModal = (
    <AlertDialog.Root
      open={isDeleteModalOpen}
      onOpenChange={setIsDeleteModalOpen}
    >
      <AlertDialog.Content maxWidth="250px">
        <AlertDialog.Title>Delete hangout</AlertDialog.Title>
        <AlertDialog.Description>Are you sure?</AlertDialog.Description>

        {/* todo Maybe don't use radix.Flex */}
        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <Button
            variant="solid"
            color="red"
            onClick={handleSaveClick}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );

  return (
    <StyleWrapper>
      <div key={hangout.id}>
        <div className="hangout-header">
          <div>{friendNames}</div>
          <div>{dropdown}</div>
        </div>
        <Text as="div" size="2" color="gray" className="date">
          {hangout.hangout_date_string}
        </Text>
        <Text as="div" className="body">
          {hangout.title}
        </Text>
      </div>
      {deleteModal}
    </StyleWrapper>
  );
}
