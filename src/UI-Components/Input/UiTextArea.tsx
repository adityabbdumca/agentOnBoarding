import { Asterisk } from "lucide-react";
import {
  FieldValues,
  RegisterOptions,
  useFormContext,
  UseFormRegister,
} from "react-hook-form";

interface ITextAreaProps {
  containerClass?: string;
  label?: string;
  registerOptions?: RegisterOptions<FieldValues, string>;
  name: string;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

function UiTextArea({
  containerClass,
  label,
  registerOptions,
  name,
  className,
  placeholder,
  disabled,
  error,
}: ITextAreaProps) {
  const {
    register,
    formState: { errors },
  }: { register: UseFormRegister<FieldValues>; formState: { errors: any } } =
    useFormContext();

  let errorMessage = error || "";

  if (!errorMessage && name) {
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
      errorMessage = String(errors[name]?.message || "");
    }
  }

  return (
    <div className={`flex flex-col w-full ${containerClass}`}>
      {label && (
        <label className="text-xs text-gray-700 mb-1 flex items-center gap-1 text-left text-body font-semibold pl-1">
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
          {...register(name, registerOptions)}
          autoComplete="off"
          className={`h-10 w-full text-xs  
              text-body font-semibold p-2 placeholder:font-medium placeholder:text-darkGray/80 outline-none 
               z-10 bg-white border border-lightGray rounded
              disabled:bg-gray-200 disabled:cursor-not-allowed  focus-within:border-primary/50  caret-primary
              ${className} `}
        />
      </section>
      {errorMessage !== "undefined" ? (
        <p className="text-xs text-error/90 font-medium pl-1 ">
          {errorMessage}
        </p>
      ) : (
        <></>
      )}
    </div>
  );
}

export default UiTextArea;
