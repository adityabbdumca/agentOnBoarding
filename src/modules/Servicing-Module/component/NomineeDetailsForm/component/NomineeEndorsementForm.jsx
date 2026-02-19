import {
  allowOnlyName,
  allowOnlyNumbers,
  handleIFSCInput,
  verifyValidNumbers,
  verifyValidPincode,
} from "@/HelperFunctions/helperFunctions";
import {
  useGetIFSCCode,
  useGetStateCity,
} from "@/modules/OnboardingDetails/service";
import { Dropdown, FilePicker } from "@/UI-Components";
import UiButton from "@/UI-Components/Buttons/UiButton";
import Input from "@/UI-Components/Input";
import UiTooltip from "@/UI-Components/Tooltip/UiTooltip";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import {
  genderNomineeRelations,
  genderOptions,
  nomineeRelationOptions,
  salutation,
} from "../nomineeDetailsForm.constant";

const NomineeEndorsementForm = ({
  nomineeUnit,
  index,
  stage,
  totalNominee,
  handleStage,
  isOTPVerified,
}) => {
  const {
    control,
    setValue,
    register,
    watch,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const martialStatus = watch("profile.marital_status");
  const { data: ifscCode, mutate: getIFSCCode } = useGetIFSCCode();
  const { nominee } = getValues();
  const pincode = nominee?.[stage]?.pincode;

  const { data: stateCity, mutate: getStateCity } = useGetStateCity();
  const handleSalutationOnChange = (e) => {
    switch (e?.value || "") {
      case "Mr.":
        setValue(`nominee[${stage}].gender`, { label: "Male", value: "Male" });
        return e.value || "";
      case "Mrs.":
        setValue(`nominee[${stage}].gender`, {
          label: "Female",
          value: "Female",
        });
        return e.value || "";
      case "Miss":
        setValue(`nominee[${stage}].gender`, {
          label: "Female",
          value: "Female",
        });
        return e.value || "";
    }
    return e?.value || "";
  };
  const getSelectedRelations = (currentIndex) => {
    const allNominees = getValues("nominee") || [];
    const selectedRelations = [];
    allNominees.forEach((nominee, index) => {
      if (index !== currentIndex && nominee?.relation_with_applicant?.value) {
        selectedRelations.push(nominee.relation_with_applicant.value);
      }
    });
    return selectedRelations;
  };
  // Function to get available relation options for current nominee
  const getAvailableRelationOptions = (currentIndex) => {
    const genderValue = watch(`nominee[${currentIndex}].gender`)?.value;
    let baseOptions = genderNomineeRelations[genderValue] || [];
    if (martialStatus?.value === "Single") {
      baseOptions = baseOptions.filter((opt) => opt.value !== "Spouse");
    }
    const selectedRelations = getSelectedRelations(currentIndex);
    return baseOptions.filter((option) => {
      const isRestrictedRelation = ["Father"].includes(option.value);
      return !(
        isRestrictedRelation && selectedRelations.includes(option.value)
      );
    });
  };
  const relationOptions = getAvailableRelationOptions(stage);

  useEffect(() => {
    if (pincode && String(pincode).length === 6) {
      getStateCity({ pincode });
    }
  }, [pincode, getStateCity]);

  useEffect(() => {
    if (stateCity?.data?.status === 200) {
      const currentCity = getValues(`nominee[${stage}].city`);
      const currentState = getValues(`nominee[${stage}].state`);

      if (currentCity !== stateCity?.data?.city_name) {
        setValue(`nominee[${stage}].city`, stateCity?.data?.city_name);
      }
      if (currentState !== stateCity?.data?.state_name) {
        setValue(`nominee[${stage}].state`, stateCity?.data?.state_name);
      }
    }
  }, [stateCity?.data, stage, setValue, getValues]);

  useEffect(() => {
    if (ifscCode?.data?.status === 200) {
      setValue(
        `nominee[${stage}].bank_name`,
        ifscCode?.data?.bankDetails?.bank_name
      );
      setValue(
        `nominee[${stage}].bank_city`,
        ifscCode?.data?.bankDetails?.bank_city
      );
      setValue(
        `nominee[${stage}].branch_name`,
        ifscCode?.data?.bankDetails?.bank_branch
      );
      clearErrors(`nominee[${stage}].bank_name`);
      clearErrors(`nominee[${stage}].bank_city`);
      clearErrors(`nominee[${stage}].branch_name`);
    }
  }, [ifscCode?.data]);
  return (
    <div
      key={nomineeUnit.id || index}
      className="w-full border border-gray-300 rounded-lg p-4"
    >
      {totalNominee > 1 && (
        <section className="w-full flex gap-3 justify-end">
          <UiTooltip
            tooltipDelay={200}
            side="top"
            content="Delete Nominee Details"
            className="border border-lightGray"
          >
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

      <div
        key={nomineeUnit?.key || index}
        className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 data-[id=true]:grid-cols-2"
      >
        <div>
          <Dropdown
            control={control}
            name={`nominee[${stage}].salutation`}
            label="Salutation"
            placeholder="Select Salutation"
            errors={errors}
            isRequired={true}
            options={salutation}
            isDisabled={isOTPVerified}
            onChange={(e) => {
              setValue(`nominee[${stage}].relation_with_applicant`, null);
              setValue(`nominee[${stage}].gender`, null);
              handleSalutationOnChange(e);
            }}
          />
        </div>

        <div>
          <Dropdown
            control={control}
            name={`nominee[${stage}].gender`}
            label="Gender"
            placeholder="Select Gender"
            errors={errors}
            isRequired={true}
            options={genderOptions}
            isDisabled={true || isOTPVerified}
          />
        </div>

        <div>
          <Dropdown
            control={control}
            name={`nominee[${stage}].relation_with_applicant`}
            label="Relation with Applicant"
            placeholder="Select Relation"
            errors={errors}
            isRequired={true}
            isDisabled={isOTPVerified}
            options={relationOptions}
          />
        </div>

        <div>
          <Input
            label="Nominee Name"
            inputRef={register(`nominee[${stage}].nominee_name`)}
            placeholder="Enter Nominee Name"
            errors={errors}
            isRequired={true}
            disabled={isOTPVerified}
            name={`nominee[${stage}].nominee_name`}
            onChange={(e) => allowOnlyName(e)}
          />
        </div>

        <div>
          <Input
            label="Contact Number"
            inputRef={register(`nominee[${stage}].contact_number`)}
            placeholder="Enter Contact Number"
            errors={errors}
            isRequired={true}
            name={`nominee[${stage}].contact_number`}
            maxLength={10}
            onChange={(e) => (e.target.value = verifyValidNumbers(e))}
            type="tel"
            disabled={isOTPVerified}
          />
        </div>

        <div>
          <Input
            label="Age"
            inputRef={register(`nominee[${stage}].age`)}
            placeholder="Enter Age"
            errors={errors}
            isRequired={true}
            name={`nominee[${stage}].age`}
            maxLength={3}
            onChange={(e) => (e.target.value = allowOnlyNumbers(e))}
            type="tel"
            disabled={isOTPVerified}
          />
        </div>

        <div>
          <Input
            label="Nominee Share %"
            inputRef={register(`nominee[${stage}].nominee_share`)}
            placeholder="Enter Nominee Share %"
            errors={errors}
            isRequired={true}
            name={`nominee[${stage}].nominee_share`}
            maxLength={3}
            onChange={(e) => (e.target.value = allowOnlyNumbers(e))}
            type="tel"
            disabled={isOTPVerified}
          />
        </div>

        <div>
          <Input
            label="Pin Code"
            inputRef={register(`nominee[${stage}].pincode`)}
            placeholder="Enter Pin Code"
            errors={errors}
            isRequired={true}
            name={`nominee[${stage}].pincode`}
            disabled={isOTPVerified}
            maxLength={6}
            onChange={(e) => {
              const value = e.target.value;
              e.target.value = verifyValidPincode(e);
              if (!value || value.length < 6) {
                setValue("profile.communicational_address", "");
                setValue("profile.communication_street", "");
              }
            }}
            type="tel"
          />
        </div>

        <div>
          <Input
            label="City"
            inputRef={register(`nominee[${stage}].city`)}
            placeholder="Enter City"
            errors={errors}
            isRequired={true}
            disabled
            name={`nominee[${stage}].city`}
          />
        </div>

        <div>
          <Input
            label="State"
            inputRef={register(`nominee[${stage}].state`)}
            placeholder="Enter State"
            errors={errors}
            isRequired={true}
            disabled
            name={`nominee[${stage}].state`}
          />
        </div>

        <div>
          <Input
            label="Address Line 1"
            inputRef={register(`nominee[${stage}].house_number`)}
            placeholder="Enter Address Line 1"
            errors={errors}
            isRequired={true}
            maxLength={100}
            name={`nominee[${stage}].house_number`}
            disabled={isOTPVerified}
          />
        </div>

        <div>
          <Dropdown
            name={`nominee[${stage}].account_type`}
            control={control}
            label="Account Type"
            isDisabled={isOTPVerified}
            placeholder="Select Account Type"
            errors={errors}
            options={[
              { label: "Savings", value: "Savings" },
              { label: "Current", value: "Current" },
            ]}
          />
        </div>

        <div>
          <Input
            label="Nominee Account Number"
            name={`nominee[${stage}].bank_account_number`}
            inputRef={register(`nominee[${stage}].bank_account_number`)}
            placeholder="Enter Nominee Account Number"
            disabled={isOTPVerified}
            maxLength={20}
            errors={errors}
            type="tel"
            onChange={(e) => (e.target.value = allowOnlyNumbers(e))}
          />
        </div>

        <div>
          <Input
            label="Re-Enter Nominee Account Number"
            inputRef={register(
              `nominee[${stage}].re_enter_bank_account_number`
            )}
            placeholder="Re-Enter Nominee Account Number"
            maxLength={20}
            errors={errors}
            disabled={isOTPVerified}
            onPaste={(e) => e.preventDefault()}
            name={`nominee[${stage}].re_enter_bank_account_number`}
            type="tel"
            onChange={(e) => (e.target.value = allowOnlyNumbers(e))}
          />
        </div>

        <div>
          <Input
            name={`nominee[${stage}].ifsc_code`}
            inputRef={register(`nominee[${stage}].ifsc_code`)}
            label="IFSC Code"
            placeholder="Enter IFSC Code"
            maxLength={11}
            disabled={isOTPVerified}
            onChange={(e) => {
              const value = e.target.value;
              handleIFSCInput(e);
              if (String(e.target.value).length === 11) {
                getIFSCCode({ ifscCode: e.target.value });
              }
              if (!value || value.length < 11) {
                setValue(`nominee[${stage}].bank_name`, "");
                setValue(`nominee[${stage}].bank_city`, "");
                setValue(`nominee[${stage}].branch_name`, "");
              }
            }}
          />
        </div>

        <div>
          <Input
            label="Bank Name"
            inputRef={register(`nominee[${stage}].bank_name`)}
            placeholder={"Enter Bank Name"}
            disabled
            name={`nominee[${stage}].bank_name`}
          />
        </div>

        <div>
          <Input
            label="Bank City"
            inputRef={register(`nominee[${stage}].bank_city`)}
            disabled
            placeholder={"Enter Bank City"}
            name={`nominee[${stage}].bank_city`}
          />
        </div>

        <div>
          <Input
            label="Branch Name"
            inputRef={register(`nominee[${stage}].branch_name`)}
            disabled
            placeholder={"Enter Branch Name"}
            name={`nominee[${stage}].branch_name`}
          />
        </div>

        {watch(`nominee[${stage}].age`) < 18 &&
          watch(`nominee[${stage}].age`) && (
            <>
              <div>
                <Input
                  label="Guardian Name"
                  inputRef={register(`nominee[${stage}].guardian_name`)}
                  placeholder="Enter Guardian Name"
                  errors={errors}
                  isRequired={true}
                  name={`nominee[${stage}].guardian_name`}
                />
              </div>
              <div>
                <Input
                  label="Guardian Contact Number"
                  inputRef={register(
                    `nominee[${stage}].guardian_contact_number`
                  )}
                  type="tel"
                  maxLength={10}
                  placeholder="Enter Guardian Contact Number"
                  errors={errors}
                  isRequired={true}
                  name={`nominee[${stage}].guardian_contact_number`}
                  onChange={(e) => (e.target.value = verifyValidNumbers(e))}
                />
              </div>
              <div>
                <Dropdown
                  name={`nominee[${stage}].relation_with_nominee`}
                  control={control}
                  label="Guardian Relation with Nominee"
                  placeholder="Select"
                  errors={errors}
                  isRequired={true}
                  options={nomineeRelationOptions}
                />
              </div>
            </>
          )}
      </div>
    </div>
  );
};

export default NomineeEndorsementForm;
