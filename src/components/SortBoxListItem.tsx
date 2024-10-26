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
        `py-3 px-6 ring-0 outline-none border-none ${isSelected ? "dark:bg-a2sd dark:text-a2d bg-a2s/60 text-a2/65" : isPressed || isHovered || isFocusVisible ? "dark:bg-[#4d4d4d] bg-a1s" : ""}`
      }
    >
      {text}
    </ListBoxItem>
  );
}

export default SortBoxListItem;
