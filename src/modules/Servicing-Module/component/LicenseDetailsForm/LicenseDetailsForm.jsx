import { Dropdown, FilePicker, Input } from "@/UI-Components";
import UiButton from "@/UI-Components/Buttons/UiButton";
import ActionConfirmationModal from "@/UI-Components/Modals/ActionConfirmModal";
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus, Triangle } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { shouldShowOTPModal } from "../../helper/FormHelper";
import useAllForm from "../../hooks/useAllForm";
import OTPModal from "../OTPModal/OTPModal";
import LicenseCard from "./components/LicenseCard";
import LicenseEndorsementForm from "./components/LicenseEndorsementForm";
import {
  empty_license,
  INSURER_TYPE_OPTIONS,
} from "./licenseDetailsForm.constant";
import { endorsementLicenseSchema } from "./LicenseDetailsSchema";
import UiTooltip from "@/UI-Components/Tooltip/UiTooltip";
import { useGetData } from "@/modules/OnboardingDetails/service";
import UiTextArea from "@/UI-Components/UiTextArea";

const LicenseDetailsForm = ({ allAgentData }) => {
  const [stage, setStage] = useState(0);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const {
    services: { getSingleAgentService },
    mutations: {
      postOtpVerifyMutation,
      postOtpGenerateMutation,
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
  const agentType =
    getSingleAgentService?.data?.data?.reportee_agents?.[0]?.user_type ??
    allAgentData?.reportee_agents?.[0]?.user_type;
  const verticalId = +localStorage.getItem("vertical_id");
  const methods = useForm({
    defaultValues: {
      agent_id: null,
      agent_name: "",
      license: [],
    },
    resolver: yupResolver(endorsementLicenseSchema),
    mode: "onChange",
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
    name: "license",
    keyName: "key",
  });

  const isAgentJourney =
    allAgentData?.response_type === "single" ? true : false;
  const { data: userData } = useGetData();
  const isSingleAgentUserId = userData?.data?.profile?.user_id;
  const agentId = watch("agent_id");

  const handleAgentSubmit = (data) => {
    if (!data?.id) {
      reset({
        agent_id: null,
        agent_name: "",
        license: [],
      });
    }

    getSingleAgentService.mutate({
      agentId: data?.id,
      endorsementTypeId: subRoute,
    });
  };

  const showOTPModal = shouldShowOTPModal(subRoute);
  const handleOtpGenerate = async () => {
    const isFormValid = await trigger();

    if (!isFormValid) {
      const nomineeErrors = methods.formState.errors?.license || [];
      const firstErrorIndex = nomineeErrors.findIndex((n) => n !== undefined);
      if (firstErrorIndex !== -1) {
        setStage(firstErrorIndex);
      }
      return;
    }
    const licenseValues = methods.getValues("license");

    const basePayload = {
      endorsement_type_id: subRoute,
      agent_id: agentId?.id ?? isSingleAgentUserId,
      comments: methods.getValues("comments"),
      ...(document && { document: methods?.getValues("document")?.[0] }),
      changes: licenseValues.map((license) => ({
        insurance_type_sequence: license?.insurance_type_sequence,
        name_of_issuer: license?.name_of_issurer?.label,
        license_type: license?.insurer_type?.value,
        license_number: license?.agency_code,
        date_of_agent_appointment: license?.date_of_agent_appointment,
        date_of_agent_cessation: license?.date_of_agent_cessation ?? "",
      })),
    };

    postOtpGenerateMutation.mutateAsync(basePayload).then((res) => {
      if (res.status === 200) toggleIsOTPModalOpen(true);
    });
  };

  const onSubmit = (data) => {
    const payload = {
      agent_id: agentId?.id ?? isSingleAgentUserId,
      endorsement_type_id: subRoute,
      comments: data?.comments,
      is_otp_verified: isOTPVerified === true ? 1 : 0,
      ...(data?.document?.length && {
        document: data?.document[0],
      }),
      changes: data.license?.map((licenseItem) => ({
        insurance_type_sequence: licenseItem?.insurance_type_sequence,
        license_type: licenseItem?.insurer_type?.value,
        license_number: licenseItem?.agency_code,
        name_of_issuer: licenseItem?.name_of_issurer?.label,
        ...(licenseItem?.date_of_agent_appointment && {
          date_of_agent_appointment: licenseItem?.date_of_agent_appointment,
        }),
        ...(licenseItem?.date_of_agent_cessation && {
          date_of_agent_cessation: licenseItem?.date_of_agent_cessation,
        }),
      })),
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

  useEffect(() => {
    if (isAgentJourney) {
      const { reportee_agents } = allAgentData;
      const singleAgentData = reportee_agents?.[0];
      if (!singleAgentData) return;

      setValue("agent_id", {
        application_number: singleAgentData?.application_number,
      });
      setValue("agent_name", singleAgentData?.agent_name || "");

      if (Array.isArray(singleAgentData?.current_value)) {
        const mappedLicenses = singleAgentData?.current_value.map((item) => {
          const insurerType = INSURER_TYPE_OPTIONS?.find(
            (type) => type?.value == item?.insurer_type
          );
          return {
            name_of_issurer: {
              label: item?.name_of_issuer,
              value: item?.name_of_issuer,
            },
            agency_code: item?.agency_code,
            insurer_type: insurerType,
            date_of_agent_appointment: item?.date_of_agent_appointment,
            date_of_agent_cessation: item?.date_of_agent_cessation,
            insurance_type_sequence: item?.insurance_type_sequence,
          };
        });

        reset((prev) => ({
          ...prev,
          license: mappedLicenses,
        }));
      }
      return;
    }

    const apiData = getSingleAgentService?.data?.data;

    if (!apiData) return;
    const { reportee_agents } = apiData;
    const agentData = reportee_agents?.[0];
    if (!agentData) return;

    setValue("agent_name", agentData?.agent_name || "");

    if (Array.isArray(agentData?.current_value)) {
      const mappedLicenses = agentData.current_value.map((item) => {
        const insurerType = INSURER_TYPE_OPTIONS?.find(
          (type) => type?.value == item?.insurer_type
        );
        return {
          name_of_issurer: {
            label: item?.name_of_issuer,
            value: item?.name_of_issuer,
          },
          agency_code: item?.agency_code,
          insurer_type: insurerType,
          date_of_agent_appointment: item?.date_of_agent_appointment,
          date_of_agent_cessation: item?.date_of_agent_cessation,
          insurance_type_sequence: item?.insurance_type_sequence,
        };
      });

      reset((prev) => ({
        ...prev,
        license: mappedLicenses,
      }));
    }
  }, [getSingleAgentService?.data?.data, isAgentJourney, allAgentData]);

  return (
    <>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                isDisabled={isAgentJourney}
                options={allAgentData?.reportee_agents}
                onChange={(selectedOption) => {
                  handleAgentSubmit(selectedOption);
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
          <div className="mt-4">
            <FilePicker
              label="Supporting Documents"
              name="document"
              control={control}
              watch={watch}
              setValue={setValue}
              clearErrors={clearErrors}
              helperText="Upload documents (Max 10 MB). Allowed: JPG, PNG, PDF"
            />
          </div>
          <UiTextArea
            name="comments"
            label="Comments"
            placeholder="Enter additional comments or reason for change"
            className="!bg-offWhite/50 min-h-24"
          />
          {fields.length > 0 && (
            <>
              <section className="py-4.5">
                <div className="flex flex-col   gap-3 md:gap-4 w-full">
                  <section className="relative flex items-center gap-3">
                    <UiButton
                      buttonType="tertiary"
                      text={fields?.length}
                      icon={<Triangle className="w-3 h-3 fill-current" />}
                      className="w-14 h-9 bg-primary hover:bg-red-600 text-white rounded-lg flex flex-row-reverse items-center gap-2"
                    />
                    {fields.length < 2 && (
                      <div className="relative flex items-center">
                        <UiTooltip
                          tooltipDelay={200}
                          side="top"
                          content="Add more license details"
                          className="border border-lightGray bg-white text-blue-600 p-2">
                          <UiButton
                            buttonType="tertiary"
                            icon={<Plus className="size-4" />}
                            onClick={() => {
                              append({
                                ...empty_license,
                                insurance_type_sequence: 2,
                              });
                              setStage((prev) => prev + 1);
                            }}
                            className="w-12 h-9 hover:bg-red-600 hover:text-white text-primary border border-primary rounded-lg flex items-center gap-2"
                          />
                        </UiTooltip>
                      </div>
                    )}
                  </section>
                  {/* Cards Section*/}
                  <div className="grid grid-cols-5 gap-3 items-center">
                    {fields?.map((licenseUnit, index) => {
                      return (
                        <LicenseCard
                          key={licenseUnit?.key}
                          licenseUnit={licenseUnit}
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
              {fields.map((_license, index) => {
                if (stage === index) {
                  return (
                    <LicenseEndorsementForm
                      key={_license.id}
                      stage={stage}
                      totalLicense={fields.length}
                      index={index}
                      licenseUnit={_license}
                      agentType={agentType}
                      handleStage={() => {
                        setIsApproveModalOpen(true);
                      }}
                    />
                  );
                }
                return null;
              })}
            </>
          )}

          {!isOTPVerified ? (
            <section className="mt-2 flex justify-end">
              <UiButton
                text="Generate OTP"
                buttonType="primary"
                type="button"
                className="w-32"
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
        <ActionConfirmationModal
          open={isApproveModalOpen}
          onClose={() => setIsApproveModalOpen(false)}
          onConfirm={() => {
            setStage(0);
            remove(stage);
            setIsApproveModalOpen(false);
          }}
          actionType={"delete"}
          title={"Delete License"}
          message={"Do you want to delete this license details ?"}
          isLoading={false}
        />
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

export default LicenseDetailsForm;
