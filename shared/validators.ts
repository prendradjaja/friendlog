import type { HangoutUpdate, NewHangout } from "./shared";

export interface ValidationError {
  type: "ValidationError";
  message: string; // To be displayed to the end user
}

function createValidationError(message: string): ValidationError {
  return {
    type: "ValidationError",
    message,
  };
}

export function isValidationError(obj: unknown): obj is ValidationError {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "type" in obj &&
    obj.type === "ValidationError"
  );
}

export function isInvalidHangout(
  hangout: HangoutUpdate | NewHangout,
): ValidationError | false {
  if (hangout.friends.length === 0) {
    return createValidationError("A hangout must have 1 or more friends");
  } else {
    return false;
  }
}
