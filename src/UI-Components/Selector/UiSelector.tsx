import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";
import { Asterisk, ChevronDown, LoaderCircle, Settings } from "lucide-react";
import React, { forwardRef } from "react";
import UiTextInputBase from "../Input/UiTextInputBase";
import { stringUtility } from "@/utlities/string.utlity";
import { AnimatePresence, motion } from "motion/react";
import UiButton from "../Buttons/UiButton";

type TSelectorProps<T> = {
  placeholder: string;
  label?: string;
  value: any;
  options: T[];
  className?: string;
  accessorKey?: string;
  disabled?: boolean;
  error?: any;
  textEllipsis?: number;
  onChange: (option: T) => void;
  isRequired?: boolean;
  supportAnchor?: boolean;
  isLoading?: boolean;
  key?: string | number;
  containerClass?: string;
  emptyText?: string;
  settingUrl?: string;
  settingActionText?: string;
  name?: string;
};

const UiSelector = forwardRef(function UiSelector<
  T extends Record<string, any>,
>(
  {
    placeholder = "Select any option",
    label,
    value,
    onChange,
    options,
    error,
    disabled = false,
    className = "",
    accessorKey = "name",
    isRequired = true,
    textEllipsis = 100,
    isLoading = false,
    containerClass,
    settingUrl,
    emptyText = "No data available. Please add",
    settingActionText,
    name,
  }: TSelectorProps<T>,
  ref: React.ForwardedRef<HTMLButtonElement>
) {
  const { navigate } = useGlobalRoutesHandler();
  // Function to handle change in select option
  function handleChange(option: T) {
    onChange(option);
  }

  return (
    <Combobox
      onChange={handleChange}
      value={value}
      as="div"
      className={`flex flex-col ${className}`}
      disabled={isLoading || disabled}
      defaultValue={options?.[0]}
      immediate
    >
      {({ open }) => {
        return (
          <>
            <div className="relative">
              {label && (
                <label className="text-xs mb-1 flex items-center gap-1 text-left text-body font-semibold pl-1">
                  {label}
                  {isRequired && (
                    <Asterisk className="size-2 text-error -translate-y-1" />
                  )}
                </label>
              )}

              <ComboboxInput
                autoComplete="off"
                readOnly
                as={UiTextInputBase}
                className={className}
                displayValue={(item: Record<string, any>) =>
                  stringUtility.addEllipsisAtEnd(
                    String(item?.[accessorKey] || ""),
                    Number(textEllipsis)
                  )
                }
                placeholder={placeholder}
              />
              <ComboboxButton
                className="group absolute top-1/2 right-0 px-2.5 focus:border focus:border-primary/50"
                ref={ref}
                name={name}
              >
                {!isLoading ? (
                  <ChevronDown
                    className="size-5 text-gray-700 bg-offWhite rounded"
                    aria-hidden="true"
                  />
                ) : (
                  <LoaderCircle className="size-5 text-darkGray animate-spin" />
                )}
              </ComboboxButton>
            </div>
            {error && (
              <p className="text-xs text-error font-medium pl-2 mt-0.5">
                {error || error?.message}
              </p>
            )}

            <AnimatePresence>
              {open && (
                <ComboboxOptions
                  static
                  anchor="bottom"
                  as={motion.div}
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                  className={`[--anchor-gap:4px] w-[var(--input-width)] shadow-md border  border-extraLightGray bg-white 
            rounded outline-none z-50 ${containerClass}`}
                >
                  <div className="max-h-52 overflow-y-auto w-full">
                    {options?.length === 0 ? (
                      <div className="text-sm font-semibold px-4 py-2 ">
                        {emptyText}
                      </div>
                    ) : (
                      options?.map((option) => (
                        <ComboboxOption
                          key={option?.id}
                          value={option}
                          className="px-4 py-2 text-xs font-semibold cursor-auto select-none  outline-none data-[selected]:text-white data-[selected]:bg-primary  data-[focus]:bg-primary/20 capitalize"
                        >
                          {option?.[accessorKey]}
                        </ComboboxOption>
                      ))
                    )}
                  </div>
                  {settingActionText ? (
                    <div className="p-2 border-t border-extraLightGray">
                      <UiButton
                        onClick={() => {
                          navigate(String(settingUrl));
                        }}
                        buttonType="tertiary"
                        className="justify-start gap-2 flex-row-reverse text-body hover:text-primary/90"
                        icon={<Settings className="size-4" />}
                        text={settingActionText}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                </ComboboxOptions>
              )}
            </AnimatePresence>
          </>
        );
      }}
    </Combobox>
  );
});

export default UiSelector;
