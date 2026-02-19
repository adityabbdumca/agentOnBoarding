import { genderOptions } from "@/constants/global.constant";
import { allowOnlyNumbers } from "@/HelperFunctions/helperFunctions";
import { Dropdown, Input } from "@/UI-Components";
import UiDateInput from "@/UI-Components/UiDateInput";
import { DateTime } from "luxon";
import { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { SALUTATION_OPTIONS } from "../commonDetails.constant";

const CurrentAndNewFieldSection = ({ validationType, fieldName }) => {
  const {
    watch,
    register,
    setValue,
    control,
    formState: { errors },
  } = useFormContext();
  const selectedGender = watch("new_gender")
  const salutationOptions = () => {
    const selectedGender = watch("new_gender")?.value
    return SALUTATION_OPTIONS[selectedGender] || [];
  };
  useEffect(() => {
    if (selectedGender) {
      setValue("new_salutation", null);
    }
  }, [selectedGender]);
 
  return (
    <>
      {validationType === "gender" && (
        <div className="grid grid-cols-2 gap-4 mt-4 ">
          <Input
            label={`Current ${fieldName}`}
            name="current_value"
            inputRef={register("current_value")}
            placeholder="Enter current value"
            isRequired
            errors={errors}
            disabled
          />
          <Input
            label="Current Salutation"
            placeholder={" Salutation"}
            name="current_salutation"
            inputRef={register("current_salutation")}
            errors={errors}
            disabled
            isRequired
          />

          <Dropdown
            control={control}
            options={genderOptions}
            name="new_gender"
            label="New Gender"
            placeholder="Select gender"
            isRequired
            errors={errors}
          />
          <Dropdown
            control={control}
            name="new_salutation"
            label="New Salutation"
            errors={errors}
            isRequired
            options={salutationOptions()}
          />
        </div>
      )}
      {validationType !== "gender" && (
        <div className="grid grid-cols-2 gap-4 mt-4 ">
          {/* Current fields */}

          {validationType !== "dob" ? (
            <Input
              label={`Current ${fieldName}`}
              name="current_value"
              inputRef={register("current_value")}
              placeholder="Enter current value"
              isRequired
              errors={errors}
              disabled
            />
          ) : (
            <Controller
              control={control}
              name="current_value"
              defaultValue=""
              rules={{ required: "Date of birth is required" }}
              render={({ field, fieldState }) => (
                <UiDateInput
                  label="Current DOB"
                  value={field.value}
                  onChange={field.onChange}
                  isRequired
                  maxAllowedDate={DateTime.now().minus({ years: 18 })}
                  errors={fieldState?.error?.message}
                  disabled
                />
              )}
            />
          )}

          {/* NewFields */}

          {validationType === "pan" && (
            <Input
              label={`New Pan Number`}
              name="new_pan_number"
              inputRef={register("new_pan_number")}
              placeholder="Enter new pan number"
              isRequired
              maxLength={10}
              errors={errors}
              onChange={(e) => {
                const formattedValue = e.target.value
                  .toUpperCase()
                  .replace(/[^A-Z0-9]/g, "");
                setValue("new_pan_number", formattedValue, {
                  shouldValidate: true,
                });
              }}
            />
          )}

          {validationType === "mobile" && (
            <Input
              label={`New Mobile Number`}
              name="new_mobile_number"
              inputRef={register("new_mobile_number")}
              placeholder="Enter new mobile number"
              isRequired
              maxLength={10}
              errors={errors}
              onChange={(e) => {
                allowOnlyNumbers(e);
                handleIndianPhoneInput(e);
              }}
            />
          )}
          {validationType === "bank" && (
            <Input
              label={`New Bank Account Number`}
              name="new_bank_account_number"
              inputRef={register("new_bank_account_number")}
              placeholder="Enter Bank Account Number"
              isRequired
              maxLength={20}
              errors={errors}
              onChange={(e) => {
                allowOnlyNumbers(e);
              }}
            />
          )}

          {validationType === "email" && (
            <Input
              label={`New Email`}
              name="new_email"
              inputRef={register("new_email")}
              placeholder="Enter Email"
              isRequired
              maxLength={50}
              errors={errors}
            />
          )}
          {validationType === "dob" && (
            <Controller
              control={control}
              name="new_dob"
              defaultValue=""
              rules={{ required: "Date of birth is required" }}
              render={({ field, fieldState }) => (
                <UiDateInput
                  label="New DOB"
                  value={field.value}
                  onChange={field.onChange}
                  isRequired
                  maxAllowedDate={DateTime.now().minus({ years: 18 })}
                  minAllowedDate={DateTime.now().minus({ years: 80 })}
                  errors={fieldState?.error?.message}
                />
              )}
            />
          )}
        </div>
      )}
    </>
  );
};

export default CurrentAndNewFieldSection;
