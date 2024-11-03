import { sortBy } from "./util";
import CreatableSelect from "react-select/creatable";
import { Friend } from "shared";
import { InputProps, components, createFilter } from "react-select";
import { useState } from "react";

// todo Move Select stuff into a separate component?
interface KnownSelectOption {
  __isNew__: false;
  value: number;
  label: string;
  friend: Friend;
}

interface NewSelectOption {
  __isNew__: true;
  value: string;
  label: string;
}

type SelectOption = KnownSelectOption | NewSelectOption;
type ReactSelectValueType = readonly SelectOption[];

const colors = {
  reactSelectLightBlue: "hsl(216 100 92)",
  radixIndigo5: "#D2DEFF",
} as const;

const Input = (props: InputProps<SelectOption>) => {
  return <components.Input {...props} enterKeyHint="enter" />;
};

interface Props {
  allFriends: Friend[];
  initialValue: Value;
  onChange: (value: Value) => void;
}

export interface Value {
  existingFriendIds: number[];
  newFriendNames: string[];
}

export function SelectFriends({ allFriends, initialValue, onChange }: Props) {
  return (
    <SelectFriendsInternal
      allFriends={allFriends}
      initialValue={toReactSelectValueType(initialValue, allFriends)}
      onChange={(value) => onChange(fromReactSelectValueType(value))}
    />
  );
}

interface SelectFriendsInternal {
  allFriends: Friend[];
  initialValue: ReactSelectValueType;
  onChange: (value: ReactSelectValueType) => void;
}

function fromReactSelectValueType(friends: ReactSelectValueType): Value {
  const existingFriendIds = friends
    .filter((option): option is KnownSelectOption => !option.__isNew__)
    .map((option) => option.friend.id);
  const newFriendNames = friends
    .filter((option): option is NewSelectOption => option.__isNew__)
    .map((option) => option.value);

  return {
    existingFriendIds,
    newFriendNames,
  };
}

function toReactSelectValueType(
  value: Value,
  allFriends: Friend[],
): ReactSelectValueType {
  if (value.newFriendNames.length) {
    throw new Error(
      'toReactSelectValueType only expected to handle the "all existing friends" case',
    );
  }
  const allFriendsById: Partial<Record<number, Friend>> = {};
  for (const friend of allFriends) {
    allFriendsById[friend.id] = friend;
  }

  // ptodo alphabetize
  return value.existingFriendIds.map(
    (friendId) =>
      ({
        __isNew__: false,
        value: friendId,
        label: allFriendsById[friendId]!.name,
        friend: allFriendsById[friendId]!,
      }) satisfies KnownSelectOption,
  );
}

function SelectFriendsInternal({
  allFriends,
  initialValue,
  onChange,
}: SelectFriendsInternal) {
  const friendsAlphabetical = sortBy(allFriends, (x) => x.name);
  const selectOptions = friendsAlphabetical.map(
    (friend) =>
      ({
        __isNew__: false,
        value: friend.id,
        label: friend.name,
        friend,
      }) satisfies KnownSelectOption,
  );
  const [value, setValue] = useState(initialValue);

  // const defaultSelectValue = selectOptions.filter((option) =>
  //   initialValue.existingFriendIds.includes(option.friend.id),
  // );
  // const [friends, setFriends] =
  //   useState<readonly SelectOption[]>(defaultSelectValue); // todo Rename to value maybe

  function handleChange(newValue: readonly SelectOption[]) {
    // setFriends(newValue);
    // CONTINUE_HERE: newValue needs to be mapped to type Value (see commented-out code in EditHangoutPage.handleSave)
    // - You'll also need to uncomment <SelectFriends> in EditHangoutPage
    // - Which will also require adding an onChange over there
    // - Does it matter which order we call setFriends and onChange?
    onChange(newValue);
  }

  // autoFocus={mode === "create"}

  // // ptodo Maybe use controlled component?
  // value={friends}

  return (
    <CreatableSelect
      closeMenuOnSelect={false}
      blurInputOnSelect={false}
      isMulti
      defaultValue={initialValue}
      filterOption={createFilter({
        matchFrom: "start",
      })}
      options={selectOptions}
      onChange={handleChange}
      tabSelectsValue={false}
      components={{ Input }}
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
  );
}
