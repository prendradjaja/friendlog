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
  __isNew__: false;
  value: string;
  label: string;
}

type SelectOption = KnownSelectOption | NewSelectOption;

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

interface Value {
  existingFriendIds: number[];
  newFriendNames: string[];
}

export function SelectFriends({ allFriends, initialValue, onChange }: Props) {
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

  const defaultSelectValue = selectOptions.filter((option) =>
    initialValue.existingFriendIds.includes(option.friend.id),
  );
  const [friends, setFriends] =
    useState<readonly SelectOption[]>(defaultSelectValue); // todo Rename to value maybe

  function handleChange(newValue: readonly SelectOption[]) {
    setFriends(newValue);
    // CONTINUE_HERE: newValue needs to be mapped to type Value (see commented-out code in EditHangoutPage.handleSave)
    // - You'll also need to uncomment <SelectFriends> in EditHangoutPage
    // - Which will also require adding an onChange over there
    // - Does it matter which order we call setFriends and onChange?
    onChange(newValue);
  }

  return (
    <CreatableSelect
      autoFocus={mode === "create"}
      closeMenuOnSelect={false}
      blurInputOnSelect={false}
      isMulti
      defaultValue={defaultSelectValue}
      filterOption={createFilter({
        matchFrom: "start",
      })}
      value={friends}
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
