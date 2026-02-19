import { Dropdown, Input } from "@/UI-Components";
import UiDateInput from "@/UI-Components/UiDateInput";
import { Controller, useFormContext } from "react-hook-form";
import { DateTime } from "luxon";
import { alphanumeric } from "@/HelperFunctions/helperFunctions";
import {
  useGeneralInsuranceCompanyList,
  useLifeInsuranceCompanyList,
} from "@/modules/OnboardingDetails/service";
import UiTooltip from "@/UI-Components/Tooltip/UiTooltip";
import UiButton from "@/UI-Components/Buttons/UiButton";
import { Trash2, User } from "lucide-react";
import { INSURER_TYPE_OPTIONS } from "../licenseDetailsForm.constant";
import { useEffect, useMemo, useState } from "react";

const LicenseEndorsementForm = ({
  licenseUnit,
  index,
  stage,
  totalLicense,
  handleStage,
  agentType,
}) => {
  const {
    control,
    register,
    watch,
    formState: { errors },
  } = useFormContext();
  const [option, setOption] = useState([]);
  const { data: listLifeInsuranceCompany } = useLifeInsuranceCompanyList();
  const { data: listGeneralInsuranceCompany } =
    useGeneralInsuranceCompanyList();
  const licenseValues = watch("license") || [];
  const currentInsurerType = watch(`license[${stage}].insurer_type`)?.value;
  const lifeInsuranceCompanyList = useMemo(() => {
    return (
      listLifeInsuranceCompany?.data?.return_data?.map((item) => ({
        label: item.label,
        value: item.value,
      })) || []
    );
  }, [listLifeInsuranceCompany]);

  const generalInsuranceCompanyList = useMemo(() => {
    return (
      listGeneralInsuranceCompany?.data?.return_data?.map((item) => ({
        label: item.label,
        value: item.value,
      })) || []
    );
  }, [listGeneralInsuranceCompany]);

  const getnameOfInsurerOption = () => {
    return currentInsurerType == "Life"
      ? lifeInsuranceCompanyList
      : currentInsurerType == "General"
        ? generalInsuranceCompanyList
        : [];
  };
  useEffect(() => {
    const insurerOptions = getnameOfInsurerOption();
    if (currentInsurerType && insurerOptions?.length > 0) {
      setOption(insurerOptions);
    }
  }, [
    currentInsurerType,
    listLifeInsuranceCompany,
    listGeneralInsuranceCompany,
  ]);

  return (
    <div
      key={licenseUnit.id || index}
      className="w-full border border-gray-300 rounded-lg p-4">
      {totalLicense > 1 && (
        <section className="w-full flex gap-3 justify-between">
          <UiButton
            buttonType="tertiary"
            text={agentType}
            className=" w-32 p-1 text-primary flex flex-row-reverse border border-lightGray"
            icon={<User className="size-5 text-primary inline-block" />}
          />

          <UiTooltip
            tooltipDelay={200}
            side="top"
            content="Delete License Details"
            className="border border-lightGray text-blue-600 p-2 bg-white">
            <UiButton
              buttonType="tertiary"
              onClick={() => {
                handleStage();
              }}
              className="h-7 w-9"
              icon={<Trash2 className="size-5 text-primary inline-block" />}
            />
          </UiTooltip>
        </section>
      )}

      <div className="grid grid-cols-3 gap-4 mt-3">
        <div className="flex-1">
          <Dropdown
            name={`license[${stage}].insurer_type`}
            control={control}
            errors={errors}
            isRequired
            label="License Type"
            placeholder="Select License Type"
            options={INSURER_TYPE_OPTIONS.filter(
              (opt) =>
                !licenseValues.some(
                  (row, idx) =>
                    idx !== stage && row?.insurer_type?.value === opt.value
                )
            )}
          />
        </div>
        <div className="flex-1">
          <Dropdown
            name={`license[${stage}].name_of_issurer`}
            control={control}
            errors={errors}
            isRequired
            label="Name of Insurer"
            placeholder="Select License Insurer"
            options={option}
          />
        </div>
        <div className="flex-1">
          <Input
            inputRef={register(`license[${stage}].agency_code`)}
            isRequired
            name={`license[${stage}].agency_code`}
            label="Agency Code"
            placeholder="Enter License Number"
            errors={errors}
            maxLength={20}
            onChange={alphanumeric}
          />
        </div>

        <div className="flex-1">
          <Controller
            control={control}
            name={`license[${stage}].date_of_agent_appointment`}
            render={({ field, fieldState }) => (
              <UiDateInput
                label="License Start"
                value={field.value}
                onChange={field.onChange}
                isRequired
                errors={fieldState?.error?.message}
                maxAllowedDate={DateTime.now().minus({ days: 1 })}
              />
            )}
          />
        </div>
        <div className="flex-1">
          <Controller
            control={control}
            name={`license[${stage}].date_of_agent_cessation`}
            render={({ field, fieldState }) => {
              const startDate = watch(
                `license[${stage}].date_of_agent_appointment`
              );
              const minDate =
                typeof startDate === "string" && startDate.trim() !== ""
                  ? DateTime.fromFormat(startDate, "dd-MM-yyyy").plus({
                      days: 1,
                    })
                  : undefined;
              return (
                <UiDateInput
                  label="License End"
                  value={field.value}
                  onChange={field.onChange}
                  minAllowedDate={minDate}
                  maxAllowedDate={DateTime.now()}
                  errors={fieldState?.error?.message}
                />
              );
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LicenseEndorsementForm;
