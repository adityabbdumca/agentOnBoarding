import { Switch } from "@headlessui/react";
import React from "react";
import * as motion from "motion/react-client";
import { Asterisk } from "lucide-react";
interface ISwitchProps {
  label?: string;
  checked?: boolean | undefined;
  containerClass?: string;
  className?: string;
  setChecked: (value: boolean) => void;
  disabled?: boolean;
  isRequired?: boolean;
}
const UiSwitch = ({
  label,
  checked,
  setChecked,
  className,
  containerClass,
  disabled=false,
  isRequired,
}: ISwitchProps) => {
  // const handleClick = () => {
  //   setChecked();
  // };
  return (
    <div className={`flex items-center gap-2 ${containerClass}`}>
      {label && (
        <label className="text-xs flex items-center gap-1 text-left text-body font-semibold pl-1">
          {label}
          {isRequired && (
            <Asterisk className="size-2 text-error -translate-y-1" />
          )}
        </label>
      )}
      <div className="flex-1">
        <Switch
          disabled={disabled}
          type="button"
          className={`flex h-6 w-12 cursor-pointer disabled:cursor-not-allowed rounded-full bg-lightGray p-1 ${className} data-[checked]:bg-success data-[checked]:justify-end items-center outline-none border-2  border-transparent focus-visible:border-primary/50`}
          checked={checked}
          onChange={setChecked}
          aria-checked={checked}
          tabIndex={0}>
          <motion.span
            aria-hidden="true"
            className="pointer-events-none inline-block size-4 translate-x-0 rounded-full bg-white "
            layout
            transition={{
              type: "spring",
              visualDuration: 0.2,
              bounce: 0.2,
            }}
          />
        </Switch>
      </div>
    </div>
  );
};

export default React.memo(UiSwitch);
