import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateTime } from "luxon";
import { allowOnlyNumbers } from "@/HelperFunctions/helperFunctions";

const UiDateInput = ({
  label,
  value, // "25-07-2023"
  onChange,
  minAllowedDate, // Luxon DateTime or undefined
  maxAllowedDate, // Luxon DateTime or undefined
  isRequired,
  errors,
  readOnly = false,
  disabled = false,
}) => {
  const parsedValue =
    typeof value === "string" && value.trim() !== ""
      ? DateTime.fromFormat(value, "dd-MM-yyyy").isValid
        ? DateTime.fromFormat(value, "dd-MM-yyyy").toJSDate()
        : null
      : null;

  const handleChange = (date) => {
    const formatted =
      date && date instanceof Date
        ? DateTime.fromJSDate(date).toFormat("dd-MM-yyyy")
        : "";

    onChange(formatted);
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          className="text-gray-700 text-xs font-semibold pl-1 truncate"
          data-required={isRequired}
        >
          {label}
          {isRequired && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
      <DatePicker
        selected={parsedValue}
        onChange={handleChange}
        onChangeRaw={(e) => {
          const isTyping =
            e.type === "input" ||
            e.nativeEvent?.inputType?.startsWith("insert") ||
            e.nativeEvent?.inputType?.startsWith("delete");

          if (isTyping) {
            allowOnlyNumbers(e);

            let val = e.target.value;
            if (val.length > 2 && val.length <= 4) {
              val = `${val.slice(0, 2)}/${val.slice(2)}`;
            } else if (val.length > 4) {
              val = `${val.slice(0, 2)}/${val.slice(2, 4)}/${val.slice(4, 8)}`;
            }
            e.target.value = val.slice(0, 10);
          }
        }}
        dateFormat="dd/MM/yyyy"
        placeholderText="dd/mm/yyyy"
        className={`h-10 z-50 
            w-full text-xs px-2 py-2 rounded-sm transition-all font-medium outline-none
            border border-lightGray  placeholder:text-xs placeholder:opacity-100  focus:ring-1 focus:ring-primary
           ${
             errors
               ? "border-red-500 focus:outline-red-500"
               : "focus:ring-1 focus:ring-primary"
           } ${disabled ? "cursor-not-allowed bg-gray-100" : "cursor-pointer"}`}
        minDate={minAllowedDate?.toJSDate()}
        maxDate={maxAllowedDate?.toJSDate()}
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        isClearable={!readOnly}
        disabled={disabled}
        readOnly={readOnly}
      />
      {errors && <p className="text-error text-xs">{errors}</p>}
    </div>
  );
};
export default UiDateInput;
