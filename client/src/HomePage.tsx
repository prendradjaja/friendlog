import { useState, useEffect } from "react";
import StyleWrapper from "./HomePage.styles";
import * as api from "./api";
import { ExampleMessage } from "shared";

export function HomePage() {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");
  const [otherMessage, setOtherMessage] = useState("");

  useEffect(() => {
    api
      .getExampleMessageById(0)
      .then((message: ExampleMessage) => setMessage(message.value));
    api.getExampleMessageById(1).catch(() => setOtherMessage("404 received"));
  });

  return (
    <StyleWrapper>
      <button onClick={() => setCount((count) => count + 1)}>
        Count: {count}
      </button>
      <div>
        Message from backend: <code>{message}</code>
      </div>
      <div>
        404 from backend: <code>{otherMessage}</code>
      </div>
    </StyleWrapper>
  );
}
