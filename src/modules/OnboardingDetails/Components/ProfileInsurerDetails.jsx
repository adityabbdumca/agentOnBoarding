import { allowOnlyName, alphanumeric } from "@/HelperFunctions/helperFunctions";
import { Button } from "@/UI-Components";
import Dropdown from "@/UI-Components/Dropdown";
import Input from "@/UI-Components/Input";
import UiDateInput from "@/UI-Components/UiDateInput";
import { Plus, X } from "lucide-react";
import { DateTime } from "luxon";
import { Controller, useFieldArray } from "react-hook-form";
import { IoClose } from "react-icons/io5";
import {
  useGeneralInsuranceCompanyList,
  useGetExistingHealthInsuranceList,
  useLifeInsuranceCompanyList,
} from "../service";
import { useEffect, useRef } from "react";
import { Tooltip } from "@mui/material";
import UiButton from "@/UI-Components/Buttons/UiButton";

const ProfileInsurerDetails = ({
  register,
  errors,
  id,
  control,
  watch,
  isAgentTypeTransfer,
  setValue,
  userData,
}) => {
  const { data } = useGetExistingHealthInsuranceList(isAgentTypeTransfer);
  const didInit = useRef(false);
  const dob = watch("profile.dob");
  const minAllowedDate = dob
    ? DateTime.fromFormat(dob, "dd-MM-yyyy").plus({ years: 18 })
    : undefined;
  const verticalId = +localStorage.getItem("vertical_id");
  const Existing_Health_Insurance =
    data?.data?.return_data?.map((item) => ({
      label: item?.label,
      value: item?.value,
    })) || [];

  const availableOptions = [
    { label: "Life", value: "Life" },
    { label: "General", value: "General" },
  ];

  const { fields, append, remove } = useFieldArray({
    control,
    name: "profile.insurers",
  });

  const previousInsurerDetails = watch("profile.insurers");
  const agentType = watch("user_type");

  const selectedInsurerTypes =
    previousInsurerDetails?.map((insure) => insure?.insurer_type?.value) || [];

  const isAddDisabled = availableOptions.every((opt) =>
    selectedInsurerTypes.includes(opt.value)
  );

  const { data: listLifeInsuranceCompany } = useLifeInsuranceCompanyList();
  const { data: listGeneralInsuranceCompany } =
    useGeneralInsuranceCompanyList();
  const lifeInsuranceCompanyList =
    listLifeInsuranceCompany?.data?.return_data?.map((item) => ({
      label: item.label,
      value: item.value,
    }));
  const generalInsuranceCompanyList =
    listGeneralInsuranceCompany?.data?.return_data?.map((item) => ({
      label: item.label,
      value: item.value,
    }));

  return (
    <div
      data-id={!!id}
      className="group ring ring-gray-200 p-4 rounded-lg shadow-md overflow-visible"
    >
      <h2 className="col-span-4 text-lg font-semibold text-gray-600 border-b border-lightGray pb-2">
        Previous Insurer Details
      </h2>

      {isAgentTypeTransfer && (
        <div className="col-span-12 group my-4 mx-2 ring shadow-md ring-gray-200 rounded-lg p-4 flex flex-col gap-4 overflow-visible">
          <p className="text-sm font-semibold text-gray-600">Health Insurer</p>

          <div className="grid gap-4 md:grid-cols-2 relative overflow-visible">
            <div className="overflow-visible">
              <Dropdown
                control={control}
                name="profile.existing_health_insurance_name"
                label="Existing Health Insurer Name"
                isRequired
                errors={errors}
                options={Existing_Health_Insurance}
              />
            </div>

            <div className="overflow-visible">
              <Controller
                control={control}
                name="profile.existing_health_insurance_noc_date"
                defaultValue=""
                rules={{ required: "noc date is required" }}
                render={({ field, fieldState }) => {
                  const input = (
                    <UiDateInput
                      label="Existing Health Insurer NOC Date"
                      value={field.value}
                      onChange={field.onChange}
                      isRequired={true}
                      minAllowedDate={DateTime.fromFormat(
                        dob,
                        "dd-MM-yyyy"
                      ).plus({ years: 18 })}
                      maxAllowedDate={DateTime.now()}
                      errors={fieldState?.error?.message}
                      disabled={!dob}
                    />
                  );
                  return !dob ? (
                    <Tooltip
                      arrow
                      title="Please enter DOB first to enable NOC date"
                    >
                      <span>{input}</span>
                    </Tooltip>
                  ) : (
                    input
                  );
                }}
              />
            </div>

            <div className="overflow-visible">
              <Input
                inputRef={register("profile.reason_for_transfer")}
                name="profile.reason_for_transfer"
                label="Reason for Transfer"
                maxLength={100}
                placeholder="Enter Reason for Transfer"
                isRequired
                errors={errors}
                onChange={allowOnlyName}
              />
            </div>
          </div>
        </div>
      )}

      <div
        data-id={!!id}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 data-[id=true]:grid-cols-2 mt-4 overflow-visible"
      >
        <div className="col-span-full overflow-visible">
          {fields?.map((item, index) => {
            const currentInsurer = watch(
              `profile.insurers[${index}].insurer_type`
            );

            const insurerOptions = availableOptions.filter(
              (each) =>
                each.value === currentInsurer?.value ||
                !previousInsurerDetails?.some(
                  (insure, i) =>
                    i !== index && insure?.insurer_type?.value === each.value
                )
            );

            return (
              <div
                key={`${item.insurers}-${item.id}`}
                className="col-span-full group p-2 overflow-visible"
              >
                <div className="grid gap-4 md:grid-cols-2 p-4 ring shadow-md ring-gray-200 rounded-lg relative overflow-visible">
                  <div className="col-span-1"></div>
                  <div className="flex items-end justify-end w-full">
                    <UiButton
                      icon={<X className="size-4 text-primary" />}
                      buttonType="tertiary"
                      className="px-2"
                      disabled={
                        agentType === "composite" && fields.length === 1
                      }
                      onClick={() => {
                        remove(index);
                      }}
                    />
                  </div>

                  <div className="overflow-visible">
                    <Dropdown
                      control={control}
                      options={insurerOptions}
                      name={`profile.insurers[${index}].insurer_type`}
                      isRequired
                      label="Insurer Type"
                      errors={errors}
                      onChange={() => {
                        setValue(
                          `profile.insurers[${index}].name_of_issurer`,
                          ""
                        );
                      }}
                    />
                  </div>

                  <div className="overflow-visible">
                    <Dropdown
                      control={control}
                      options={
                        currentInsurer?.value === "Life"
                          ? lifeInsuranceCompanyList
                          : generalInsuranceCompanyList
                      }
                      name={`profile.insurers[${index}].name_of_issurer`}
                      isRequired
                      label="Name of Insurer"
                      errors={errors}
                    />
                  </div>

                  <div className="overflow-visible">
                    <Input
                      inputRef={register(
                        `profile.insurers[${index}].agency_code`
                      )}
                      name={`profile.insurers[${index}].agency_code`}
                      placeholder="Enter Agency Code"
                      isRequired
                      label="Agency Code"
                      errors={errors}
                      onChange={alphanumeric}
                      maxLength={100}
                      showErrorMessage={
                        errors?.profile?.insurers?.[index]?.agency_code?.message
                      }
                    />
                  </div>

                  <div className="overflow-visible">
                    <Controller
                      control={control}
                      name={`profile.insurers[${index}].date_of_agent_appointment`}
                      render={({ field, fieldState }) => (
                        <UiDateInput
                          label="Date of Appointment of Agent"
                          value={field.value}
                          onChange={(val) => {
                            field.onChange(val);
                            setValue(
                              `profile.insurers[${index}].date_of_agent_cessation`,
                              undefined
                            );
                          }}
                          isRequired={true}
                          errors={fieldState?.error?.message}
                          maxAllowedDate={DateTime.now().minus({ days: 1 })}
                          minAllowedDate={minAllowedDate}
                        />
                      )}
                    />
                  </div>

                  <div className="overflow-visible">
                    <Controller
                      control={control}
                      name={`profile.insurers[${index}].date_of_agent_cessation`}
                      render={({ field }) => {
                        const appointmentDateStr = watch(
                          `profile.insurers[${index}].date_of_agent_appointment`
                        );

                        // calculate min date as appointmentDate + 1
                        const minDate =
                          typeof appointmentDateStr === "string" &&
                          appointmentDateStr.trim() !== ""
                            ? DateTime.fromFormat(
                                appointmentDateStr,
                                "dd-MM-yyyy"
                              ).plus({ days: 1 })
                            : undefined;

                        return (
                          <UiDateInput
                            disabled={!appointmentDateStr}
                            label="Date of Relieving of Agent"
                            value={field.value}
                            onChange={field.onChange}
                            minAllowedDate={minDate}
                            maxAllowedDate={DateTime.now()}
                          />
                        );
                      }}
                    />
                  </div>

                  <div className="overflow-visible">
                    <Input
                      inputRef={register(
                        `profile.insurers[${index}].reason_of_cessation`
                      )}
                      name={`profile.insurers[${index}].reason_of_cessation`}
                      label="Reason of Relieving"
                      maxLength={100}
                      placeholder="Enter Reason of Relieving"
                      onChange={allowOnlyName}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {![1, 2].includes(verticalId) && (
        <div className="flex items-center p-5 gap-2">
          <Button
            className="flex items-center gap-2 mt-8"
            size="sm"
            type="button"
            disabled={isAddDisabled || fields.length >= availableOptions.length}
            onClick={(e) => {
              e.preventDefault();
              append({
                insurer_type: "",
                name_of_issurer: "",
                agency_code: "",
                date_of_agent_appointment: "",
                date_of_agent_cessation: "",
                reason_of_cessation: "",
              });
            }}
          >
            <Plus className="h-4 w-4" />
            Add More
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileInsurerDetails;
