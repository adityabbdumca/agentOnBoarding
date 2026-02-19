import { LANGUAGE_OPTIONS, STATES_OPTIONS } from "@/constants/global.constant";
import { alphanumeric } from "@/HelperFunctions/helperFunctions";
import { queryClientGlobal } from "@/lib/tanstack-query/query.config";
import { useApproveExamDate } from "@/modules/OnboardingDetails/service";
import { QUERY_KEYS } from "@/services/KEYS/QUERY_KEYS";
import UiButton from "@/UI-Components/Buttons/UiButton";
import UiTextArea from "@/UI-Components/Input/UiTextArea";
import UiTextInput from "@/UI-Components/Input/UiTextInput";
import UiSelector from "@/UI-Components/Selector/UiSelector";
import UiDateInput from "@/UI-Components/UiDateInput";
import UiDiscloserBasic from "@/UI-Components/UiDiscloserBasic";
import UiPageWrapper from "@/UI-Components/Wrapper/UiPageWrapper";
import { ArrowLeft, Settings } from "lucide-react";
import { DateTime } from "luxon";
import { useEffect } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { toast } from "react-toastify";
import useApproveRescheduleExamDetails from "../hooks/useApproveRescheduleExamDetails";

interface IOption {
  label: string;
  value: string;
}
interface IExamPreference {
  preferred_exam_date: string | null;
  preferred_language: IOption | null;
  preferred_state: IOption | null;
  preferred_center: IOption | null;
  center_address: string;
}

interface IRescheduleExamDetailsFormSchema {
  selected_date: any;
  roll_no: string;
  exam: IExamPreference[];
}

const ApproveRescheduleExamDetails = () => {
  const formMethods = useForm<IRescheduleExamDetailsFormSchema>({
    defaultValues: {
      exam: [
        {
          preferred_exam_date: null,
          preferred_language: null,
          preferred_state: null,
          preferred_center: null,
          center_address: "",
        },
        {
          preferred_exam_date: null,
          preferred_language: null,
          preferred_state: null,
          preferred_center: null,
          center_address: "",
        },
        {
          preferred_exam_date: null,
          preferred_language: null,
          preferred_state: null,
          preferred_center: null,
          center_address: "",
        },
      ],
    },
    mode: "onBlur",
  });

  const { setValue, control, handleSubmit } = formMethods;

  const { fields } = useFieldArray({
    name: "exam",
    control,
  });
  const { mutateAsync: approveExamDateAsync, isPending } = useApproveExamDate();
  const {
    services: { getExamRaiseDetails },
    mutations: { getExamCenterDetailsMutations },
    routing: { navigate, userId },
  } = useApproveRescheduleExamDetails();

  const EXAM_CENTER_OPTIONS =
    getExamCenterDetailsMutations?.data?.data?.return_data;
  const examDetails = getExamRaiseDetails?.data?.data?.data;
  const hallTicketDetails = getExamRaiseDetails?.data?.data?.data[0];
  const selectedDatesOptions = examDetails?.map((item: any) => {
    return {
      label: item?.preferred_exam_date,
      value: item?.preferred_exam_date,
    };
  });

  const onSubmit = (data: any) => {
    const approvePayload: any = {
      id: userId,
      roll_no: data?.roll_no,
      selected_date: data?.selected_date?.value,
    };
    approveExamDateAsync(approvePayload).then(() => {
      queryClientGlobal.invalidateQueries({
        queryKey: [QUERY_KEYS?.RESCHEDULE_LIST],
      });
      navigate("/reschedule-raise");
    });
  };
  useEffect(() => {
    if (!examDetails?.length) return;

    const preferredLanguage = examDetails?.[0]?.preferred_language
      ? {
          label: examDetails[0].preferred_language,
          value: examDetails[0].preferred_language,
        }
      : null;

    const mappedExamDetails = examDetails.map((item: any) => ({
      preferred_exam_date: item?.preferred_exam_date
        ? DateTime.fromISO(item.preferred_exam_date).toFormat("dd-MM-yyyy")
        : null,
      preferred_language: item?.preferred_language
        ? {
            label: item.preferred_language,
            value: item.preferred_language,
          }
        : preferredLanguage,
      preferred_state: item?.state
        ? {
            label: item.state,
            value: item.state,
          }
        : null,
      preferred_center: item?.exam_center
        ? {
            label: item.exam_center,
            value: item.exam_center,
          }
        : null,
      center_address: item?.center_address ?? "",
    }));

    formMethods.reset({
      exam: mappedExamDetails,
    });
  }, [examDetails, formMethods]);

  return (
    <UiPageWrapper className="px-6 py-4 flex flex-col gap-4 bg-white w-full h-screen overflow-y-auto">
      <div>
        <UiButton
          text={"Go Back"}
          buttonType="secondary"
          className="flex flex-row-reverse px-4 !h-9 hover:text-primary"
          icon={<ArrowLeft className="size-4" />}
          onClick={() => {
            navigate(-1);
          }}
          isLoading={false}
        />
      </div>

      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="border border-lightGray rounded shadow-md mb-4">
            <div className={`grid grid-cols-3 gap-6 p-4`}>
              <UiTextInput
                name="roll_no"
                label="URN No."
                placeholder="Enter urn number"
                containerClass="gap-1 text-gray-700"
                className=""
                registerOptions={{
                  required: "Urn number is required",
                  onChange: (e) => {
                    alphanumeric(e);
                  },
                }}
              />

              <div className="flex flex-col gap-1">
                {/* <Dropdown
                  control={control}
                  label="Allocated Exam Date"
                  isRequired={true}
                  errors={errors}
                  options={selectedDatesOptions.filter(Boolean)}
                  name={"selected_date"}
                  watch={watch}
                /> */}
                <Controller
                  control={control}
                  name={"selected_date"}
                  rules={{ required: "Allocated date is Required" }}
                  render={({ field: { onChange, value }, fieldState }) => (
                    <UiSelector
                      label="Allocated Date"
                      value={value}
                      onChange={onChange}
                      options={selectedDatesOptions?.filter(Boolean) || []}
                      accessorKey="label"
                      placeholder="Select date"
                      error={fieldState?.error?.message}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">
                  Receipt No
                </span>
                <span className="mt-1 text-xs font-semibold ">
                  {hallTicketDetails?.reference_number ?? "--"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">
                  Training Start Date
                </span>
                <span className="mt-1 text-xs font-semibold ">
                  {hallTicketDetails?.training_start ?? "--"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">
                  Training End Date
                </span>
                <span className="mt-1 text-xs font-semibold ">
                  {hallTicketDetails?.training_end ?? "--"}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">
                  Allocated Date
                </span>
                <span className="mt-1 text-xs font-semibold ">
                  {hallTicketDetails?.selected_date ?? "--"}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">
                  Allocated Language
                </span>
                <span className="mt-1 text-xs font-semibold ">
                  {hallTicketDetails?.preferred_language ?? "--"}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">
                  Allocated State
                </span>
                <span className="mt-1 text-xs font-semibold ">
                  {hallTicketDetails?.state ?? "--"}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">
                  Allocated Exam Center
                </span>
                <span className="mt-1 text-xs font-semibold">
                  {hallTicketDetails?.exam_center ?? "--"}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">
                  Allocated Exam Center Address
                </span>
                <span className="mt-1 text-xs font-semibold text-gray-900">
                  {hallTicketDetails?.center_address}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            {fields?.map((field, idx) => {
              return (
                <UiDiscloserBasic
                  key={field.id}
                  className="bg-white rounded-lg p-2"
                  containerClass="bg-lightGray/10 rounded-lg border border-lightGray/20 shadow-sm"
                  titleElement={
                    <div className="flex gap-4 items-center">
                      <div className="bg-lightGray/60 p-2 rounded-sm">
                        <Settings className="size-5 text-primary" />
                      </div>
                      <div className="flex flex-col items-start">
                        <h2 className="font-semibold text-base">
                          Preference {idx + 1}
                        </h2>
                      </div>
                    </div>
                  }
                  isLoading={false}
                >
                  <div key={field.id} className="p-4 flex flex-col gap-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {/* Preferred Exam Date */}
                      <Controller
                        control={control}
                        name={`exam.${idx}.preferred_exam_date`}
                        render={({ field: { value, onChange } }) => {
                          return (
                            <UiDateInput
                              label="Preferred Exam Date"
                              value={value}
                              onChange={onChange}
                              disabled={true}
                            />
                          );
                        }}
                      />

                      {/* Preferred Language */}
                      <Controller
                        control={control}
                        name={`exam.${idx}.preferred_language`}
                        render={({ field: { onChange, value } }) => (
                          <UiSelector
                            label="Preferred Language"
                            value={value}
                            onChange={onChange}
                            options={LANGUAGE_OPTIONS || []}
                            accessorKey="label"
                            placeholder="Select Language"
                            isRequired={false}
                            disabled={true}
                          />
                        )}
                      />

                      {/* Preferred State */}
                      <Controller
                        control={control}
                        name={`exam.${idx}.preferred_state`}
                        render={({ field: { value, onChange } }) => (
                          <UiSelector
                            label="State"
                            value={value}
                            onChange={(val) => {
                              onChange(val);
                              setValue(`exam.${idx}.preferred_center`, null);
                              setValue(`exam.${idx}.center_address`, "");
                              getExamCenterDetailsMutations.mutate({
                                state: val?.label,
                              });
                            }}
                            options={STATES_OPTIONS || []}
                            placeholder="Select State"
                            accessorKey="label"
                            isRequired={false}
                            disabled={true}
                          />
                        )}
                      />

                      {/* Preferred Center */}
                      <Controller
                        control={control}
                        name={`exam.${idx}.preferred_center`}
                        render={({ field: { value, onChange } }) => (
                          <UiSelector
                            label="Exam Center"
                            value={value}
                            onChange={(val) => {
                              onChange(val);
                              if (val?.label) {
                                setValue(
                                  `exam.${idx}.center_address`,
                                  val?.address
                                );
                              }
                            }}
                            options={EXAM_CENTER_OPTIONS || []}
                            accessorKey="label"
                            placeholder="Select Exam Center"
                            isRequired={false}
                            disabled={true}
                          />
                        )}
                      />
                    </div>

                    <UiTextArea
                      label="Center Address"
                      name={`exam.${idx}.center_address`}
                      disabled={true}
                      className="!h-9"
                    />
                  </div>
                </UiDiscloserBasic>
              );
            })}
          </div>

          <div className="mt-6 flex w-full items-end justify-end">
            <UiButton
              text="Approve"
              buttonType="primary"
              className="px-6"
              type="submit"
              icon={<></>}
              isLoading={isPending}
            />
          </div>
        </form>
      </FormProvider>
    </UiPageWrapper>
  );
};

export default ApproveRescheduleExamDetails;
