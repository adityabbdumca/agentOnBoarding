import BlackListConfirmationAgentModal from "@/Components/BlackListConfirmationAgentModal/BlackListConfirmationAgentModal";
import { Dropdown, FilePicker } from "@/UI-Components";
import UiButton from "@/UI-Components/Buttons/UiButton";
import Input from "@/UI-Components/Input";
import UiTextArea from "@/UI-Components/UiTextArea";
import useCheckBlacklistAgent from "@/hooks/useCheckBlacklistAgent";
import { useGetData } from "@/modules/OnboardingDetails/service";
import useAllForm from "@/modules/Servicing-Module/hooks/useAllForm";
import { registerFields } from "@/modules/Servicing-Module/servicingModule.constant";
import { yupResolver } from "@hookform/resolvers/yup";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import OTPModal from "../OTPModal/OTPModal";
import { commonDetailsFormSchema } from "./CommonDetailFormSchema";
import { dobDocOptions, genderDocOptions } from "./commonDetails.constant";
import CurrentAndNewFieldSection from "./component/CurrentAndNewFieldSection";
import { useParams } from "react-router";

const getNewFieldValue = (validationType, watch) => {
  switch (validationType) {
    case "pan":
      return watch("new_pan_number");
    case "mobile":
      return watch("new_mobile_number");
    case "email":
      return watch("new_email");
    case "bank":
      return watch("new_bank_account_number");
    case "gender":
      return {
        gender: watch("new_gender")?.value,
        salutation: watch("new_salutation")?.value,
      };
    case "dob":
      return watch("new_dob");
    default:
      return watch("new_value");
  }
};

const buildPayload = ({
  validationType,
  subRoute,
  agentId,
  watch,
  data,
  includeDocsAndComments = false,
  isOTPVerified,
}) => {
  const newValueFieldName = getNewFieldValue(validationType, watch);

  let changesPayload = {};
  switch (validationType) {
    case "pan":
      changesPayload.pan_no = newValueFieldName;
      break;
    case "mobile":
      changesPayload.mobile = newValueFieldName;
      break;
    case "bank":
      changesPayload.bank_account_number = newValueFieldName;
      break;
    case "email":
      changesPayload.email = newValueFieldName;
      break;
    case "gender":
      changesPayload.gender = newValueFieldName.gender;
      changesPayload.salutation = newValueFieldName.salutation;
      break;
    case "dob":
      changesPayload.dob = newValueFieldName;
      break;
    default:
      changesPayload[validationType] = newValueFieldName;
      break;
  }

  const basePayload = {
    endorsement_type_id: subRoute,
    agent_id: agentId?.id,
    changes: changesPayload,
  };
  if (includeDocsAndComments) {
    return {
      ...basePayload,
      is_otp_verified: isOTPVerified === true ? 1 : 0,
      ...(data?.document_type && { document_type: data?.document_type?.value }),
      ...(data?.supporting_documents?.length && {
        document: data.supporting_documents[0],
      }),
      comment: data?.comments,
    };
  }

  return basePayload;
};

const CommonDetailsForm = ({ allAgentData }) => {
  const {
    services: { getSingleAgentService },
    mutations: {
      postOtpGenerateMutation,
      postOtpVerifyMutation,
      postUserEndorsementAgentTypeMutation,
    },
    routing: { subRoute, navigate, navigateTo },
    states: {
      isOTPModalOpen,
      toggleIsOTPModalOpen,
      isOTPVerified,
      setIsOTPVerified,
    },
  } = useAllForm();

  const id = useParams().id;
  const isSingleAgentJourney =
    allAgentData?.response_type === "single" ? true : false;
  const validationType = allAgentData?.validation_type;
  const verticalId = +localStorage.getItem("vertical_id");
  const endorsementName = allAgentData?.endorsement_type_name;
  const fieldName = registerFields[endorsementName];

  const methods = useForm({
    resolver: yupResolver(commonDetailsFormSchema(validationType, fieldName)),
    defaultValues: {
      agent_id: null,
      agent_name: "",
      current_value: "",
      new_value: "",
      supporting_documents: [],
      comments: "",
    },
    mode: "all",
    reValidateMode: "onChange",
  });
  const {
    control,
    register,
    watch,
    setValue,
    clearErrors,
    setError,
    reset,
    resetField,
    trigger,
    handleSubmit,
    formState: { errors },
  } = methods;
  const selectedAgent = useWatch({ control, name: "agent_id" });
  const newPanNumber = useWatch({ control, name: "new_pan_number" });
  const { data: userData } = useGetData(+id);
  const [isPanConfirmationModal, setIsPanConfirmationModal] = useState(false);
  const {
    service: { getCheckBlackListAgentServices },
  } = useCheckBlacklistAgent({ panNumber: newPanNumber });
  const isSingleAgentUserId = userData?.data?.profile?.user_id;
  const agentId = watch("agent_id");

  const handleOtpGenerate = async () => {
    const isFormValid = await trigger();

    if (!isFormValid) return;
    let payload = buildPayload({
      validationType,
      subRoute,
      agentId,
      watch,
      includeDocsAndComments: false,
    });
    if (verticalId === 4) {
      payload = { ...payload, agent_id: isSingleAgentUserId };
    }

    postOtpGenerateMutation.mutateAsync(payload).then((res) => {
      if (res.status === 200) toggleIsOTPModalOpen(true);
    });
  };

  const isRequiredDocuments = ["pan"].includes(validationType);

  const handleAgentSubmit = (data) => {
    if (!data?.id) return;

    getSingleAgentService.mutate({
      agentId: data?.id,
      endorsementTypeId: subRoute,
    });
  };

  const onSubmit = async (data) => {
    let payload = buildPayload({
      validationType,
      subRoute,
      agentId,
      watch,
      data,
      includeDocsAndComments: true,
      isOTPVerified: true,
    });
  
    payload = {
      ...payload,
      ...(verticalId !== 4 && {
        agent_id: data?.agent_id?.id ?? isSingleAgentUserId,
      }),
      comment: data?.comments,
    };
    postUserEndorsementAgentTypeMutation
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
    return;
  };

  useEffect(() => {
    if (isSingleAgentJourney) {
      const singleAgentData = allAgentData?.reportee_agents?.[0];
      if (singleAgentData) {
        setValue("agent_id", {
          application_number: singleAgentData.application_number,
          id:singleAgentData?.id
        });
        setValue("agent_name", singleAgentData.agent_name || "");
        setValue(
          "current_value",
          validationType === "dob" && singleAgentData.current_value?.dob
            ? DateTime.fromISO(singleAgentData.current_value?.dob).toFormat(
                "dd-MM-yyyy"
              )
            : validationType === "gender"
              ? singleAgentData?.current_value?.gender
              : validationType === "pan"
                ? singleAgentData?.current_value?.pan_no
                : validationType === "email"
                  ? singleAgentData?.current_value?.email
                  : validationType === "mobile"
                    ? singleAgentData?.current_value?.mobile
                    : singleAgentData?.current_value
        );
        if (validationType == "gender") {
          setValue(
            "current_salutation",
            singleAgentData?.current_value?.salutaution ||
              singleAgentData?.current_value?.salutation
          );
        }
      }
      return;
    }
    if (!selectedAgent || !selectedAgent.application_number) {
      reset({
        agent_name: "",
        current_value: "",
        new_value: "",
        supporting_documents: [],
        comments: "",
      });
      return;
    }

    if (getSingleAgentService?.data?.data) {
      const matchedAgent =
        getSingleAgentService?.data?.data?.reportee_agents?.find(
          (agent) =>
            agent.application_number === selectedAgent.application_number
        );

      if (matchedAgent) {
        setValue("agent_name", matchedAgent.agent_name || "");
        setValue(
          "current_value",
          validationType === "dob" && matchedAgent.current_value?.dob
            ? DateTime.fromISO(matchedAgent.current_value?.dob).toFormat(
                "dd-MM-yyyy"
              )
            : validationType === "gender"
              ? matchedAgent?.current_value?.gender
              : validationType === "pan"
                ? matchedAgent?.current_value?.pan_no
                : validationType === "mobile"
                  ? matchedAgent?.current_value?.mobile
                  : validationType === "email"
                    ? matchedAgent?.current_value?.email
                    : matchedAgent?.current_value
        );
      }
      if (matchedAgent && validationType === "gender") {
        setValue(
          "current_salutation",
          matchedAgent?.current_value?.salutaution ||
            matchedAgent?.current_value?.salutation
        );
      }
    }
  }, [
    getSingleAgentService?.data?.data,
    isSingleAgentJourney,
    validationType,
    getSingleAgentService?.data?.data,
    reset,
    setValue,
  ]);
  // Check Enter PAN Number is BlackListed
  useEffect(() => {
    if (
      validationType === "pan" &&
      newPanNumber &&
      newPanNumber.length === 10
    ) {
      const isBlacklisted =
        getCheckBlackListAgentServices?.data?.data?.is_blacklisted;

      if (isBlacklisted) {
        resetField("new_pan_number", { defaultValue: "" });
        setIsPanConfirmationModal(true);
      }
    }
  }, [
    newPanNumber,
    validationType,
    getCheckBlackListAgentServices?.data?.data,
  ]);

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="flex gap-2 justify-between">
            <div className="grid grid-cols-2 gap-4 w-full">
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
                isDisabled={isSingleAgentJourney}
                options={allAgentData?.reportee_agents}
                onChange={(selectedOption) => {
                  if (!selectedOption) {
                    setValue("agent_id", null, { shouldValidate: false });
                    clearErrors("agent_id");
                    reset({
                      agent_name: "",
                      current_value: "",
                      new_value: "",
                      supporting_documents: [],
                      comments: "",
                    });
                  } else {
                    handleAgentSubmit(selectedOption);
                  }
                }}
              />

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
          </section>

          <CurrentAndNewFieldSection
            validationType={validationType}
            fieldName={fieldName}
          />
          {["dob", "gender"].includes(validationType) && (
            <div className="w-1/2 mt-4">
              <Dropdown
                control={control}
                name={`document_type`}
                isRequired={true}
                errors={errors}
                options={
                  validationType === "dob" ? dobDocOptions : genderDocOptions
                }
                label="Document Type"
              />
            </div>
          )}
          {!["mobile", "email", "nominee"].includes(validationType) && (
            <section className="mt-4 mb-8">
              <FilePicker
                label="Supporting Documents"
                name="supporting_documents"
                control={control}
                watch={watch}
                setValue={setValue}
                clearErrors={clearErrors}
                setError={setError}
                errors={errors}
                isRequired={isRequiredDocuments}
                tooltipText="Must match the details on your document. Allowed file formats: PNG, JPEG, JPG, PDF."
                helperText="Please upload required documents (Max 10 MB). Allowed: .jpg, .jpeg, .png, .pdf"
                acceptedFiles={{
                  "image/png": [".png"],
                  "image/jpg": [".jpg"],
                  "image/jpeg": [".jpeg"],
                  "application/pdf": [".pdf"],
                }}
              />
            </section>
          )}

          <div className="mt-4">
            <UiTextArea
              placeholder="Enter additional comments or reason for change"
              name="comments"
              className="!bg-offWhite/50 min-h-36"
              label="Comments"
            />
          </div>
          {!isOTPVerified ? (
            <section className="mt-2">
              <UiButton
                text="Generate OTP"
                buttonType="primary"
                className={`p-4 w-32 ml-auto`}
                type="button"
                onClick={() => {
                  handleOtpGenerate();
                }}
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
      {isPanConfirmationModal && (
        <BlackListConfirmationAgentModal
          open={isPanConfirmationModal}
          onClose={() => setIsPanConfirmationModal(false)}
          isLogOutAction={false}
        />
      )}
    </>
  );
};

export default CommonDetailsForm;
