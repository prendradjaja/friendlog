import {
  IconButton,
  Button,
  Card,
  Link,
  Text,
  AlertDialog,
  Dialog,
  Flex,
  TextField,
  DropdownMenu,
} from "@radix-ui/themes";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { useState } from "react";

export function SandboxPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  async function handleSaveClick() {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsDialogOpen(false);
  }

  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <IconButton variant="soft">
            <DotsVerticalIcon />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item disabled>Edit</DropdownMenu.Item>
          <DropdownMenu.Item onSelect={() => setIsDialogOpen(true)}>
            Delete
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <AlertDialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Revoke access</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Are you sure? This application will no longer be accessible and any
            existing sessions will be expired.
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <Button variant="solid" color="red" onClick={handleSaveClick}>
              Revoke access
            </Button>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
}
