import { IconButton, Button, DropdownMenu } from "@radix-ui/themes";
import { PlusIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";

export function NavMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton size="3" variant="ghost">
          <HamburgerMenuIcon width="30" height="30" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item onSelect={() => alert("Hello example 1")}>
          Example 1
        </DropdownMenu.Item>
        <DropdownMenu.Item onSelect={() => alert("Hello example 2")}>
          Example 2
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
