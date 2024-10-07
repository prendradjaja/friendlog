import { useEffect } from "react";

interface Props {
  onKeyDown: (event: KeyboardEvent) => void;
}

export function KeyboardListener({ onKeyDown }: Props) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent): void {
      onKeyDown(event);
    }

    document.body.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.body.removeEventListener("keydown", handleKeyDown);
    };
  }, [onKeyDown]);

  return <></>;
}
