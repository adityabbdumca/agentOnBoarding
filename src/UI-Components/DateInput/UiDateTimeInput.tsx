import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateTime } from "luxon";

interface IDateProps {
  label?: string;
  value?: string; // "25-07-2023 14:30"
  onChange?: (value: string) => void;
  minAllowedDate?: string; // "25-07-2023 10:00"
  maxAllowedDate?: string;
  isRequired?: boolean;
  errors?: string;
  readOnly?: boolean;
  disabled?: boolean;
}

const UiDateTimeInput = ({
  label,
  value,
  onChange,
  minAllowedDate,
  maxAllowedDate,
  isRequired,
  errors,
  readOnly = false,
  disabled = false,
}: IDateProps) => {
  const FORMAT = "dd-MM-yyyy HH:mm";
  const DISPLAY_FORMAT = "dd/MM/yyyy HH:mm";

 const parsedValue: Date | null =
  typeof value === "string"
    ? (() => {
        const dt = DateTime.fromFormat(value, FORMAT);
        return dt.isValid ? dt.toJSDate() : null;
      })()
    : null;

  const minDate: Date | undefined =
    minAllowedDate && DateTime.fromFormat(minAllowedDate, FORMAT).isValid
      ? DateTime.fromFormat(minAllowedDate, FORMAT).toJSDate()
      : undefined;

  const maxDate: Date | undefined =
    maxAllowedDate && DateTime.fromFormat(maxAllowedDate, FORMAT).isValid
      ? DateTime.fromFormat(maxAllowedDate, FORMAT).toJSDate()
      : undefined;

  const handleChange = (date: Date | null) => {
    if (!onChange) return;

    const formatted =
      date ? DateTime.fromJSDate(date).toFormat(FORMAT) : "";

    onChange(formatted);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-gray-700 text-xs font-semibold pl-1">
          {label}
          {isRequired && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <DatePicker
        selected={parsedValue}
        onChange={handleChange}
        dateFormat={DISPLAY_FORMAT}
        placeholderText="dd/mm/yyyy hh:mm"
        showTimeSelect
        timeIntervals={15}
        timeCaption="Time"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        minDate={minDate}
        maxDate={maxDate}
        isClearable={!readOnly}
        disabled={disabled}
        readOnly={readOnly}
        className={`h-10 w-full text-xs px-2 py-2 rounded-sm
          border outline-none transition-all
          ${
            errors
              ? "border-red-500 focus:ring-red-500"
              : "border-lightGray focus:ring-1 focus:ring-primary"
          }
          ${disabled ? "cursor-not-allowed bg-gray-100" : "cursor-pointer"}
        `}
      />

      {errors && <p className="text-error text-xs">{errors}</p>}
    </div>
  );
};

export default UiDateTimeInput;
