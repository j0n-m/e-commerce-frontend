import { ListBoxItem, ListBoxItemProps } from "react-aria-components";

type SortBoxListItemProps = {
  props: ListBoxItemProps;
  text: string;
};
function SortBoxListItem({ props, text }: SortBoxListItemProps) {
  return (
    <ListBoxItem
      {...props}
      className={({ isPressed, isSelected, isHovered, isFocusVisible }) =>
        `py-3 px-6 ring-0 outline-none border-none ${isSelected ? "dark:bg-a2sd" : isPressed || isHovered || isFocusVisible ? "dark:bg-[#4d4d4d]" : ""}`
      }
    >
      {text}
    </ListBoxItem>
  );
}

export default SortBoxListItem;
