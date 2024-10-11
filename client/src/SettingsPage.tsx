import StyleWrapper from "./SettingsPage.styles";
import { Heading, Text, Button } from "@radix-ui/themes";
import { useEncryptionKey } from "./local-storage-items";
import { useState } from "react";

export function SettingsPage() {
  return <EncryptionSettings></EncryptionSettings>;
}

function EncryptionSettings() {
  const [encryptionKey, saveEncryptionKey] = useEncryptionKey();
  const [hidden, setHidden] = useState(true);

  function handleChange() {
    const newKey = prompt("Enter a new key or leave blank to cancel");
    if (!newKey) {
      return;
    }
    saveEncryptionKey(newKey);
    setHidden(false);
  }

  return (
    <StyleWrapper>
      <Heading>Settings</Heading>
      <Text>
        Encryption key:
        <Button size="1" onClick={() => setHidden((hidden) => !hidden)}>
          {hidden ? "Show" : "Hide"}
        </Button>
        <Button size="1" onClick={handleChange}>
          Change
        </Button>
      </Text>
      {/* Using <pre> instead of <span> in case the key has a space in it */}
      <div>
        {hidden ? (
          <pre className="hidden-key">(hidden)</pre>
        ) : (
          <pre className="visible-key">{encryptionKey}</pre>
        )}
      </div>
    </StyleWrapper>
  );
}
