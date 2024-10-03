import { useState, ChangeEvent, useRef } from "react";
import StyleWrapper, { verticalPadding } from "./GrowableTextarea.styles";

interface Props {
  placeholder?: string;
}

/**
 * A textarea that automatically expands its height as the user types.
 *
 * To set a max height, add a CSS max-height to the .growable-textarea element.
 */
export function GrowableTextarea({ placeholder }: Props) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLTextAreaElement>(null);

  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    const textarea = event.target;
    setValue(textarea.value);
    updateHeight();
  }

  function updateHeight(): void {
    const textarea = ref.current!;

    textarea.style.height = "";

    const newHeight = textarea.scrollHeight - 2 * verticalPadding;
    textarea.style.height = newHeight + "px";
  }

  return (
    <StyleWrapper>
      <textarea
        className="growable-textarea"
        placeholder={placeholder ?? ""}
        ref={ref}
        rows={1}
        value={value}
        onChange={handleChange}
      ></textarea>
    </StyleWrapper>
  );
}
