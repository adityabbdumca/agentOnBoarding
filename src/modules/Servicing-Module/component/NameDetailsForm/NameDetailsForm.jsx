import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  allowOnlyLastName,
  allowOnlyName,
} from "@/HelperFunctions/helperFunctions";
import { Dropdown, FilePicker, Input } from "@/UI-Components";
import UiButton from "@/UI-Components/Buttons/UiButton";
import UiTextArea from "@/UI-Components/UiTextArea";
import useAllForm from "../../hooks/useAllForm";
import { nameDetailsSchema } from "./NameDetailsFormSchema";
import OTPModal from "../OTPModal/OTPModal";
import { useGetData } from "@/modules/OnboardingDetails/service";

const NameDetailsForm = ({ allAgentData }) => {
  const [isOTPModalOpen, toggleIsOTPModalOpen] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const verticalId = parseInt(localStorage.getItem("vertical_id"));

  const isAgentJourney =
    allAgentData?.response_type === "single" ? true : false;

  const methods = useForm({
    resolver: yupResolver(nameDetailsSchema()),
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
  const {
    services: { getSingleAgentService },
    mutations: {
      postUserEndorsementAgentTypeMutation,
      postOtpGenerateMutation,
      postOtpVerifyMutation,
    },
    routing: { subRoute, navigate, navigateTo },
  } = useAllForm();
  const { data: userData } = useGetData();
  const isSingleAgentUserId = userData?.data?.profile?.user_id;
  const agentId = watch("agent_id");

  // -------- Prefill current values --------
  useEffect(() => {
    if (isAgentJourney) {
      const singleAgent = allAgentData?.reportee_agents?.[0];
      if (!singleAgent) return;

      setValue("agent_id", {
        application_number: singleAgent?.application_number,
      });
      setValue("agent_name", singleAgent?.agent_name || "");

      if (singleAgent?.current_value) {
        Object.entries(singleAgent?.current_value)?.forEach(([key, value]) => {
          setValue(`current_${key}`, value || "");
          if (key == "salutation") {
            setValue(`new_${key}`, value || "");
          }
        });
      }
      return;
    }

    const apiData = getSingleAgentService?.data?.data;
    if (!apiData) return;

    const agentData = apiData?.reportee_agents?.[0];
    if (!agentData) return;

    setValue("agent_name", agentData?.agent_name || "");
    if (agentData?.current_value) {
      Object.entries(agentData?.current_value)?.forEach(([key, value]) => {
        setValue(`current_${key}`, value || "");
        if (key == "salutation") {
          setValue(`new_${key}`, value || "");
        }
      });
    }
  }, [getSingleAgentService?.data?.data]);

  // -------- Submit handler --------
  const onSubmit = async (data) => {
    const payload = {
      agent_id: data?.agent_id?.id ?? isSingleAgentUserId,
      endorsement_type_id: subRoute,
      changes: {
        // salutation: data?.new_salutation?.value,
        first_name: data?.new_first_name,
        middle_name: data?.new_middle_name,
        last_name: data?.new_last_name,
      },
      document_type: data?.new_document_type?.value,
      document: data?.supporting_documents?.[0],
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

  // -------- OTP Generate --------
  const handleOtpGenerate = async () => {
    const isFormValid = await trigger();
    if (!isFormValid) return;

    const basePayload = {
      endorsement_type_id: subRoute,
      agent_id: agentId?.id ?? isSingleAgentUserId,
      changes: {
        // salutation: watch("new_salutation")?.value,
        first_name: watch("new_first_name"),
        middle_name: watch("new_middle_name"),
        last_name: watch("new_last_name"),
      },
    };

    postOtpGenerateMutation.mutateAsync(basePayload).then((res) => {
      if (res.status === 200) toggleIsOTPModalOpen(true);
    });
  };

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Agent Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="col-span-2">
              <Dropdown
                name="agent_id"
                control={control}
                errors={errors}
                isRequired
                label="Agent"
                Height={100}
                placeholder="Select Agent Id"
                labelKey="application_number"
                valueKey="application_number"
                isDisabled={isAgentJourney}
                options={allAgentData?.reportee_agents}
                onChange={(opt) => {
                  if (opt?.id) {
                    getSingleAgentService.mutate({
                      agentId: opt.id,
                      endorsementTypeId: subRoute,
                    });
                  }
                }}
              />
            </div>

            <div className="col-span-2">
              <Input
                label="Agent Name"
                name="agent_name"
                inputRef={register("agent_name")}
                placeholder="Enter Name"
                isRequired
                errors={errors}
                disabled
              />
            </div>
          </div>

          {/* Current Details */}
          <div className="border-b border-lightGray pb-2">
            <h2 className="text-sm font-semibold text-gray-800">
              Current Name Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* <Input
              label="Salutation"
              placeholder={" Salutation"}
              name="current_salutation"
              inputRef={register("current_salutation")}
              disabled
              isRequired
            /> */}
            <Input
              label="First Name"
              name="current_first_name"
              placeholder={" First Name"}
              inputRef={register("current_first_name")}
              disabled
              isRequired
            />
            <Input
              label="Middle Name"
              name="current_middle_name"
              placeholder={" Middle Name"}
              inputRef={register("current_middle_name")}
              disabled
            />
            <Input
              label="Last Name"
              name="current_last_name"
              placeholder={" Last Name"}
              inputRef={register("current_last_name")}
              disabled
              isRequired
            />
          </div>

          {/* New Details */}
          <div className="border-b border-lightGray pb-2">
            <h2 className="text-sm font-semibold text-gray-800">
              New Name Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* <Dropdown
              control={control}
              name="new_salutation"
              label="Salutation"
              errors={errors}
              isRequired
              options={[
                {
                  label: "Mr.",
                  value: "Mr.",
                },
                {
                  label: "Mrs.",
                  value: "Mrs.",
                },
                {
                  label: "Miss",
                  value: "Miss",
                },
              ]}
            /> */}

            <Input
              label="First Name"
              name="new_first_name"
              placeholder={"Enter First Name"}
              inputRef={register("new_first_name")}
              onChange={(e) => (e.target.value = allowOnlyName(e))}
              isRequired
              errors={errors}
            />
            <Input
              label="Middle Name"
              name="new_middle_name"
              placeholder={"Enter Middle Name"}
              inputRef={register("new_middle_name")}
              onChange={(e) => (e.target.value = allowOnlyName(e))}
            />
            <Input
              label="Last Name"
              placeholder={"Enter Last Name"}
              name="new_last_name"
              inputRef={register("new_last_name")}
              onChange={(e) => (e.target.value = allowOnlyLastName(e))}
              isRequired
              errors={errors}
            />
            <Dropdown
              control={control}
              name="new_document_type"
              label="Document Type"
              errors={errors}
              isRequired
              options={[
                { label: "Aadhaar Card", value: "Aadhaar Card" },
                { label: "PAN Card", value: "PAN Card" },
                { label: "Driving License", value: "Driving License" },
                { label: "Passport", value: "Passport" },
                { label: "Gazette Copy", value: "Gazette Copy" },
                { label: "Voter ID", value: "Voter ID" },
              ]}
            />
          </div>

          <FilePicker
            label="Supporting Documents"
            name="supporting_documents"
            control={control}
            watch={watch}
            setValue={setValue}
            clearErrors={clearErrors}
            errors={errors}
            tooltipText="Name must match document like Aadhaar or PAN details. Format: PNG/JPEG/JPG/PDF"
          />

          <UiTextArea
            name="comments"
            label="Comments"
            placeholder="Enter additional comments or reason for change"
            className="!bg-offWhite/50 min-h-36"
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

export default NameDetailsForm;
