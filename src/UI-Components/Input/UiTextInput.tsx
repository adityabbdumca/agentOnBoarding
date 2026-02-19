import {
  FieldValues,
  RegisterOptions,
  UseFormRegister,
  useFormContext,
} from "react-hook-form";
import React, { useState } from "react";
import { Asterisk, EyeIcon, EyeOffIcon } from "lucide-react";
import UiButton from "../Buttons/UiButton";

type TTextInputProps = {
  containerClass?: string;
  label?: string;
  icon?: React.ReactNode;
  registerOptions?: RegisterOptions<FieldValues, string>;
  name: string;
  className?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  textHint?: string;
  textHintClassName?: string;
  min?: string;
  max?: string;
  autoComplete?: string;
  error?: string;
};

function UiTextInput({
  containerClass,
  label,
  icon,
  registerOptions,
  name,
  className,
  placeholder,
  disabled,
  textHint,
  type = "text",
  min,
  max,
  autoComplete = "off",
  textHintClassName,
  error, 
}: TTextInputProps) {
  const {
    register,
    formState: { errors },
  }: { register: UseFormRegister<FieldValues>; formState: { errors: any } } =
    useFormContext();
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  
  //from props directly
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
  const handlePasswordText = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className={`flex flex-col w-full ${containerClass}`}>
      {label && (
        <label className="text-xs flex items-center gap-1 text-left text-body font-semibold pl-1">
          {label}
          {registerOptions?.required && (
            <Asterisk className="size-2 text-error -translate-y-1" />
          )}
        </label>
      )}
      <section className="w-full relative">
        <input
          type={
            type === "password"
              ? !isPasswordVisible
                ? "password"
                : "text"
              : type
          }
          placeholder={placeholder}
          disabled={disabled}
          {...register(name, registerOptions)}
          autoComplete={autoComplete}
          data-iserror={errorMessage ? true : false}
          className={`inputGroup h-10 w-full text-sm 
              text-body font-semibold px-2 py-1 placeholder:font-medium placeholder:text-darkGray/80 outline-none rounded  
               z-10 border border-extraLightGray focus:border-primary/50 disabled:cursor-not-allowed disabled:opacity-70 disabled:bg-extraLightGray/30 
                ${className}`}
          min={min}
          max={max}
        />

        <span
          data-error={errorMessage ? true : false}
          className="text-gray data-[error=true]:text-error/60 absolute w-5 right-4 top-1/2 -translate-y-1/2"
        >
          {icon}
          {type === "password" && (
            <UiButton
              type="button"
              buttonType="tertiary"
              className="bg-transparent"
              icon={
                isPasswordVisible ? (
                  <EyeIcon className="size-4 text-gray" />
                ) : (
                  <EyeOffIcon className="size-4 text-gray" />
                )
              }
              onClick={handlePasswordText}
            />
          )}
        </span>
      </section>

      {errorMessage ? (
        <p className="text-xs text-error/90 font-medium pl-1 ">
          {errorMessage}
        </p>
      ) : (
        textHint && (
          <p
            className={`text-xs font-medium text-gray pl-1 w-full ${textHintClassName}`}
          >
            {textHint}
          </p>
        )
      )}
    </div>
  );
}

export default UiTextInput;
