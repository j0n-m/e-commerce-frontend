import { IconChevronDown } from "@tabler/icons-react";
import type { SelectProps, ValidationResult } from "react-aria-components";
import {
  Button,
  Label,
  ListBox,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";

interface ProductSortBySelectBoxProps<T extends object>
  extends Omit<SelectProps<T>, "children"> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  items?: Iterable<T>;
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

function ProductSortBySelectBox<T extends object>({
  label,
  children,
  items,
  ...props
}: ProductSortBySelectBoxProps<T>) {
  return (
    <Select
      {...props}
      className={
        "flex items-center gap-2 group ring-0 outline-none border-none group"
      }
    >
      <Label className="dark:text-a1d">{label || "Sort By "}</Label>
      <Button
        className={({ isPressed, isFocusVisible, isHovered }) =>
          `px-2 py-2 border dark:border-1 dark:border-a2sd flex gap-2 rounded-lg dark:group-data-[open]:bg-a2sd ${isPressed || isFocusVisible || isHovered ? "dark:bg-a2sd" : "dark:bg-a0sd"}`
        }
      >
        <SelectValue />
        <IconChevronDown
          stroke={1}
          className={`group-data-[open]:rotate-180 transition-transform duration-300`}
        />
      </Button>

      <Popover
        className={`bg-white border dark:border-a3sd border-neutral-400 shadow-lg dark:bg-a3sd dark:text-a0d flex flex-col max-h-max overflow-y-auto rounded-md`}
      >
        <ListBox className={"z-20"} items={items}>
          {children}
        </ListBox>
      </Popover>
    </Select>
  );
}

export default ProductSortBySelectBox;
