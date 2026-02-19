import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { Controller } from "react-hook-form";
import { useGetConditionalErrorMessage } from "../hooks/useGetConditionalErrorMessage";
import { Error } from "./GlobalStyles";
import { Tooltip } from "@mui/material";
import "./DatePickerStyles.css";
import { HiOutlineInformationCircle } from "react-icons/hi";

export const ReactDatePicker = ({
  control,
  name,
  label,
  isRequired,
  errors,
  minDate,
  maxDate,
  readOnly = false,
  format = "DD/MM/YYYY",
  onChange,
  description = "",
  ...rest
}) => {
  const { errorMessage } = useGetConditionalErrorMessage({
    errors,
    id: name,
  });

  return (
    <div className="date-picker-wrapper">
      <div className="flex justify-between mb-1">
        {label && (
          <label
            className="text-gray-700 text-xs font-semibold pl-1 truncate capitalize"
            data-required={isRequired}
          >
            {label}
            {isRequired && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        {description && (
          <Tooltip title={description} arrow placement="top">
            <div>
              <HiOutlineInformationCircle
                className={"text-[0.75rem] ml-1 relative top-0"}
              />
            </div>
          </Tooltip>
        )}
      </div>

      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange: defaultOnChange } }) => (
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              data-error={!!errorMessage}
              format={format}
              disabled={readOnly}
              onChange={(val) => [
                onChange && onChange(moment(val)),
                defaultOnChange(moment(val)),
              ]}
              value={value ? moment(value) : null}
              minDate={minDate ? moment(minDate) : undefined}
              maxDate={maxDate ? moment(maxDate) : undefined}
              className="text-lightGray"
              slotProps={{
                textField: {
                  error: !!errorMessage,
                  sx: {
                    "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline":
                      {
                        border: "2px solid red !important",
                      },
                    "& .MuiOutlinedInput-root.Mui-error": {
                      background: "transparent !important",
                    },
                  },
                },
              }}
              sx={{
                "& .MuiInputBase-root.Mui-focused": {
                  border: "2px solid var(--color-primary) !important",
                  background: "transparent !important",
                },
              }}
              {...rest}
            />
          </LocalizationProvider>
        )}
      />

      {!!errorMessage && <Error>{errorMessage}</Error>}
    </div>
  );
};
