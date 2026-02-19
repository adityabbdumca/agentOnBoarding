import { Tooltip } from "@mui/material";
import { useGetConditionalErrorMessage } from "@/hooks/useGetConditionalErrorMessage";
import { Error } from "./GlobalStyles";
import { HiOutlineInformationCircle } from "react-icons/hi";

const Input = ({
  name,
  label,
  type,
  placeholder,
  onChange,
  minLength,
  maxLength,
  readOnly,
  disabled = false,
  Width,
  isRequired=false,
  minHeight,
  required,
  inputRef,
  errors,
  showErrorMessage,
  autoComplete,
  defaultValue = "",
  description,
  helperText = "",
  endIcon,
  className,
  ...rest
}) => {
  const { errorMessage } = useGetConditionalErrorMessage({
    errors,
    id: name,
  });

  return (
    <div className="relative">
      <div className="relative">
        <div className="flex justify-between mb-1">
          {label && (
            <label
              className="text-gray-700 text-xs font-semibold pl-1 truncate capitalize"
              data-required={isRequired}
            >
              {label}
              {isRequired==true && <span className="text-red-500 ml-0.5">*</span>}
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

        <input
          {...rest}
          {...inputRef}
          type={type}
          style={{ width: Width ? `${Width}px` : "100%", minHeight }}
          autoComplete={autoComplete}
          placeholder={placeholder}
          minLength={minLength}
          maxLength={maxLength}
          readOnly={readOnly}
          required={required}
          disabled={disabled}
          defaultValue={defaultValue}
          data-error={!!errorMessage || !!showErrorMessage}
          data-readonly={readOnly}
          className={`h-10
            w-full text-xs px-2 py-2 rounded-lg transition-all font-medium
            border-2 border-lightGray  placeholder:text-xs placeholder:opacity-100 
            ${disabled || readOnly ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
          
             ${
               disabled || readOnly
                 ? "focus:outline-none focus:ring-0"
                 : (errorMessage ?? showErrorMessage)
                   ? "border-red-500 focus:outline-red-500"
                   : "border-2 focus:outline-primary"
             } ${className} 
            data-[error=true]:animate-shake 
          `}
          onChange={(e) => {
            inputRef?.onChange?.(e);
            onChange?.(e);
          }}
        />

        {endIcon && (
          <div
            className="absolute right-2"
            style={{
              top: errorMessage || showErrorMessage ? "55%" : "65%",
              transform: "translateY(-50%)",
            }}
          >
            {endIcon}
          </div>
        )}

        {errorMessage || showErrorMessage || errors?.name?.message ? (
          <Error className="text-red-500 mt-1 text-xs">
            {errorMessage ?? showErrorMessage ?? errors?.name?.message}
          </Error>
        ) : helperText ? (
          <Error className="text-gray-700 mt-1 text-xs">{helperText}</Error>
        ) : null}
      </div>
    </div>
  );
};

export default Input;
