import UiSelector from "@/UI-Components/Selector/UiSelector";
import React, { SelectHTMLAttributes } from "react";
import { ClassNames, CustomComponents } from "react-day-picker";

type CustomDropdownProps = {
  options?: { value: number; label: string }[];
  classNames: ClassNames;
  components: CustomComponents;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "children">;

export const DateYearsDropdown = ({
  options = [],
  value,
  onChange,
}: CustomDropdownProps) => {
  const selected = options.find((opt) => opt.value === Number(value));

  const handleChange = (opt: Record<string, any>) => {
    const event = {
      target: { value: opt?.value?.toString?.() ?? "" },
    } as React.ChangeEvent<HTMLSelectElement>;
    onChange?.(event);
  };

  return (
    <UiSelector
      value={selected}
      onChange={handleChange}
      options={options}
      accessorKey="label"
      placeholder="Year"
      isRequired={false}
      className="border-none "
      containerClass="border"
    />
  );
};