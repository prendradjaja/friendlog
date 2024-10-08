import { IconButton, Button, DropdownMenu } from "@radix-ui/themes";
import { PlusIcon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Link as RouterLink } from "react-router-dom";
import { DropdownStyles } from "./NavMenu.styles";

export function NavMenu() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton size="2" variant="ghost">
          <HamburgerMenuIcon width="30" height="30" />
        </IconButton>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownStyles>
          <DropdownMenu.Item asChild>
            <RouterLink to="/settings">Settings</RouterLink>
          </DropdownMenu.Item>
          <form method="post" action="/logout">
            <DropdownMenu.Item asChild>
              <button type="submit">Log out</button>
            </DropdownMenu.Item>
          </form>
        </DropdownStyles>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
