import {
  allowOnlyNumbers,
  verifyValidPincode,
} from "@/HelperFunctions/helperFunctions";
import {
  useGetData,
  useGetStateCity,
} from "@/modules/OnboardingDetails/service";
import { Dropdown, FilePicker, Input } from "@/UI-Components";
import UiButton from "@/UI-Components/Buttons/UiButton";
import UiTextArea from "@/UI-Components/UiTextArea";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import useAllForm from "../../hooks/useAllForm";
import { addressServiceSchema } from "./AddressDetailFormValdtionSchema";
import { addressProofOptions } from "./utils";
import OTPModal from "../OTPModal/OTPModal";
import { shouldShowOTPModal } from "../../helper/FormHelper";

const AddressDetailsForm = ({ allAgentData }) => {
  const [isOTPModalOpen, toggleIsOTPModalOpen] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState();
  const verticalId = parseInt(localStorage.getItem("vertical_id"));
  const isAgentJourney =
    allAgentData?.response_type === "single" ? true : false;
  const validationType = allAgentData?.validation_type;
  const isCommunication = validationType === "communication";
  const methods = useForm({
    resolver: yupResolver(addressServiceSchema(validationType)),
    mode: "onChange",
  });
  const {
    control,
    register,
    watch,
    setValue,
    clearErrors,
    trigger,
    handleSubmit,
    formState: { errors },
  } = methods;
  const { data: userData } = useGetData();
  const isSingleAgentUserId = userData?.data?.profile?.user_id;
  const agentId = watch("agent_id");
  const getNewAllFieldValue = (watchedValues, validationType) => {
    const requiredFields = [
      `new_${validationType}_address_line_1`,
      `new_${validationType}_address_line_2`,
      `new_${validationType}_pincode`,
      `new_${validationType}_city`,
      `new_${validationType}_state`,
    ];

    return requiredFields.every((field) => {
      const value = watchedValues?.[field];
      return !!value; // check non-empty
    });
  };
  const {
    services: { getSingleAgentService },
    mutations: {
      postUserEndorsementAgentTypeMutation,
      postOtpGenerateMutation,
      postOtpVerifyMutation,
    },
    routing: { subRoute, navigate, navigateTo },
  } = useAllForm();

  const { data: stateCity, mutate: getStateCity } = useGetStateCity();

  useEffect(() => {
    const pincode = watch(`new_${validationType}_pincode`);
    if (pincode?.length === 6) {
      getStateCity({ pincode });
    }
  }, [watch(`new_${validationType}_pincode`)]);

  useEffect(() => {
    if (stateCity?.data?.status === 200) {
      setValue(`new_${validationType}_city`, stateCity?.data?.city_name);
      setValue(`new_${validationType}_state`, stateCity?.data?.state_name);
    }
  }, [stateCity?.data]);
  const showOTPModal = shouldShowOTPModal(subRoute);
  const onSubmit = async (data) => {
    const payload = {
      agent_id: data?.agent_id?.id ?? isSingleAgentUserId,
      endorsement_type_id: subRoute,
      changes: {
        [`${validationType}_address_line_1`]:
          data?.[`new_${validationType}_address_line_1`],
        [`${validationType}_address_line_2`]:
          data?.[`new_${validationType}_address_line_2`],
        [`${validationType}_pincode`]: data?.[`new_${validationType}_pincode`],
        [`${validationType}_city`]: data?.[`new_${validationType}_city`],
        [`${validationType}_state`]: data?.[`new_${validationType}_state`],
      },
      document_type: data?.document_type?.value,
      document: data?.supporting_documents[0],
      is_otp_verified: isOTPVerified ? 1 : 0,
      comment: data?.comments,
    };
    await postUserEndorsementAgentTypeMutation
      .mutateAsync(payload)
      .then((response) => {
        if (response?.status === 200 || response?.status === 201) {
          if (verticalId == 4) {
            navigateTo({ url: "/agent/servicing-module/status-tracking" });
            return;
          }
          navigateTo({ url: "/servicing-module/status-tracking" });
        }
      });
  };

  const handleOtpGenerate = async () => {
    const isFormValid = await trigger();
    if (!isFormValid) return;
    const watchedValues = watch(); // gives you all form values
    const fields = [
      "address_line_1",
      "address_line_2",
      "pincode",
      "city",
      "state",
    ];

    const payload = fields.reduce((acc, field) => {
      // Example: new_communication_address_line_1
      const newFieldKey = `new_${validationType}_${field}`;
      const targetKey = `${validationType}_${field}`;

      acc[targetKey] = watchedValues?.[newFieldKey] || "";
      return acc;
    }, {});
    const basePayload = {
      endorsement_type_id: subRoute,
      agent_id: agentId?.id ?? isSingleAgentUserId,
      changes: payload,
    };
    postOtpGenerateMutation.mutateAsync(basePayload).then((res) => {
      if (res.status === 200) toggleIsOTPModalOpen(true);
    });
  };

  const handleAgentSubmit = (data) => {
    if (!data?.id) return;

    getSingleAgentService.mutate({
      agentId: data?.id,
      endorsementTypeId: subRoute,
    });
  };

  useEffect(() => {
    if (isAgentJourney) {
      const { reportee_agents } = allAgentData;
      const singleAgentData = reportee_agents?.[0];
      if (!singleAgentData) return;

      setValue("agent_id", {
        application_number: singleAgentData?.application_number,
      });
      setValue("agent_name", singleAgentData?.agent_name || "");
      // setValue("comments",singleAgentData?.agent_name || "")
      if (singleAgentData?.current_value) {
        Object.entries(singleAgentData?.current_value)?.forEach(
          ([key, value]) => {
            const fieldName = `current_${key}`;
            setValue(fieldName, value || "");
          }
        );
      }
      return;
    }
    const apiData = getSingleAgentService?.data?.data;
    if (!apiData) return;

    const { reportee_agents } = apiData;
    const agentData = reportee_agents?.[0];
    if (!agentData) return;

    // Always set agent details
    setValue("agent_name", agentData?.agent_name || "");

    // Dynamically set "current" values based on validation_type
    if (agentData?.current_value) {
      Object.entries(agentData?.current_value)?.forEach(([key, value]) => {
        const fieldName = `current_${key}`;
        setValue(fieldName, value || "");
      });
    }
  }, [getSingleAgentService?.data?.data]);

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4">
            <div className="col-span-2">
              <Dropdown
                name="agent_id"
                errors={errors}
                isRequired
                label="Agent"
                Height={100}
                placeholder="Select Agent Id"
                control={control}
                labelKey="application_number"
                valueKey="application_number"
                isDisabled={isAgentJourney}
                options={allAgentData?.reportee_agents}
                onChange={(selectedOption) => {
                  handleAgentSubmit(selectedOption);
                }}
              />
            </div>

            <div className="col-span-2">
              <Input
                label="Agent Name"
                name="agent_name"
                inputRef={register("agent_name")}
                placeholder="Enter Name"
                Width="w-50%"
                isRequired
                errors={errors}
                disabled
              />
            </div>

            {/* --- Current Address Details --- */}
            <div className="col-span-full border-b border-lightGray pb-2">
              <h2 className="text-sm font-semibold text-gray-800">
                Current Address Details
              </h2>
            </div>

            <div className="col-span-2">
              <Input
                label="Address Line 1"
                inputRef={register(`current_${validationType}_address_line_1`)}
                name={`current_${validationType}_address_line_1`}
                placeholder="House No, Building Name"
                isRequired={isCommunication ? false : true}
                errors={errors}
                disabled
              />
            </div>

            <div className="col-span-2">
              <Input
                label="Address Line 2"
                inputRef={register(`current_${validationType}_address_line_2`)}
                name={`current_${validationType}_address_line_2`}
                placeholder="Street, Landmark, Area"
                isRequired={isCommunication ? false : true}
                errors={errors}
                disabled
              />
            </div>

            <div>
              <Input
                label="Pincode"
                inputRef={register(`current_${validationType}_pincode`)}
                name={`current_${validationType}_pincode`}
                placeholder="Enter Pincode"
                isRequired={isCommunication ? false : true}
                errors={errors}
                type="tel"
                disabled
              />
            </div>

            <div>
              <Input
                label="City"
                inputRef={register(`current_${validationType}_city`)}
                name={`current_${validationType}_city`}
                placeholder="Enter City"
                isRequired={isCommunication ? false : true}
                errors={errors}
                disabled
              />
            </div>

            <div>
              <Input
                label="State"
                inputRef={register(`current_${validationType}_state`)}
                name={`current_${validationType}_state`}
                placeholder="Enter State"
                isRequired={isCommunication ? false : true}
                errors={errors}
                disabled
              />
            </div>
          </div>

          {/* --- New Address Details --- */}
          <div
            className={`grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4 
             ${errors?.address_all_field?.type == "address-not-same" ? "border border-error px-2 py-4" : ""}`}>
            <div className="col-span-full border-b border-lightGray pb-2">
              <h2 className="text-sm font-semibold text-gray-800">
                New Address Details
              </h2>
            </div>

            <div className="col-span-2">
              <Input
                label="Address Line 1"
                inputRef={register(`new_${validationType}_address_line_1`)}
                name={`new_${validationType}_address_line_1`}
                placeholder="House No, Building Name"
                isRequired
                errors={errors}
                maxLength={100}
                onChange={(e) =>
                  (e.target.value = e.target.value.replace(
                    /[^A-Za-z0-9\s,.-/]|(\s{2,})/g,
                    ""
                  ))
                }
              />
            </div>

            <div className="col-span-2">
              <Input
                label="Address Line 2"
                inputRef={register(`new_${validationType}_address_line_2`)}
                name={`new_${validationType}_address_line_2`}
                placeholder="Street, Landmark, Area"
                isRequired
                errors={errors}
                maxLength={100}
                onChange={(e) =>
                  (e.target.value = e.target.value.replace(
                    /[^A-Za-z0-9\s,.-/]|(\s{2,})/g,
                    ""
                  ))
                }
              />
            </div>

            <Input
              label="Pincode"
              inputRef={register(`new_${validationType}_pincode`)}
              name={`new_${validationType}_pincode`}
              placeholder="Enter Pincode"
              isRequired
              errors={errors}
              type="tel"
              showErrorMessage={
                stateCity?.data?.status === 422
                  ? "Please enter valid pincode"
                  : ""
              }
              maxLength={6}
              onChange={(e) => {
                const value = e.target.value;
                allowOnlyNumbers(e);
                verifyValidPincode(e);

                if (!value || value.length < 6) {
                  setValue(`new_${validationType}_city`, "");
                  setValue(`new_${validationType}_state`, "");
                }
              }}
            />

            <Input
              label="City"
              inputRef={register(`new_${validationType}_city`)}
              name={`new_${validationType}_city`}
              placeholder="Enter City"
              isRequired
              errors={errors}
              readOnly
            />

            <Input
              label="State"
              inputRef={register(`new_${validationType}_state`)}
              name={`new_${validationType}_state`}
              placeholder="Enter State"
              isRequired
              errors={errors}
              readOnly
            />

            <Dropdown
              control={control}
              name={`new_${validationType}_document_type`}
              isRequired={true}
              errors={errors}
              options={addressProofOptions}
              label="Document Type"
            />
          </div>
          <div className="flex-1">
            <FilePicker
              label="Supporting Documents"
              name="supporting_documents"
              control={control}
              watch={watch}
              tooltipText="Accepted documents: Aadhaar Card, Passport, Voter ID (EPIC Card). Upload file (Max 10 MB) in .jpg, .jpeg, .png, or .pdf format"
              setValue={setValue}
              clearErrors={clearErrors}
              disable={!watch(`new_${validationType}_document_type`)}
              errors={errors}
              helperText="Please upload required documents (Max 10 MB). Allowed: .jpg, .jpeg, .png, .pdf"
              acceptedFiles={{
                "image/png": [".png"],
                "image/jpg": [".jpg"],
                "image/jpeg": [".jpeg"],
                "application/pdf": [".pdf"],
              }}
            />
          </div>
          {errors?.address_all_field?.message && (
            <div className="text-error text-xs mt-2">
              {errors?.address_all_field?.message}
            </div>
          )}
          {/* {verticalId == 3 && (
            <section className="mt-2">
              <UiButton
                text="Generate OTP"
                buttonType="primary"
                className="p-4  ml-auto"
                type="button"
                disabled={!getNewAllFieldValue(watch(), validationType)}
                onClick={() => {
                  handleOtpGenerate();
                }}
                isLoading={postOtpGenerateMutation?.isPending}
              />
            </section>
          )} */}
          {/* Comments */}
          <UiTextArea
            placeholder="Enter additional comments or reason for change"
            name={`comments`}
            className="!bg-offWhite/50 min-h-36"
            label="Comments"
          />

          {!isOTPVerified ? (
            <section className="mt-2 flex justify-end">
              <UiButton
                text="Generate OTP"
                buttonType="primary"
                type="button"
                className="w-32"
                onClick={handleOtpGenerate}
                isLoading={postOtpGenerateMutation?.isPending}
              />
            </section>
          ) : (
            <section className="flex justify-end gap-3 mt-6">
              <UiButton
                text="Submit"
                type="submit"
                buttonType="primary"
                className="px-6 py-3"
                isLoading={postUserEndorsementAgentTypeMutation?.isPending}
              />
              <UiButton
                text="Cancel"
                onClick={() => {
                  navigate(-1);
                }}
                buttonType="secondary"
                className="px-6 py-3"
              />
            </section>
          )}
        </form>
      </FormProvider>
      {isOTPModalOpen && (
        <OTPModal
          isOpen={isOTPModalOpen}
          handleClose={() => toggleIsOTPModalOpen(false)}
          postOtpVerifyMutation={postOtpVerifyMutation}
          handleOtpGenerate={handleOtpGenerate}
          agentId={verticalId === 4 ? { id: isSingleAgentUserId } : agentId}
          setIsOTPVerified={setIsOTPVerified}
        />
      )}
    </>
  );
};

export default AddressDetailsForm;
