import { Controller } from "react-hook-form";

const RadioButton = ({
  label,
  options,
  name,
  control,
  error,
  errorMsg,
  disabled,
  readOnly,
  onChange,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <Controller
        name={name}
        control={control}
        render={({ field: { value, onChange: defaultOnChange } }) => (
          <div className="-mt-1">
            {label && (
              <label className="text-gray-700 text-xs  font-semibold pl-1 truncate capitalize">
                {label}
              </label>
            )}
            <div className="flex flex-wrap mt-1 gap-2">
              {options.map((option) => {
                const isSelected = value === option.value;
                const isDisabled = option.disabled || readOnly;
                return (
                  <label
                    key={option.value}
                    className={`min-w-20 flex items-center justify-center px-3 py-1.5 rounded-md border text-sm font-medium cursor-pointer
                      ${
                        isSelected
                          ? "bg-primary text-white border-primary"
                          : "bg-white text-gray-900 border-gray-300"
                      }
                      ${
                        isDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:border-primary"
                      }
                    `}
                  >
                    <input
                      type="radio"
                      name={name}
                      value={option.value}
                      checked={isSelected}
                      disabled={isDisabled}
                      onChange={(e) => {
                        onChange?.(option);
                        defaultOnChange(option.value);
                      }}
                      className="hidden"
                    />
                    {option.label}
                  </label>
                );
              })}
            </div>
          </div>
        )}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
};

export default RadioButton;
