import StyleWrapper from "./SettingsPage.styles";
import { Heading, Text, Button } from "@radix-ui/themes";
import {
  getEncryptionKey,
  setEncryptionKey,
} from "./encryption/encryption-key-store";
import { useState } from "react";

export function SettingsPage() {
  return <EncryptionSettings></EncryptionSettings>;
}

function EncryptionSettings() {
  const [key, setKey] = useState(getEncryptionKey);
  const [hidden, setHidden] = useState(true);

  function handleChange() {
    const newKey = prompt("Enter a new key or leave blank to cancel");
    if (!newKey) {
      return;
    }
    setEncryptionKey(newKey);
    setKey(newKey);
    setHidden(false);
  }

  return (
    <StyleWrapper>
      <Heading>Settings</Heading>
      <Text>
        Encryption key:{" "}
        {/* Using <pre> instead of <span> in case the key has a space in it */}
        {hidden ? (
          <pre className="hidden-key">(hidden)</pre>
        ) : (
          <pre className="visible-key">{key}</pre>
        )}
      </Text>
      <div>
        <Button size="1" onClick={() => setHidden((hidden) => !hidden)}>
          {hidden ? "Show" : "Hide"}
        </Button>
        <Button size="1" onClick={handleChange}>
          Change
        </Button>
      </div>
    </StyleWrapper>
  );
}
