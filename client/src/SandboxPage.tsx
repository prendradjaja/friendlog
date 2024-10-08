import { Button, Dialog, IconButton } from "@radix-ui/themes";
import { PlusIcon } from "@radix-ui/react-icons";
import { useState, PropsWithChildren } from "react";
import styled from "styled-components";

export function SandboxPage() {
  const StyleWrapper = styled.div``;

  const [open, setOpen] = useState(true);

  return (
    <StyleWrapper>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger>
          <Button>Enter PIN</Button>
        </Dialog.Trigger>

        <Dialog.Content maxWidth="450px">
          <PINDialog />
        </Dialog.Content>
      </Dialog.Root>
    </StyleWrapper>
  );
}

const maxPINLength = 8;

function PINDialog() {
  // TODO Fix after-press animation, which I think gets broken by re-rendering (it only works when
  // max pin length is hit)

  const StyleWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    .display {
      font-size: 40px;
      font-weight: bold;
      margin-bottom: var(--space-3);
    }

    button {
      font-family: monospace;
      font-size: 30px;
      /* TODO Maybe use a different approach for grid & sizing. On a too-small screen the keypad breaks
      (try using a bigger height & width to see) */
      height: 80px;
      width: 80px;
      outline: 0;
      margin-right: var(--space-1);
      margin-bottom: var(--space-1);
    }

    .keypad {
      margin-bottom: var(--space-8);
    }
  `;

  const size = "4";

  const [pin, setPin] = useState<number[]>([1, 2, 3]);

  function handleDigitPress(digit: number) {
    if (pin.length < maxPINLength) {
      setPin((pin) => [...pin, digit]);
    }
  }

  return (
    <StyleWrapper>
      <div className="display">
        {pin.length ? pin.map((_) => <>&bull; </>) : <>&nbsp;</>}
      </div>
      <div className="keypad">
        <div>
          <KeypadButton onClick={() => handleDigitPress(1)}>1</KeypadButton>
          <KeypadButton onClick={() => handleDigitPress(2)}>2</KeypadButton>
          <KeypadButton onClick={() => handleDigitPress(3)}>3</KeypadButton>
        </div>
        <div>
          <KeypadButton onClick={() => handleDigitPress(4)}>4</KeypadButton>
          <KeypadButton onClick={() => handleDigitPress(5)}>5</KeypadButton>
          <KeypadButton onClick={() => handleDigitPress(6)}>6</KeypadButton>
        </div>
        <div>
          <KeypadButton onClick={() => handleDigitPress(7)}>7</KeypadButton>
          <KeypadButton onClick={() => handleDigitPress(8)}>8</KeypadButton>
          <KeypadButton onClick={() => handleDigitPress(9)}>9</KeypadButton>
        </div>
        <div>
          <KeypadButton onClick={() => setPin([])}>X</KeypadButton>
          <KeypadButton onClick={() => handleDigitPress(0)}>0</KeypadButton>
          <KeypadButton onClick={() => {}}>OK</KeypadButton>
        </div>
      </div>
    </StyleWrapper>
  );
}

type Props = PropsWithChildren<{
  onClick: () => void;
}>;

function KeypadButton({ onClick, children }: Props) {
  return (
    <Button variant="soft" size="4" onClick={onClick}>
      {children}
    </Button>
  );
}
