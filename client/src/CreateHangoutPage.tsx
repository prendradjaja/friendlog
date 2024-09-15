import { useRef, useMemo, useState } from "react";
import * as api from "./api";
import { Friend } from "shared";
import { useLoaderData, useNavigate } from "react-router-dom";
import StyleWrapper from "./CreateHangoutPage.styles";
import { Button, Heading, TextField } from "@radix-ui/themes";
import { getToday } from "./date-util";
import CreatableSelect from "react-select/creatable";

interface LoaderData {
  allFriends: Friend[];
}

// todo Move Select stuff into a separate component?
interface KnownSelectOption {
  __isNew__: false;
  value: number;
  label: string;
  friend: Friend;
}

interface NewSelectOption {
  __isNew__: false;
  value: string;
  label: string;
}

type SelectOption = KnownSelectOption | NewSelectOption;

const colors = {
  reactSelectLightBlue: "hsl(216 100 92)",
  radixIndigo5: "#D2DEFF",
} as const;

export function CreateHangoutPage() {
  const { allFriends } = useLoaderData() as LoaderData;
  const selectOptions = allFriends.map(
    (friend) =>
      ({
        __isNew__: false,
        value: friend.id,
        label: friend.name,
        friend,
      }) satisfies KnownSelectOption,
  );
  const [friends, setFriends] = useState<readonly SelectOption[]>([]);

  const titleRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  const today = useMemo(getToday, []);

  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();

  async function handleAdd() {
    setSaving(true);

    const existingFriendIds = friends
      .filter((option): option is KnownSelectOption => !option.__isNew__)
      .map((option) => option.friend.id);
    const friendNamesToCreate = friends
      .filter((option): option is NewSelectOption => option.__isNew__)
      .map((option) => option.value);
    const title = titleRef.current!.value.trim();
    const hangout_date_string = dateRef.current!.value;

    // todo Can add a bulk-create endpoint or just parallelize
    const createdFriendIds: number[] = [];
    for (const name of friendNamesToCreate) {
      const { id } = await api.createMyFriend({ name });
      createdFriendIds.push(id);
    }

    const friendIds = [...existingFriendIds, ...createdFriendIds];

    await api.createMyHangout({
      title,
      hangout_date_string,
      description: "",
      friends: friendIds,
    });
    navigate("/");
  }

  return (
    <StyleWrapper>
      <Heading as="h1">Create hangout</Heading>

      <Heading as="h2" size="3">
        Who
      </Heading>
      <CreatableSelect
        closeMenuOnSelect={false}
        blurInputOnSelect={false}
        isMulti
        defaultValue={[] as SelectOption[]}
        value={friends}
        options={selectOptions}
        onChange={setFriends}
        styles={{
          multiValue: (providedStyles, props) => ({
            ...providedStyles,
            backgroundColor: props.data.__isNew__
              ? colors.reactSelectLightBlue
              : providedStyles.backgroundColor,
            fontStyle: props.data.__isNew__ ? "italic" : "normal",
          }),
        }}
      />

      <Heading as="h2" size="3">
        What
      </Heading>
      <TextField.Root ref={titleRef} placeholder="e.g. Coffee at Timeless" />

      <Heading as="h2" size="3">
        When
      </Heading>
      <input ref={dateRef} type="date" defaultValue={today} />

      <div className="button-container">
        <Button onClick={handleAdd} disabled={saving}>
          Add
        </Button>
      </div>
    </StyleWrapper>
  );
}

CreateHangoutPage.loader = async (): Promise<LoaderData> => {
  const allFriends = await api.getMyFriends();
  return { allFriends };
};
