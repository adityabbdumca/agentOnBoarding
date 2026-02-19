import { Asterisk } from "lucide-react";
import { useFormContext } from "react-hook-form";

function UiTextArea({
  containerClass,
  label,
  registerOptions,
  name,
  className,
  placeholder,
  disabled,
  error, // custom error if needed
}) {
  const formContext = useFormContext();

  const register = formContext?.register;
  const errors = formContext?.formState?.errors;

  let errorMessage = error || "";

  if (!errorMessage && name && errors) {
    if (name.includes(".")) {
      const path = name.split(".");
      let current = errors;
      for (const segment of path) {
        if (!current || !current[segment]) {
          current = undefined;
          break;
        }
        current = current[segment];
      }
      errorMessage = current?.message || "";
    } else {
      errorMessage = errors[name]?.message || "";
    }
  }

  return (
    <div className={`flex flex-col w-full ${containerClass}`}>
      {label && (
        <label className="text-xs flex items-center gap-1 text-left text-body font-semibold pl-1 mb-1">
          {label}
          {registerOptions?.required && (
            <Asterisk className="size-2 text-error -translate-y-1" />
          )}
        </label>
      )}

      <section className="w-full relative">
        <textarea
          placeholder={placeholder}
          disabled={disabled}
          maxLength={registerOptions?.maxLength?.value}
          {...(register && name ? register(name, registerOptions) : {})}
          autoComplete="off"
          className={`h-10 w-full text-sm 
              text-body font-semibold p-2 placeholder:font-medium placeholder:text-darkGray/80 outline-none 
               z-10 bg-white border border-extraLightGray rounded
              disabled:bg-gray-200 disabled:cursor-not-allowed  focus-within:border-primary/50  caret-primary
              ${className}`}
        />
      </section>

      {errorMessage && errorMessage !== "undefined" && (
        <p className="text-xs text-error/90 font-medium pl-1 ">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export default UiTextArea;
