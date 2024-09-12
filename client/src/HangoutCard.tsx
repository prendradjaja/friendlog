import * as api from "./api";
import { Hangout } from "shared";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Card, Link, Text, AlertDialog, DropdownMenu } from "@radix-ui/themes";
import { Link as RouterLink } from "react-router-dom";
import { IconButton, Button } from "@radix-ui/themes";
import StyleWrapper from "./HangoutCard.styles";
import * as React from "react";
import { formatRelativeToToday } from "./date-util";

interface Props {
  hangout: Hangout;
}

export function HangoutCard({ hangout }: Props) {
  return (
    <StyleWrapper>
      <Card key={hangout.id}>
        <div style={{ display: "flex", width: "100%" }}>
          <div style={{ flexGrow: "1" }}>
            {hangout.friends.map((friend, i, friends) => (
              <React.Fragment key={friend.id}>
                <Link asChild weight="bold">
                  <RouterLink to={"/friends/" + friend.id}>
                    {friend.name}
                  </RouterLink>
                </Link>
                {i < friends.length - 1 && <Text>{", "}</Text>}
              </React.Fragment>
            ))}
          </div>
          <div>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <IconButton variant="ghost">
                  <HamburgerMenuIcon />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item disabled>Edit</DropdownMenu.Item>
                <DropdownMenu.Item>Delete</DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
        <Text as="div" size="2" color="gray">
          {formatRelativeToToday(hangout.hangout_date_string)}
        </Text>
        <Text as="div">{hangout.title}</Text>
      </Card>
    </StyleWrapper>
  );
}
