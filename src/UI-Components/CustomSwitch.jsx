/* eslint-disable react/display-name */
import { forwardRef } from "react";
import { useController } from "react-hook-form";

const CustomSwitch = forwardRef(
  (
    { label, name, control, rules, defaultValue = false, id, onChange },
    ref
  ) => {
    const {
      field: { value = false, onChange: fieldOnChange, ref: fieldRef },
    } = useController({
      name,
      control,
      rules,
      defaultValue,
    });

    return (
      <label htmlFor={id} className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            className="sr-only"
            checked={value}
            onChange={(e) => {
              fieldOnChange(e);
              if (onChange) onChange(e);
            }}
            ref={(el) => {
              fieldRef(el);
              if (ref) {
                if (typeof ref === "function") ref(el);
                else ref.current = el;
              }
            }}
          />
          <div
            className={`w-10 h-6 border border-lightGray rounded-full shadow-inner transition-colors duration-300 ease-in-out ${
              value ? "bg-primary" : "bg-globalThemeBlack/10"
            }`}
          />
          <div
            className={`absolute w-4 h-4   rounded-full shadow inset-y-1 left-1 transition-transform duration-300 ease-in-out ${
              value ? "translate-x-4 bg-white" : "bg-lightGray"
            }`}
          />
        </div>
        <div className="ml-3 text-gray-700 font-semibold text-sm">{label}</div>
      </label>
    );
  }
);

export default CustomSwitch;
