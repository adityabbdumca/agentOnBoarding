import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DateTime } from "luxon";

interface IDateTimeProps {
  label?: string;
  value?: string; // "25-07-2023 14:30"
  onChange?: (value: string) => void;
  minAllowedDate?: string;
  maxAllowedDate?: string;
  isRequired?: boolean;
  errors?: string;
  readOnly?: boolean;
  disabled?: boolean;
}

const FORMAT = "dd-MM-yyyy HH:mm";

const HOURS = Array.from({ length: 25 }, (_, i) =>
  i.toString().padStart(2, "0")
);

const MINUTES = Array.from({ length: 61 }, (_, i) =>
  i.toString().padStart(2, "0")
);

const UiCustomDateTimeInput = ({
  label,
  value,
  onChange,
  minAllowedDate,
  maxAllowedDate,
  isRequired,
  errors,
  readOnly = false,
  disabled = false,
}: IDateTimeProps) => {
  const dateTime =
    value && DateTime.fromFormat(value, FORMAT).isValid
      ? DateTime.fromFormat(value, FORMAT)
      : null;

  const handleDateChange = (date: Date | null) => {
    if (!date || !onChange) return;

    const updated = DateTime.fromJSDate(date)
      .set({
        hour: dateTime?.hour ?? 0,
        minute: dateTime?.minute ?? 0,
      })
      .toFormat(FORMAT);

    onChange(updated);
  };

  const handleTimeChange = (
    unit: "hour" | "minute",
    val: string
  ) => {
    if (!onChange || !dateTime) return;

    onChange(
      dateTime.set({ [unit]: Number(val) }).toFormat(FORMAT)
    );
  };

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold text-gray-700 pl-1">
          {label}
          {isRequired && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      {/* Unified Input */}
      <div
        className={`flex items-center h-10 px-2 rounded-sm border transition-all
          ${
            errors
              ? "border-red-500 focus-within:ring-1 focus-within:ring-red-500"
              : "border-lightGray focus-within:ring-1 focus-within:ring-primary"
          }
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
        `}
      >
        {/* Date */}
        <DatePicker
          selected={dateTime?.toJSDate() ?? null}
          onChange={handleDateChange}
          dateFormat="dd/MM/yyyy"
          placeholderText="dd/mm/yyyy"
          disabled={disabled}
          readOnly={readOnly}
          minDate={
            minAllowedDate
              ? DateTime.fromFormat(minAllowedDate, FORMAT).toJSDate()
              : undefined
          }
          maxDate={
            maxAllowedDate
              ? DateTime.fromFormat(maxAllowedDate, FORMAT).toJSDate()
              : undefined
          }
          className="text-xs outline-none w-[110px] bg-transparent"
        />

        {/* Divider */}
        <span className="mx-2 ">|</span>

        {/* Hour */}
        <select
          value={dateTime ? dateTime.hour.toString().padStart(2, "0") : ""}
          onChange={(e) => handleTimeChange("hour", e.target.value)}
          disabled={disabled || !dateTime}
          className="text-xs outline-none bg-transparent appearance-none w-[26px]"
        >
          <option value="" disabled>
            HH
          </option>
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        <span className="mx-1">:</span>

        {/* Minute */}
        <select
          value={dateTime ? dateTime.minute.toString().padStart(2, "0") : ""}
          onChange={(e) => handleTimeChange("minute", e.target.value)}
          disabled={disabled || !dateTime}
          className="text-xs outline-none bg-transparent appearance-none w-[26px]"
        >
          <option value="" disabled>
            mm
          </option>
          {MINUTES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {errors && <p className="text-error text-xs">{errors}</p>}
    </div>
  );
};

export default UiCustomDateTimeInput;
