import { useState, ChangeEvent, useRef, useEffect } from "react";
import StyleWrapper, { verticalPadding } from "./GrowableTextarea.styles";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * A textarea that automatically expands its height as the user types.
 *
 * To set a max height, add a CSS max-height to the .growable-textarea element.
 *
 * (Consider using a package e.g. react-textarea-autosize instead)
 */
export function GrowableTextarea({ value, onChange, placeholder }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function updateHeight(): void {
    const textarea = ref.current!;
    textarea.style.height = "";

    const newHeight = textarea.scrollHeight - 2 * verticalPadding;
    textarea.style.height = newHeight + "px";
  }

  useEffect(updateHeight);

  return (
    <StyleWrapper>
      <textarea
        ref={ref}
        className="growable-textarea"
        placeholder={placeholder ?? ""}
        rows={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      ></textarea>
    </StyleWrapper>
  );
}
