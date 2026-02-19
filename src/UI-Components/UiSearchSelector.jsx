import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";

import { useGlobalRouteHandler } from "#/hooks";
import { stringUtility } from "@repo/utilities/string.utility";
import {
  Asterisk,
  ChevronDown,
  LoaderCircle,
  Plus,
  Settings,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { forwardRef, useRef } from "react";
import UiButton from "../Buttons/UiButton";
import UiTextInputBase from "../Inputs/UiTextInputBase";
import { useMutation } from "@tanstack/react-query";
import { handleGlobalPostRequest } from "@repo/services/requests";
import { handleNetworkError } from "../Toasts/globalToastHandler";

const DefaultOptionComp = ({ value, accessorKey }) => (
  <ComboboxOption
    value={value}
    key={value?.id}
    className="px-4 py-2 text-sm font-semibold cursor-pointer select-none outline-none
                 data-[selected]:text-white data-[selected]:bg-primary  data-[focus]:bg-primary/20"
  >
    {value?.[accessorKey]}
  </ComboboxOption>
);

const UiSearchSelector = forwardRef(function UiSelector(
  {
    className,
    label,
    options,
    error,
    value,
    accessorKey = "name",
    placeholder = "search ...",
    disabled = false,
    query,
    setQuery,
    textEllipsis = 40,
    onChange,
    validateQuery,
    isRequired = true,
    isSearching = false,
    containerClass,
    emptyText,
    settingActionText,
    settingUrl,
    handleAddOption,
    OptionComp = DefaultOptionComp,
    name,
  },
  ref
) {
  const { navigate } = useGlobalRouteHandler();
  const inputRef = useRef(null);
  const { endPoint = "", payload, refetchOptions } = handleAddOption || {};

  function handleSearchQuery(event) {
    validateQuery?.(event);
    setQuery(event.target.value);
  }

  const addOptionMutation = useMutation({
    mutationFn: (data) => handleGlobalPostRequest({ url: endPoint, data }),
    onError: (error) => handleNetworkError({ error }),
  });

  const resolvedEmptyText = emptyText || `No ${label?.toLowerCase()} data available`;

  return (
    <div className="w-full">
      {label && (
        <label className="text-xs flex pb-0.5 items-center gap-1 text-left text-body font-semibold pl-1">
          {label}
          {isRequired && <Asterisk className="size-2 text-error -translate-y-1" />}
        </label>
      )}
      <Combobox
        immediate
        value={value}
        onChange={onChange}
        disabled={disabled}
        onClose={() => {
          setQuery?.("");
        }}
      >
        {({ open }) => (
          <>
            <div className="relative">
              <ComboboxInput
                autoComplete="off"
                ref={inputRef}
                as={UiTextInputBase}
                className={className}
                displayValue={(item) =>
                  stringUtility.addEllipsisAtEnd(
                    String(item?.[accessorKey] || ""),
                    Number(textEllipsis)
                  )
                }
                onChange={handleSearchQuery}
                placeholder={placeholder}
              />
              <ComboboxButton
                className="group absolute inset-y-0 right-0 px-2.5 focus:border focus:border-primary/50"
                ref={ref}
                name={name}
              >
                {!isSearching ? (
                  <ChevronDown
                    className="size-5 text-gray bg-offWhite rounded"
                    aria-hidden="true"
                  />
                ) : (
                  <LoaderCircle className="size-5 text-darkGray animate-spin" />
                )}
              </ComboboxButton>
            </div>

            {error?.message && (
              <p className="text-xs text-error font-medium pl-2 mt-0.5">
                {error?.message}
              </p>
            )}

            <AnimatePresence>
              {open && (
                <ComboboxOptions
                  anchor="bottom"
                  static
                  as={motion.div}
                  initial={{ opacity: 0, y: 2 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -2 }}
                  className={`origin-top w-[var(--input-width)] [--anchor-gap:4px] shadow-md border bg-white border-extraLightGray rounded overflow-y-auto outline-none z-50 ${containerClass}`}
                >
                  <div className="max-h-52 overflow-y-auto w-full">
                    {!isSearching && options?.length === 0 ? (
                      endPoint ? (
                        <div className="flex justify-between items-center px-4 py-2 text-sm font-semibold cursor-pointer select-none outline-none hover:bg-primary/20">
                          <span>{query} </span>
                          <span
                            className="p-1 rounded bg-gray/30 hover:text-primary flex items-center justify-center"
                            onClick={() => {
                              addOptionMutation
                                .mutateAsync(payload)
                                .then((res) => {
                                  onChange(res.data);
                                  inputRef.current?.blur();
                                })
                                .then(() => refetchOptions?.());
                            }}
                          >
                            {addOptionMutation.isPending ? (
                              <LoaderCircle className="size-4 animate-spin" />
                            ) : (
                              <Plus className="size-4" />
                            )}
                          </span>
                        </div>
                      ) : (
                        <div className="flex gap-2 items-center text-sm font-semibold px-4 py-2">
                          {resolvedEmptyText}
                        </div>
                      )
                    ) : (
                      options?.map((item) => (
                        <OptionComp
                          key={item.id}
                          value={item}
                          accessorKey={accessorKey}
                        />
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
                  ) : null}
                </ComboboxOptions>
              )}
            </AnimatePresence>
          </>
        )}
      </Combobox>
    </div>
  );
});

export default UiSearchSelector;
