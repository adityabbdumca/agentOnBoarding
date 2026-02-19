import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  allowOnlyName,
  allowOnlyNumbers,
  handleIFSCInput,
} from "@/HelperFunctions/helperFunctions";
import { Dropdown, FilePicker, Input } from "@/UI-Components";
import UiButton from "@/UI-Components/Buttons/UiButton";
import UiTextArea from "@/UI-Components/UiTextArea";
import {
  useGetData,
  useGetIFSCCode,
  useGetStateCity,
} from "@/modules/OnboardingDetails/service";
import useAllForm from "../../hooks/useAllForm";
import { bankServiceSchema } from "./BankDetailFormSchema";
import OTPModal from "../OTPModal/OTPModal";
import { shouldShowOTPModal } from "../../helper/FormHelper";

const BankDetailsForm = ({ allAgentData }) => {
  const [isOTPModalOpen, toggleIsOTPModalOpen] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const verticalId = parseInt(localStorage.getItem("vertical_id"));

  const isAgentJourney =
    allAgentData?.response_type === "single" ? true : false;

  const methods = useForm({
    defaultValues:{
      new_account_type:{label:"Savings",value:"Savings"}
    },
    resolver: yupResolver(bankServiceSchema()),
    mode:"onChange",
    reValidateMode:"onChange"
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
  const { data: ifscData, mutate: getIFSCCode } = useGetIFSCCode();

  useEffect(() => {
    const ifsc = watch("new_ifsc_code");
    if (ifsc?.length === 11) {
      getIFSCCode({ ifscCode: ifsc });
    }
  }, [watch("new_ifsc_code")]);

  useEffect(() => {
    const bankDetails = ifscData?.data?.bankDetails;

    if (bankDetails) {
      setValue("new_bank_name", bankDetails.bank_name || "");
      setValue("new_bank_city", bankDetails.bank_city || "");
      setValue("new_branch_name", bankDetails.bank_branch || "");

      // clear errors for these fields
      clearErrors([
        "new_bank_name",
        "new_bank_city",
        "new_branch_name",
        "new_ifsc_code",
      ]);
    }
  }, [ifscData?.data?.bankDetails]);
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
  const showOTPModal = shouldShowOTPModal(subRoute);
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
      });
    }
  }, [getSingleAgentService?.data?.data]);

  // -------- Submit handler --------
  const onSubmit = async (data) => {
    const payload = {
      agent_id: data?.agent_id?.id ?? isSingleAgentUserId,
      endorsement_type_id: subRoute,
      changes: {
        account_type: data?.new_account_type?.value ?? "Savings",
        name_as_in_bank_acount: data?.new_name_as_in_bank_acount,
        bank_account_number: data?.new_bank_account_number,
        re_enter_bank_account_number: data?.new_re_enter_bank_account_number,
        ifsc_code: data?.new_ifsc_code,
        bank_name: data?.new_bank_name,
        bank_city: data?.new_bank_city,
        branch_name: data?.new_branch_name,
      },
      document_type: data?.new_document_type?.value,
      document: data?.supporting_documents?.[0],
      is_otp_verified: isOTPVerified ? 1 : 0,
      comment: data?.new_comments,
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
        account_type: watch("new_account_type")?.value ?? "Savings",
        name_as_in_bank_acount: watch("new_name_as_in_bank_acount"),
        bank_account_number: watch("new_bank_account_number"),
        re_enter_bank_account_number: watch("new_re_enter_bank_account_number"),
        ifsc_code: watch("new_ifsc_code"),
        bank_name: watch("new_bank_name"),
        bank_city: watch("new_bank_city"),
        branch_name: watch("new_branch_name"),
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
          {/* Agent Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* Current Bank Details */}
          <div className="border-b border-lightGray pb-2">
            <h2 className="text-sm font-semibold text-gray-800">
              Current Bank Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              label="Current Account Type"
              name="current_account_type"
              inputRef={register("current_account_type")}
              placeholder="Account Type"
              disabled
              errors={errors}
            />
            <Input
              label="Name as in Bank Account"
              name="current_name_as_in_bank_acount"
              placeholder="Name as in Bank Account"
              inputRef={register("current_name_as_in_bank_acount")}
              disabled
              errors={errors}
            />
            <Input
              label="Bank Account Number"
              name="current_bank_account_number"
              placeholder="Bank Account Number"
              inputRef={register("current_bank_account_number")}
              disabled
              errors={errors}
            />
            <Input
              label="Re-Enter Bank Account Number"
              name="current_re_enter_bank_account_number"
              placeholder="Re-Enter Bank Account Number"
              inputRef={register("current_re_enter_bank_account_number")}
              disabled
              errors={errors}
            />
            <Input
              label="IFSC Code"
              name="current_ifsc_code"
              placeholder="IFSC Code"
              inputRef={register("current_ifsc_code")}
              disabled
              errors={errors}
              onChange={(e) => {
                const value = e.target.value;
                handleIFSCInput(e);
                if (!value || value.length < 11) {
                  setValue("current_bank_name", "");
                  setValue("current_bank_city", "");
                  setValue("current_branch_name", "");
                }
              }}
            />
            <Input
              label="Bank Name"
              placeholder="Bank Name"
              name="current_bank_name"
              inputRef={register("current_bank_name")}
              disabled
              errors={errors}
            />
            <Input
              label="Bank City"
              placeholder="Bank City"
              name="current_bank_city"
              inputRef={register("current_bank_city")}
              disabled
              errors={errors}
            />
            <Input
              label="Branch Name"
              placeholder="Branch Name"
              name="current_branch_name"
              inputRef={register("current_branch_name")}
              disabled
              errors={errors}
            />
          </div>

          {/* New Bank Details */}
          <div className="border-b border-lightGray pb-2 mt-6">
            <h2 className="text-sm font-semibold text-gray-800">
              New Bank Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Dropdown
              name="new_account_type"
              control={control}
              label="Account Type"
              isRequired
              options={[
                { label: "Savings", value: "Savings" },
                { label: "Current", value: "Current" },
              ]}
              errors={errors}
            />
            <Input
              label="Name as in Bank Account"
              name="new_name_as_in_bank_acount"
              placeholder="Enter Name as in Bank Account"
              inputRef={register("new_name_as_in_bank_acount")}
              onChange={allowOnlyName}
              isRequired
              errors={errors}
            />
            <Input
              label="Bank Account Number"
              name="new_bank_account_number"
              placeholder="Enter Bank Account Number"
              inputRef={register("new_bank_account_number")}
              onChange={(e) => (e.target.value = allowOnlyNumbers(e))}
              maxLength={20}
              isRequired
              errors={errors}
            />
            <Input
              label="Re-Enter Bank Account Number"
              name="new_re_enter_bank_account_number"
              placeholder="Re-Enter Bank Account Number"
              inputRef={register("new_re_enter_bank_account_number")}
              onChange={(e) => (e.target.value = allowOnlyNumbers(e))}
              maxLength={20}
              isRequired
              onPaste={(e) => e.preventDefault()}
              errors={errors}
            />
            <Input
              label="IFSC Code"
              name="new_ifsc_code"
              placeholder="Enter IFSC Code"
              inputRef={register("new_ifsc_code")}
              onChange={(e) => handleIFSCInput(e)}
              maxLength={11}
              isRequired
              errors={errors}
            />
            <Input
              label="Bank Name"
              name="new_bank_name"
              placeholder="Enter Bank Name"
              inputRef={register("new_bank_name")}
              readOnly
              isRequired
              errors={errors}
            />
            <Input
              label="Bank City"
              name="new_bank_city"
              placeholder="Enter Bank City"
              inputRef={register("new_bank_city")}
              readOnly
              isRequired
              errors={errors}
            />
            <Input
              label="Branch Name"
              name="new_branch_name"
              placeholder="Enter Branch Name"
              inputRef={register("new_branch_name")}
              readOnly
              isRequired
              errors={errors}
            />
          </div>

          {/* File Upload & Comments */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <Dropdown
              control={control}
              name="new_document_type"
              label="Document Type"
              isRequired
              options={[
                { label: "Bank Passbook", value: "Bank Passbook" },
                { label: "Bank Statement", value: "Bank Statement" },
                {
                  label: "Personalized Cancelled Cheque",
                  value: "Personalized Cancelled Cheque",
                },
              ]}
              errors={errors}
            />
            <div className="col-span-3">
              <FilePicker
                label="Supporting Documents"
                name="supporting_documents"
                control={control}
                watch={watch}
                setValue={setValue}
                tooltipText="Name and account details must match your bank account.  
                           Allowed file formats: PNG, JPEG, JPG, PDF (Max 10 MB)."
                clearErrors={clearErrors}
                errors={errors}
              />
            </div>
          </div>

          {/* {verticalId === 3 && (
            <section className="mt-2 flex justify-end">
              <UiButton
                text="Generate OTP"
                buttonType="primary"
                type="button"
                className="p-4"
                onClick={handleOtpGenerate}
                isLoading={postOtpGenerateMutation?.isPending}
              />
            </section>
          )} */}

          <UiTextArea
            placeholder="Enter additional comments or reason for change"
            name="new_comments"
            label="Comments"
            className="!bg-offWhite/50 min-h-36"
          />

          {/* Actions */}
          {!isOTPVerified ? (
            <section className="mt-2 flex justify-end">
              <UiButton
                text="Confirm Details"
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

export default BankDetailsForm;
