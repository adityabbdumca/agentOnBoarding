import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import Button from "@/UI-Components/Button";
import UiButton from "@/UI-Components/Buttons/UiButton";
import Dropdown from "@/UI-Components/Dropdown";
import Input from "@/UI-Components/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { Triangle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { HiOutlinePlus } from "react-icons/hi";
import useAllForm from "../../hooks/useAllForm";
import OTPModal from "../OTPModal/OTPModal";
import NomineeCard from "./component/NomineeCard";
import NomineeEndorsementForm from "./component/NomineeEndorsementForm";
import { empty_nominee } from "./nomineeDetailsForm.constant";
import { endorsementNomineeSchema } from "./NomineeDetailsFormSchema";
import ActionConfirmationModal from "@/UI-Components/Modals/ActionConfirmModal";
import { FilePicker } from "@/UI-Components";
import { useGetData } from "@/modules/OnboardingDetails/service";
import UiTextArea from "@/UI-Components/UiTextArea";

const NomineeDetailsForm = ({ allAgentData }) => {
  const [isOTPModalOpen, toggleIsOTPModalOpen] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [stage, setStage] = useState(0);
  const verticalId = parseInt(localStorage.getItem("vertical_id"));
  const { navigate } = useGlobalRoutesHandler();

  const {
    services: { getSingleAgentService },
    mutations: {
      postUserEndorsementAgentTypeMutation,
      postOtpGenerateMutation,
      postOtpVerifyMutation,
    },
    routing: { subRoute, navigateTo },
  } = useAllForm();
  const methods = useForm({
    defaultValues: {
      nominee: [empty_nominee],
    },
    resolver: yupResolver(endorsementNomineeSchema),
    context: allAgentData,
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const {
    control,
    register,
    watch,
    reset,
    handleSubmit,
    setValue,
    trigger,
    clearErrors,
    formState: { errors },
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "nominee",
    keyName: "key",
  });
  const nomineeValues = useWatch({
    control,
    name: "nominee",
  });
  const isSelectedSingleAgentData =
    allAgentData?.response_type === "single" ? true : false;

  const handleAgentSubmit = (data) => {
    if (!data?.id) return;

    getSingleAgentService.mutate({
      agentId: data?.id,
      endorsementTypeId: subRoute,
    });
  };
  const totalShare = Array.isArray(nomineeValues)
    ? nomineeValues.reduce((sum, item) => {
        const share = parseFloat(item?.nominee_share) || 0;
        return sum + share;
      }, 0)
    : 0;
  const canAddNominee = totalShare < 100 && fields.length < 10;
  const { data: userData } = useGetData();
  const isSingleAgentUserId = userData?.data?.profile?.user_id;
  const agentId = watch("agent_id");
  const getNomineeDetails =
    getSingleAgentService?.data?.data?.reportee_agents?.[0]?.current_value ||
    allAgentData?.reportee_agents?.[0]?.current_value;

  useEffect(() => {
    if (isSelectedSingleAgentData) {
      const singleAgent = allAgentData?.reportee_agents?.[0];
      if (!singleAgent) return;

      setValue("agent_id", {
        application_number: singleAgent?.application_number,
      });
      setValue("agent_name", singleAgent?.agent_name || "");

      if (singleAgent?.current_value.length > 0) {
        reset((prev) => ({
          ...prev,
          nominee: singleAgent?.current_value?.map((user) => ({
            id: user?.id ?? null,
            account_type: user?.account_type || null,
            relation_with_applicant: user?.relation_with_applicant
              ? {
                  label: user?.relation_with_applicant,
                  value: user?.relation_with_applicant,
                }
              : null,
            salutation: user?.salutation
              ? { value: user?.salutation, label: user?.salutation }
              : null,
            nominee_name: user?.nominee_name || "",
            nominee_share: user?.nominee_share || "",
            gender: user?.gender
              ? { label: user?.gender, value: user?.gender }
              : null,
            age: user?.age || "",
            city: user?.city || "",
            state: user?.state || "",
            pincode: user?.pincode || "",
            district: user?.district || "",
            house_number: user?.house_number || "",
            street: user?.street || "",
            land_mark: user?.land_mark || "",
            contact_number: user?.contact_number || "",
            bank_account_number: user?.bank_account_number || "",
            re_enter_bank_account_number:
              user?.re_enter_bank_account_number || "",
            ifsc_code: user?.ifsc_code || "",
            bank_name: user?.bank_name || "",
            bank_city: user?.bank_city || "",
            branch_name: user?.branch_name || "",
            relation_with_nominee: user?.relation_with_nominee || "",
            guardian_name: user?.guardian_name || "",
            guardian_contact_number: user?.guardian_contact_number || "",
            nominee_check: user?.nominee_check || false,
          })),
        }));
      }
      return;
    }
    if (getSingleAgentService?.data?.data) {
      const agentName =
        getSingleAgentService?.data?.data?.reportee_agents?.[0]?.agent_name;

      if (getNomineeDetails?.length > 0) {
        reset((prev) => ({
          ...prev,
          id: getNomineeDetails?.id,
          agent_name: agentName,
          nominee: getNomineeDetails.map((user) => ({
            id: user?.id ?? null,
            account_type: user?.account_type || null,
            relation_with_applicant: user?.relation_with_applicant
              ? {
                  label: user?.relation_with_applicant,
                  value: user?.relation_with_applicant,
                }
              : null,
            salutation: user?.salutation
              ? { value: user?.salutation, label: user?.salutation }
              : null,
            nominee_name: user?.nominee_name || "",
            nominee_share: user?.nominee_share || "",
            gender: user?.gender
              ? { label: user?.gender, value: user?.gender }
              : null,
            age: user?.age || "",
            city: user?.city || "",
            state: user?.state || "",
            pincode: user?.pincode || "",
            district: user?.district || "",
            house_number: user?.house_number || "",
            street: user?.street || "",
            land_mark: user?.land_mark || "",
            contact_number: user?.contact_number || "",
            bank_account_number: user?.bank_account_number || "",
            re_enter_bank_account_number:
              user?.re_enter_bank_account_number || "",
            ifsc_code: user?.ifsc_code || "",
            bank_name: user?.bank_name || "",
            bank_city: user?.bank_city || "",
            branch_name: user?.branch_name || "",
            relation_with_nominee: user?.relation_with_nominee || "",
            guardian_name: user?.guardian_name || "",
            guardian_contact_number: user?.guardian_contact_number || "",
            nominee_check: user?.nominee_check || false,
          })),
        }));
      } else {
        reset((prev) => ({
          ...prev,
          agent_name: agentName,
          nominee: [empty_nominee],
        }));
      }
    }
  }, [
    getSingleAgentService?.data?.data,
    isSelectedSingleAgentData,
    allAgentData,
  ]);

  const onSubmit = async (data) => {
    const isFormValid = await trigger();
    // User Jump to Error Page if Not fill mandatory field
    if (!isFormValid) {
      const nomineeErrors = methods.formState.errors?.nominee || [];
      const firstErrorIndex = nomineeErrors.findIndex((n) => n !== undefined);
      if (firstErrorIndex !== -1) {
        setStage(firstErrorIndex);
      }
      return;
    }

    const payload = {
      agent_id: data?.agent_id?.id ?? isSingleAgentUserId,
      endorsement_type_id: subRoute,
      document: data?.document[0],
      comments: data?.comments,
      changes: data?.nominee?.map((nom) => ({
        id: nom?.id ?? null,
        salutation: nom?.salutation?.value,
        gender: nom?.gender?.value,
        relation_with_applicant: nom?.relation_with_applicant?.value,
        nominee_name: nom?.nominee_name,
        contact_number: nom?.contact_number,
        age: nom?.age,
        nominee_share: nom?.nominee_share,
        pincode: nom?.pincode,
        city: nom?.city,
        state: nom?.state,
        house_number: nom?.house_number || "",
        account_type: nom?.account_type?.value || null,
        bank_account_number: nom?.bank_account_number
          ? nom?.bank_account_number
          : null,
        re_enter_bank_account_number: nom?.re_enter_bank_account_number
          ? nom?.re_enter_bank_account_number
          : null,
        ifsc_code: nom?.ifsc_code || "",
        bank_name: nom?.bank_name || "",
        bank_city: nom?.bank_city || "",
        branch_name: nom?.branch_name || "",
        guardian_name: nom?.guardian_name || "",
        guardian_contact_number: nom?.guardian_contact_number || "",
        relation_with_nominee: nom?.relation_with_nominee?.value || "",
      })),
      is_otp_verified: isOTPVerified ? 1 : 0,
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
  };
  // -------- OTP Generate --------
  const handleOtpGenerate = async () => {
    const isFormValid = await trigger();

    if (!isFormValid) {
      const nomineeErrors = methods.formState.errors?.nominee || [];
      const firstErrorIndex = nomineeErrors.findIndex((n) => n !== undefined);
      if (firstErrorIndex !== -1) {
        setStage(firstErrorIndex); // jump user to the error nominee
      }
      return;
    }

    const nomineeValues = methods.getValues("nominee");

    const basePayload = {
      endorsement_type_id: subRoute,
      agent_id: agentId?.id ?? isSingleAgentUserId,
      document: methods?.getValues("document")?.[0],
      comments: methods?.getValues("comments"),
      changes: nomineeValues.map((nom) => ({
        id: nom?.id ?? null,
        salutation: nom?.salutation?.value,
        gender: nom?.gender?.value,
        relation_with_applicant: nom?.relation_with_applicant?.value,
        nominee_name: nom?.nominee_name,
        contact_number: nom?.contact_number,
        age: nom?.age,
        nominee_share: nom?.nominee_share,
        pincode: nom?.pincode,
        city: nom?.city,
        state: nom?.state,
        house_number: nom?.house_number,
        account_type: nom?.account_type?.value ?? null,
        bank_account_number: nom?.bank_account_number
          ? nom?.bank_account_number
          : null,
        re_enter_bank_account_number: nom.re_enter_bank_account_number
          ? nom.re_enter_bank_account_number
          : null,
        ifsc_code: nom?.ifsc_code ?? "",
        bank_name: nom?.bank_name ?? "",
        bank_city: nom?.bank_city ?? "",
        branch_name: nom?.branch_name ?? "",
        guardian_name: nom?.guardian_name ?? "",
        guardian_contact_number: nom?.guardian_contact_number ?? "",
        relation_with_nominee: nom?.relation_with_nominee?.value ?? "",
      })),
    };
    postOtpGenerateMutation.mutateAsync(basePayload).then((res) => {
      if (res.status === 200) toggleIsOTPModalOpen(true);
    });
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="flex gap-2 justify-between mt-3">
            <div className="flex-1">
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
                isDisabled={isSelectedSingleAgentData}
                options={allAgentData?.reportee_agents}
                onChange={(selectedOption) => {
                  if (selectedOption) {
                    setValue("agent_id", selectedOption, {
                      shouldValidate: null,
                    });

                    handleAgentSubmit(selectedOption);
                  }
                }}
              />
            </div>
            <div className="flex-1">
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
          <div className="col-span-full my-4">
            <FilePicker
              label="Supporting Document"
              name="document"
              control={control}
              watch={watch}
              tooltipText="Accepted documents: Aadhaar Card, Passport, Voter ID (EPIC Card). Upload file (Max 10 MB) in .jpg, .jpeg, .png, or .pdf format"
              setValue={setValue}
              clearErrors={clearErrors}
              errors={errors}
              isRequired={true}
              helperText="Please upload required documents (Max 10 MB). Allowed: .jpg, .jpeg, .png, .pdf"
              acceptedFiles={{
                "image/png": [".png"],
                "image/jpg": [".jpg"],
                "image/jpeg": [".jpeg"],
                "application/pdf": [".pdf"],
              }}
            />
          </div>
          <UiTextArea
            name="comments"
            label="Comments"
            placeholder="Enter additional comments or reason for change"
            className="!bg-offWhite/50 min-h-24"
          />
          {getNomineeDetails && fields.length > 0 && (
            <>
              <section className="py-4.5">
                <div className="flex flex-col   gap-3 md:gap-4 w-full">
                  <section className="relative flex items-center gap-3">
                    <Button
                      size="sm"
                      className="bg-primary hover:bg-red-600 text-white rounded-md flex items-center gap-2">
                      <Triangle className="w-3 h-3 fill-current" />
                      <span className="text-sm font-medium">
                        {fields?.length}
                      </span>
                    </Button>
                    {fields.length < 10 && (
                      <div className="relative flex items-center">
                        <Button
                          variant={"outlined"}
                          disabled={
                            !canAddNominee ||
                            !watch(`nominee[${stage}].nominee_share`)
                          }
                          onClick={() => {
                            append({ ...empty_nominee, id: null });
                            setStage((prev) => prev + 1);
                          }}>
                          <HiOutlinePlus />
                        </Button>
                      </div>
                    )}
                  </section>
                  {/* Cards Section*/}
                  <div className="grid grid-cols-5 gap-3 items-center">
                    {fields?.map((nomineeUnit, index) => {
                      return (
                        <NomineeCard
                          key={nomineeUnit?.key}
                          nomineeUnit={nomineeUnit}
                          index={index}
                          stage={stage}
                          setStage={setStage}
                        />
                      );
                    })}
                  </div>
                </div>
              </section>
              {/* FORM Section */}
              {fields.map(
                (_nominee, index) =>
                  stage === index && (
                    <NomineeEndorsementForm
                      key={_nominee.id}
                      stage={stage}
                      totalNominee={fields?.length}
                      index={index}
                      nomineeUnit={_nominee}
                      isOTPVerified={isOTPVerified}
                      handleStage={() => {
                        setIsApproveModalOpen(true);
                      }}
                    />
                  )
              )}
            </>
          )}
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

        <ActionConfirmationModal
          open={isApproveModalOpen}
          onClose={() => setIsApproveModalOpen(false)}
          onConfirm={() => {
            setStage(0);
            remove(stage);
            setIsApproveModalOpen(false);
          }}
          actionType={"delete"}
          title={"Delete Nominee"}
          message={"Do you want to delete this nominee ?"}
          isLoading={false}
        />
      </FormProvider>
    </div>
  );
};

export default NomineeDetailsForm;
