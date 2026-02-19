import UiButton from "@/UI-Components/Buttons/UiButton";
import UiTextArea from "@/UI-Components/Input/UiTextArea";
import UiSelector from "@/UI-Components/Selector/UiSelector";
import UiDateInput from "@/UI-Components/UiDateInput";
import UiDiscloserBasic from "@/UI-Components/UiDiscloserBasic";
import UiPageWrapper from "@/UI-Components/Wrapper/UiPageWrapper";
import { ArrowLeft, Settings } from "lucide-react";
import { DateTime } from "luxon";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { toast } from "react-toastify";
import useEditRescheduleExamDetails from "../hooks/useEditRescheduleExamDetails";
import { LANGUAGE_OPTIONS, STATES_OPTIONS } from "../rescheduleUser.constant";
import { queryClientGlobal } from "@/lib/tanstack-query/query.config";
import { QUERY_KEYS } from "@/services/KEYS/QUERY_KEYS";

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
  exam: IExamPreference[];
}

const RescheduleExamDetails = () => {
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

  const { watch, setValue, control, handleSubmit } = formMethods;

  const { fields } = useFieldArray({
    name: "exam",
    control,
  });

  const {
    services: { getExamDetails },
    mutations: { getExamCenterDetailsMutations, addUpdateExamDetailsMutations },
    routing: { navigate, userId },
  } = useEditRescheduleExamDetails();

  const EXAM_CENTER_OPTIONS =
    getExamCenterDetailsMutations?.data?.data?.return_data;

  const hallTicketDetails = getExamDetails?.data?.data?.data[0];

  const onSubmit = (data: IRescheduleExamDetailsFormSchema) => {
    const examDetails = data?.exam
      ?.filter((item) => Object.values(item ?? {}).some(Boolean))
      .map((pref) => ({
        preferred_exam_date: pref?.preferred_exam_date
          ? DateTime.fromFormat(
              pref.preferred_exam_date,
              "dd-MM-yyyy"
            ).toFormat("yyyy-MM-dd")
          : null,
        preferred_language: pref.preferred_language?.value,
        state: pref.preferred_state?.value ?? null,
        exam_center: pref.preferred_center?.value ?? null,
        center_address: pref.center_address,
      }));

    const payload = {
      id: Number(userId),
      details: examDetails,
      action_from: "reschedule",
    };

    addUpdateExamDetailsMutations.mutateAsync(payload).then(() => {
      toast.success(
        "Exam preferences saved successfully. Awaiting admin assignment"
      );
      queryClientGlobal.invalidateQueries({
        queryKey: [QUERY_KEYS?.RESCHEDULE_USER],
      });
      queryClientGlobal.invalidateQueries({
        queryKey: [QUERY_KEYS?.RESCHEDULE_USER],
      });
      navigate("/reschedule-exam");
    });
  };

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
      <div className="border border-lightGray rounded shadow-md">
        <div className={`grid grid-cols-3 gap-6 p-4`}>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-500">URN No</span>
            <span className="mt-1 text-xs font-semibold">
              {hallTicketDetails?.roll_no}
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
              Receipt No
            </span>
            <span className="mt-1 text-xs font-semibold ">
              {hallTicketDetails?.reference_number ?? "--"}
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
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            {fields?.map((field, idx) => {
              return (
                <UiDiscloserBasic
                  key={field.id}
                  className={"bg-white rounded-lg p-2 "}
                  containerClass={
                    "bg-lightGray/10 rounded-lg border border-lightGray/20 shadow-sm"
                  }
                  titleElement={
                    <div className="flex gap-4 items-center  ">
                      <div className="bg-lightGray/60 p-2 rounded-sm">
                        <Settings className="size-5 text-primary" />
                      </div>
                      <div className="flex flex-col items-start ">
                        <h2 className=" font-semibold text-base ">
                          Preference {idx + 1}
                        </h2>
                      </div>
                    </div>
                  }
                  isLoading={false}>
                  {" "}
                  <div key={field.id} className=" p-4 flex flex-col gap-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Controller
                        control={control}
                        name={`exam.${idx}.preferred_exam_date`}
                        rules={{
                          required:
                            idx === 0
                              ? "Preferred exam date is required"
                              : undefined,
                        }}
                        render={({
                          field: { value, onChange },
                          fieldState,
                        }) => {
                          const prevDateStr = watch(
                            `exam.${idx - 1}.preferred_exam_date`
                          );
                          const minAllowedDate =
                            idx === 0
                              ? DateTime.now()
                              : typeof prevDateStr === "string" &&
                                  prevDateStr.trim() !== ""
                                ? DateTime.fromFormat(
                                    prevDateStr,
                                    "dd-MM-yyyy"
                                  ).plus({
                                    days: 1,
                                  })
                                : null;

                          return (
                            <UiDateInput
                              label="Preferred Exam Date"
                              value={value}
                              onChange={(dateStr: any) => {
                                onChange(dateStr);
                              }}
                              isRequired={idx === 0}
                              minAllowedDate={minAllowedDate}
                              errors={fieldState?.error?.message}
                              maxAllowedDate={undefined}
                            />
                          );
                        }}
                      />

                      <Controller
                        control={control}
                        name={`exam.${idx}.preferred_language`}
                        rules={{
                          required:
                            idx === 0 ? "Language is required" : undefined,
                        }}
                        render={({
                          field: { onChange, value },
                          fieldState,
                        }) => (
                          <UiSelector
                            label="Preferred Language"
                            value={value}
                            onChange={(val:any) => {
                              setValue(`exam.${1}.preferred_language`, val);
                              setValue(`exam.${2}.preferred_language`, val);
                              onChange(val);
                            }}
                            options={LANGUAGE_OPTIONS || []}
                            accessorKey="label"
                            placeholder="Select Language"
                            isRequired={idx === 0}
                            error={fieldState?.error?.message}
                            disabled={idx > 0}
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name={`exam.${idx}.preferred_state`}
                        rules={{
                          required: idx === 0 ? "State is required" : undefined,
                        }}
                        render={({
                          field: { value, onChange },
                          fieldState,
                        }) => (
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
                            isRequired={idx === 0}
                            error={fieldState?.error?.message}
                          />
                        )}
                      />

                      <Controller
                        control={control}
                        name={`exam.${idx}.preferred_center`}
                        rules={{
                          required:
                            idx === 0 ? "Exam center is required" : undefined,
                        }}
                        render={({
                          field: { value, onChange },
                          fieldState,
                        }) => (
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
                            isRequired={idx === 0}
                            error={fieldState?.error?.message}
                          />
                        )}
                      />
                    </div>
                    <UiTextArea
                      label="Center Address"
                      name={`exam.${idx}.center_address`}
                      registerOptions={{
                        required: idx === 0 ? true : undefined,
                      }}
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
              text="Submit"
              buttonType="primary"
              className="px-6"
              type="submit"
              icon={<></>}
              isLoading={addUpdateExamDetailsMutations.isPending}
            />
          </div>
        </form>
      </FormProvider>
    </UiPageWrapper>
  );
};

export default RescheduleExamDetails;
