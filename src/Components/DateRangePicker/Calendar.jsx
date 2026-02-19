import { forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CalenderStyles.css";

const Calendar = (
  {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    className,
    label = "",
    isMaxDate = false,
    setValue,
    name,
    watch,
    onDateChange,
  },
  ref
) => {
  const today = new Date();

  return (
    <div className=" flex flex-col">
      <label
        htmlFor="select-range"
        className="text-xs flex items-center gap-1 text-left text-black/80 pl-1 max-md:text-base ">
        {label}
      </label>

      <DatePicker
        ref={ref}
        showPopperArrow={false}
        className={` relative text-sm w-52 cursor-pointer  rounded-lg p-2 
  placeholder:font-medium max-md:placeholder:text-xs placeholder:text-xs placeholder:text-darkGray/80 outline-none   z-50
  disabled:bg-extraLightGray/30 disabled:opacity-70 disabled:cursor-not-allowed focus:border-primary/50 ${className}`}
        selected={(startDate && startDate) || (watch && watch(name)?.[0])}
        onChange={(dates) => {
          const [start, end] = dates;
          setStartDate && setStartDate(start);
          setEndDate && setEndDate(end);
          setValue && name && setValue(name, [start, end]);
          if (start && end && typeof onDateChange === "function") {
            onDateChange(start, end);
          }
        }}
        selectsRange
        startDate={(startDate && startDate) || (watch && watch(name)?.[0])}
        endDate={(endDate && endDate) || (watch && watch(name)?.[1])}
        dateFormat="dd/MM/yyyy"
        showMonthDropdown
        showYearDropdown
        popperPlacement="bottom-end"
        dropdownMode="select"
        popperProps={{
          strategy: "fixed", // <-- This is key
        }}
        placeholderText="Select a date range"
        maxDate={!isMaxDate ? today : undefined}
      />
    </div>
  );
};

export default forwardRef(Calendar);
