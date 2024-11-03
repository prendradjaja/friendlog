import { useRef, useMemo, useState } from "react";
import * as api from "./api";
import { Hangout, Friend } from "shared";
import {
  useLoaderData,
  useNavigate,
  LoaderFunctionArgs,
} from "react-router-dom";
import StyleWrapper from "./EditHangoutPage.styles";
import { Button, Heading, TextField, Text } from "@radix-ui/themes";
import { getToday } from "./date-util";
import { UnreachableCaseError, Prettify } from "ts-essentials";
import { isValidationError } from "shared/validators";
import { GrowableTextarea } from "./GrowableTextarea";
import { encodeNewlines, decodeNewlines } from "./encode-newlines";
import { KeyboardListener } from "./KeyboardListener";
import { SelectFriends, Value } from "./SelectFriends";

type LoaderData = Prettify<
  {
    allFriends: Friend[];
  } & (
    | {
        mode: "edit";
        hangout: Hangout;
        hangoutId: number;
      }
    | {
        mode: "create";
        hangout: undefined;
      }
  )
>;

export function EditHangoutPage() {
  const loaderData = useLoaderData() as LoaderData;
  const { allFriends, hangout, mode } = loaderData;
  const [title, setTitle] = useState(
    hangout ? decodeNewlines(hangout.title) : "",
  );
  const hangoutFriendIds = hangout
    ? hangout.friends.map((friend) => friend.id)
    : [];
  const initialSelectValue = {
    existingFriendIds: hangoutFriendIds,
    newFriendNames: [],
  };
  const [who, setWho] = useState<Value>(initialSelectValue);

  const dateRef = useRef<HTMLInputElement>(null);
  const [isPrivate, setIsPrivate] = useState(hangout ? hangout.private : false);

  const today = useMemo(getToday, []);

  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  async function handleSave() {
    setSaving(true);

    const { existingFriendIds, newFriendNames } = who;
    const hangout_date_string = dateRef.current!.value;

    // todo Can add a bulk-create endpoint or just parallelize
    const createdFriendIds: number[] = [];
    for (const name of newFriendNames) {
      const { id } = await api.createMyFriend({ name });
      createdFriendIds.push(id);
    }

    const friendIds = [...existingFriendIds, ...createdFriendIds];

    const payload = {
      title: encodeNewlines(title),
      hangout_date_string,
      friends: friendIds,
      private: isPrivate,
    };

    let sendApiCall: () => Promise<{}>;
    if (loaderData.mode === "create") {
      sendApiCall = () => api.createMyHangout(payload);
    } else if (loaderData.mode === "edit") {
      sendApiCall = () => api.updateHangout(loaderData.hangoutId, payload);
    } else {
      throw new UnreachableCaseError(loaderData);
    }

    sendApiCall().then(
      () => navigate("/"),
      (error) => {
        setSaving(false);
        if (isValidationError(error)) {
          alert(error.message);
        }
      },
    );
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (
      event.key === "s" &&
      !event.altKey &&
      event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey
    ) {
      handleSave();
    } else if (
      event.key === "s" &&
      !event.altKey &&
      !event.ctrlKey &&
      event.metaKey &&
      !event.shiftKey
    ) {
      event.preventDefault();
      handleSave();
    }
  }

  return (
    <StyleWrapper>
      <Heading as="h1">
        {mode === "edit" ? "Edit hangout" : "Create hangout"}
      </Heading>

      <Heading as="h2" size="3">
        Who
      </Heading>
      {/* TODO Add onChange and un-disable the save button */}
      <SelectFriends
        allFriends={allFriends}
        initialValue={initialSelectValue}
        onChange={setWho}
      />

      <Heading as="h2" size="3">
        What
      </Heading>
      <GrowableTextarea
        value={title}
        onChange={setTitle}
        placeholder="e.g. We walked to the park"
      />

      <Heading as="h2" size="3">
        When
      </Heading>
      <input
        ref={dateRef}
        type="date"
        defaultValue={hangout?.hangout_date_string ?? today}
      />

      <Heading as="h2" size="3">
        Privacy
      </Heading>
      <div className="checkbox-container">
        <input
          type="checkbox"
          id="is-private-checkbox"
          checked={isPrivate}
          onChange={(event) => setIsPrivate(event.target.checked)}
        />
        <Text as="label" htmlFor="is-private-checkbox">
          Private hangout
        </Text>
      </div>

      <div className="button-container">
        <Button onClick={handleSave} disabled={saving}>
          {mode === "create" ? "Add" : "Save"}
        </Button>
      </div>
      <KeyboardListener onKeyDown={handleKeyDown} />
    </StyleWrapper>
  );
}

EditHangoutPage.loader = async ({
  params,
}: LoaderFunctionArgs): Promise<LoaderData> => {
  const hangoutId: string | undefined = params.hangoutId;
  if (hangoutId !== undefined) {
    const [allFriends, hangout] = await Promise.all([
      api.getMyFriends(),
      api.getHangout(+hangoutId),
    ]);
    return { allFriends, mode: "edit", hangout, hangoutId: +hangoutId };
  } else {
    const allFriends = await api.getMyFriends();
    return { allFriends, mode: "create", hangout: undefined };
  }
};
