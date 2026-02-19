
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { useState } from "react";
import {
  DateRange,
  DayPicker,
  getDefaultClassNames,
  Matcher,
} from "react-day-picker";
import UiButton from "../../Buttons/UiButton";
import "react-day-picker/style.css";
import { DateYearsDropdown } from "./DateYearsDropdown";
import { DateMonthsDropDown } from "./DateMonthsDropDown";

interface IDateRangeBaseCompProps {
  value?: DateRange;
  handleDateRangeSelect: (val?: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
}

const DateRangeBaseComp = ({
  value,
  handleDateRangeSelect,
  maxDate,
  minDate,
}: IDateRangeBaseCompProps) => {
  const defaultClassNames = getDefaultClassNames();
  const [selectedMonth, setSelectedMonth] = useState<Date>(
    value?.from || new Date()
  );
  return (
    <DayPicker
      mode="range"
      className="w-full"
      selected={value}
      captionLayout="dropdown"
      onSelect={handleDateRangeSelect}
      month={selectedMonth}
      onMonthChange={setSelectedMonth}
      disabled={
        {
          after: maxDate,
          before: minDate,
        } as Matcher
      }
      components={{
        Chevron: ({ orientation }) => {
          switch (orientation) {
            case "left":
              return (
                <ChevronLeft
                  className={` size-5 rounded  bg-offWhite text-body`}
                />
              );
            case "right":
              return (
                <ChevronRight
                  className={` size-5 rounded bg-offWhite text-body `}
                />
              );

            default:
              return <Circle className={` size-5 rounded   bg-offWhite`} />;
          }
        },
        DayButton: ({ day, onClick, modifiers, disabled }) => {
          const isSelected = modifiers?.selected;
          const isRangeStart = modifiers?.range_start;
          const isRangeEnd = modifiers?.range_end;
          const isRangeMiddle = modifiers?.range_middle;
          const isToday = modifiers?.today;

          return (
            <UiButton
              buttonType="tertiary"
              disabled={disabled}
              data-selected={isSelected}
              data-range-start={isRangeStart}
              data-range-end={isRangeEnd}
              data-range-middle={isRangeMiddle}
              data-today={isToday}
              className="text-body flex justify-center items-center font-semibold text-sm border border-extraLightGray rounded-full h-7 w-7 relative 
                                 data-[selected=true]:bg-primary  data-[selected=true]:text-white data-[selected=true]:border-primary/30 
                                "
              onClick={onClick}
              text={day.date?.getDate()}
            />
          );
        },
        // YearsDropdown: DateYearsDropdown,
        // MonthsDropdown: DateMonthsDropDown,
      }}
      classNames={{
        months: `${defaultClassNames.months} !w-full !max-w-full`,
        month: `${defaultClassNames.month} !w-full !max-w-full`,
        month_grid: `${defaultClassNames.month_grid} !w-full !max-w-full`,
        range_start: "!bg-white",
        range_middle: `!bg-white`,
        range_end: `!bg-white`,
        nav: `${defaultClassNames.nav} -mr-2 `,
      }}
    />
  );
};

export default DateRangeBaseComp;