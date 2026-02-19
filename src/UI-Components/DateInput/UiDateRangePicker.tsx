import { Listbox, ListboxButton, ListboxOptions } from "@headlessui/react";
import { Asterisk, Calendar, ChevronDown, LoaderCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { DateRange } from "react-day-picker";
import UiButton from "../Buttons/UiButton";
import { datetimeUtility } from "@/utlities/dateTime.utility";
import React from "react";
import { stringUtility } from "@/utlities/string.utlity";
import DateRangeBaseComp from "./components/DateRangeBaseComp";

export interface TDateRangePickerProps {
  placeholder?: string;
  label?: string;
  value?: DateRange;
  onChange: (dateRange: DateRange | undefined) => void;
  error?: { message?: string };
  disabled?: boolean;
  className?: string;
  isRequired?: boolean;
  isLoading?: boolean;
  containerClass?: string;
  minDate?: Date;
  maxDate?: Date;
  dateFormat?: string;
  clearable?: boolean;
}

function UiDateRangePicker({
  placeholder = "Select date range",
  label,
  value,
  onChange,
  error,
  disabled = false,
  className = "",
  isRequired = true,
  isLoading = false,
  containerClass,
  minDate = new Date("1930-01-01"),
  maxDate,
  clearable = true,
}: TDateRangePickerProps) {
  const getDisplayText = (): string => {
    const { from, to } = value || {};
    if (!from && !to) return placeholder;

    const format = (date: Date) =>
      datetimeUtility.formatJsDate({
        value: String(date),
        format: "dd-MM-yyyy",
      });

    return from && to
      ? `${format(from)} - ${format(to)}`
      : from
        ? format(from)
        : placeholder;
  };

  const handleDateRangeSelect = (dateRange: DateRange | undefined) => {
    onChange(dateRange);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(undefined);
  };

  const hasValidRange = value?.from || value?.to;

  return (
    <Listbox
      value={value}
      onChange={handleDateRangeSelect}
      as="div"
      className="flex flex-col"
      disabled={isLoading || disabled}
    >
      {({ open }) => (
        <>
          {label && (
            <label className="text-xs flex items-center gap-1 text-left text-body font-semibold pl-1">
              {label}
              {isRequired && (
                <Asterisk className="size-2 text-error -translate-y-1" />
              )}
            </label>
          )}

          <ListboxButton
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
            className={`w-72 border whitespace-nowrap rounded outline-none text-sm 
            flex items-center justify-between text-body bg-transparent font-semibold px-2 py-1.5 ${className}
            ${
              error ? "border-extraLightGray" : "border-extraLightGray"
            } disabled:cursor-not-allowed disabled:opacity-70 disabled:bg-extraLightGray/30 focus:ring-primary focus:border-primary/50`}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Calendar className="size-4 text-gray flex-shrink-0" />
              <span
                className={`text-sm truncate ${
                  hasValidRange
                    ? "text-subHeading font-semibold"
                    : "text-darkGray/80 font-medium"
                }`}
              >
                {stringUtility.addEllipsisAtEnd(getDisplayText(), 50)}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {clearable && hasValidRange && !disabled && !isLoading && (
                <UiButton
                  buttonType="tertiary"
                  onClick={handleClear}
                  className="p-0.5  rounded transition-colors"
                  icon={<X className="size-3 text-gray" />}
                />
              )}

              {isLoading ? (
                <LoaderCircle className="size-5 text-gray animate-spin" />
              ) : (
                <ChevronDown
                  data-error={error}
                  className="size-5 text-gray bg-offWhite rounded data-[error=true]:text-error"
                  aria-hidden="true"
                />
              )}
            </div>
          </ListboxButton>

          {error?.message && (
            <p className="text-xs text-error font-medium pl-2 mt-0.5">
              {error.message}
            </p>
          )}

          <AnimatePresence>
            {open && (
              <ListboxOptions
                static
                anchor="bottom"
                as={motion.div}
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                className={`[--anchor-gap:4px] w-[var(--button-width)] shadow-md border border-extraLightGray bg-white 
                rounded outline-none z-50 ${containerClass}`}
              >
                <div className="p-4">
                  <DateRangeBaseComp
                    value={value}
                    handleDateRangeSelect={handleDateRangeSelect}
                    minDate={minDate}
                    maxDate={maxDate}
                  />
                </div>
              </ListboxOptions>
            )}
          </AnimatePresence>
        </>
      )}
    </Listbox>
  );
}

export default UiDateRangePicker;