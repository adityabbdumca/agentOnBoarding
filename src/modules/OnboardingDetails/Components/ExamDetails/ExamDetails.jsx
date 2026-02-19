import FullscreenKeyboardBlocker from "@/Components/DisableKeyboard/FullscreenKeyboardBlocker";
import { statesList } from "@/Components/MasterTable/constants";
import { LANGUAGE_OPTIONS } from "@/constants/global.constant";
import { alphanumeric } from "@/HelperFunctions/helperFunctions";
import Button from "@/UI-Components/Button";
import UiButton from "@/UI-Components/Buttons/UiButton";
import Dropdown from "@/UI-Components/Dropdown";
import Input from "@/UI-Components/Input";
import { datetimeUtility } from "@/utlities/dateTime.utility";
import { allowOnlyNumbers } from "@/utlities/input.utility";
import { ChevronDown } from "lucide-react";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { HiArrowNarrowLeft, HiArrowNarrowRight } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { decrementAgent } from "../../agent.slice";
import {
  useApproveExamDate,
  useExamDetails,
  useGetExamCenter,
} from "../../service";
import ExamDetailsForm from "./components/ExamDetailsForm";
import UiCustomDateTimeInput from "@/UI-Components/DateInput/UiCustomDateTimeInput";
import { Controller } from "react-hook-form";
import UiDateTimeInput from "@/UI-Components/DateInput/UiDateTimeInput";

const ExamDetails = ({
  register,
  watch,
  handleSubmit,
  setValue,
  control,
  errors,
  resetField,
  id,
  reset,
  userData,
  getUserDetailsRefetch,
}) => {
  const { mutate, isPending } = useExamDetails();
  const { mutateAsync: approveExamDate } = useApproveExamDate();

  const [isDisclosureOpen, toggleDisclosure] = useState(true);
  const { agent } = useSelector((state) => state.agent);
  const { data: examCenterData, mutate: getExamCenter } = useGetExamCenter();
  const centerList = examCenterData?.data?.return_data?.map((item) => ({
    label: item?.label,
    value: item?.id,
    address: item?.address,
  }));

  const dispatch = useDispatch();

  const verticalId = localStorage.getItem("vertical_id");
  const userStage = watch("user_stage");

  const selectedDate = watch("selected_date");
  const formattedSelectedDate = (() => {
    if (typeof selectedDate !== "string") return "";

    let dt = DateTime.fromFormat(selectedDate, "dd-MM-yyyy HH:mm");

    if (!dt.isValid) {
      // fallback for backend date-only value
      dt = DateTime.fromFormat(selectedDate, "dd-MM-yyyy");
    }

    return dt.isValid ? dt.toFormat("dd-MM-yyyy") : "";
  })();
  const exam = watch("exam"); // This value fetch from Prefill at Parent Update component
  const examCenter = watch(`exam_center`);
  const isResultPass = watch("exam_status")?.value === "Pass";
  const isExamStage = userData?.is_exam_stage;
  const isShowExamField = userData?.is_show_exam_field;
  const selectedPreference = exam?.find(
    (item) => item?.preferred_exam_date === formattedSelectedDate
  );

  const allocatedExamDate =
    watch("selected_date") ?? DateTime.now().toFormat("dd-MM-yyyy HH:mm");

  const isShowResultDropDown =
    datetimeUtility.isBeforeToday(allocatedExamDate) && isShowExamField;
  useEffect(() => {
    const raw = userData?.exam?.selected_date;
    if (!raw) return;
    let dt = DateTime.fromISO(raw);

    if (!dt.isValid) {
      dt = DateTime.fromFormat(raw, "dd-MM-yyyy HH:mm");
    }
    if (!dt.isValid) {
      dt = DateTime.fromFormat(raw, "dd-MM-yyyy");
    }
    setValue(
      "selected_date",
      dt.isValid ? dt.toFormat("dd-MM-yyyy HH:mm") : ""
    );
  }, [userData?.exam?.selected_date]);
  useEffect(() => {
    if (selectedPreference) {
      setValue(`exam_center`, selectedPreference?.exam_center);
      setValue(`exam_center_address`, selectedPreference?.center_address);
      setValue(`preferred_language`, selectedPreference?.preferred_language);
      setValue(`exam_state`, selectedPreference?.state);
    }
  }, [selectedPreference]);
  useEffect(() => {
    if (examCenter?.value) {
      setValue(
        `exam_center_address`,
        centerList?.find((item) => item?.value === examCenter?.value)
          ?.address || examCenter?.address
      );
    }
  }, [examCenter]);

  const onSubmit = (data) => {
    const payload = data.exam
      .filter((item) => Object.values(item ?? {}).some(Boolean))
      .map((item) => ({
        ...item,
        preferred_exam_date: item?.preferred_exam_date
          ? DateTime.fromFormat(
              item.preferred_exam_date,
              "dd-MM-yyyy"
            ).toFormat("yyyy-MM-dd")
          : null,
        preferred_language: item?.preferred_language?.value,
        state: item?.state?.value,
        exam_center: item?.exam_center?.label,
      }));
    const approvePayload = {
      id,
      roll_no: data?.roll_no,
      selected_date: DateTime.fromFormat(
        data?.selected_date || "",
        "dd-MM-yyyy HH:mm"
      ).toFormat("yyyy-MM-dd HH:mm"),
      ...(data?.exam_status?.value && {
        exam_status: data?.exam_status?.value,
      }),
      ...(data?.exam_score && { exam_score: data?.exam_score }),
      preferred_language: data?.preferred_language?.value,
      exam_state: data?.exam_state?.value,
      exam_center: data?.exam_center?.label,
      exam_center_address: data?.exam_center_address,
    };

    watch("approval_access")
      ? approveExamDate(approvePayload).then((res) => {
          getUserDetailsRefetch();
        })
      : mutate({
          id,
          details: payload,
        });
  };
  return (
    <>
      <FullscreenKeyboardBlocker />
      <div className="flex">
        <div className="items-center  bg-green-300  text-black p-2 px-3 rounded-full shadow-lg mx-4 flex  ml-auto">
          <span className="w-2 h-2 bg-black rounded-full mr-2 " />
          <span className="font-semibold text-xs lg:text-sm md:text-sm">
            Training Status:
          </span>
          <span className="ml-1 font-semibold text-xs lg:text-sm md:text-sm ">
            {userData?.training?.training_completed ? "Completed" : "Pending"}
          </span>
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {["1", "2"].includes(verticalId) && (
          <div
            data-open={isDisclosureOpen}
            className=" relative rounded-lg border border-lightGray bg-white shadow-md flex flex-col p-4 pb-12 transition-all duration-300 ease-in-out max-h-[30rem] data-[open=false]:max-h-16">
            <div className="flex justify-end">
              <UiButton
                buttonType="tertiary"
                icon={<ChevronDown className="size-4" />}
                onClick={() => {
                  toggleDisclosure((prev) => !prev);
                }}
                className={`p-1 bg-lightGray ${
                  isDisclosureOpen ? "rotate-180" : "rotate-0"
                } `}
              />
            </div>
            <div
              className={`grid grid-cols-3 gap-6 p-4 ${isDisclosureOpen ? "" : "hidden"}`}>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">
                  Receipt No
                </span>
                <span className="mt-1 text-xs font-semibold ">
                  {userData?.payment?.reference_number || "--"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">
                  Training Start Date
                </span>
                <span className="mt-1 text-xs font-semibold ">
                  {userData?.training?.training_start || "--"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-gray-500">
                  Training End Date
                </span>
                <span className="mt-1 text-xs font-semibold ">
                  {userData?.training?.training_end || "--"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <Input
                  label="URN No"
                  inputRef={register("roll_no")}
                  placeholder={"Enter URN No"}
                  isRequired={true}
                  errors={errors}
                  name={"roll_no"}
                  maxLength={14}
                  minLength={5}
                  onChange={alphanumeric}
                  disabled={isExamStage}
                />
              </div>
              <div className="flex flex-col gap-1">
                {/* <Dropdown
                  control={control}
                  label="Allocated Exam Date"
                  // isRequired={true}
                  // errors={errors}
                  options={selectedDatesOptions}
                  name={"selected_date"}
                  watch={watch}
                  isDisabled={isExamStage}
                />
                <Controller
                  control={control}
                  name="selected_date"
                  render={({ field }) => (
                    <UiCustomDateTimeInput
                      label="Allocated Exam Date"
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isExamStage}
                    />
                  )}
                /> */}
                <Controller
                  control={control}
                  name="selected_date"
                  render={({ field: { value, onChange } }) => (
                    <UiDateTimeInput
                      label="Allocated Exam Date"
                      value={value}
                      minAllowedDate={DateTime.now().toFormat(
                        "dd-MM-yyyy HH:mm"
                      )}
                      onChange={onChange}
                      disabled={isExamStage}
                    />
                  )}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Dropdown
                  control={control}
                  name={`preferred_language`}
                  label="Preferred Language"
                  placeholder="Enter Preferred Language"
                  errors={errors}
                  options={LANGUAGE_OPTIONS}
                  isDisabled={isExamStage}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Dropdown
                  control={control}
                  label="State"
                  placeholder="Enter State"
                  options={statesList}
                  errors={errors}
                  name={`exam_state`}
                  onChange={(e) => {
                    setValue(`exam_center`, null);
                    setValue(`exam_center_address`, null);
                    getExamCenter({ state: e.value });
                  }}
                  isDisabled={isExamStage}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Dropdown
                  control={control}
                  label="Exam Center"
                  placeholder="Select Exam Center"
                  errors={errors}
                  name={`exam_center`}
                  options={centerList || []}
                  isDisabled={isExamStage}
                />
              </div>

              <div className="flex flex-col gap-1">
                <Input
                  label="Center Address"
                  inputRef={register(`exam_center_address`)}
                  placeholder="Enter Center Address"
                  readOnly={true}
                  errors={errors}
                  name={`exam_center_address`}
                  disabled={isExamStage}
                />
              </div>
              {isShowResultDropDown && (
                <div>
                  <Dropdown
                    control={control}
                    name={`exam_status`}
                    label="Exam Status"
                    placeholder="Select Status"
                    errors={errors}
                    options={[
                      { label: "Pass", value: "Pass" },
                      { label: "Fail", value: "Fail" },
                      { label: "Absent", value: "Absent" },
                    ]}
                    isDisabled={isExamStage}
                  />
                </div>
              )}
              {isResultPass && (
                <Input
                  label="Score"
                  inputRef={register(`exam_score`)}
                  placeholder="Enter Score"
                  errors={errors}
                  name={`exam_score`}
                  onChange={(e) => {
                    allowOnlyNumbers(e, 3);
                  }}
                  disabled={isExamStage}
                />
              )}
              {!isExamStage && (
                <div className=" flex items-end absolute bottom-4 right-10">
                  {(!watch("user_approval_status") || id) &&
                    !(
                      ["1", "2"].includes(verticalId) &&
                      userStage === "Certified"
                    ) && (
                      <Button
                        type="submit"
                        width={"auto"}
                        isLoading={isPending}
                        endIcon={<HiArrowNarrowRight size={15} />}>
                        {"Submit"}
                      </Button>
                    )}
                </div>
              )}
            </div>
          </div>
        )}

        {[...Array(3)].map((_, index) => {
          return (
            <ExamDetailsForm
              key={index}
              register={register}
              watch={watch}
              resetField={resetField}
              setValue={setValue}
              control={control}
              errors={errors}
              index={index}
            />
          );
        })}
        <div className="mt-4 flex justify-between gap-2">
          {agent ? (
            <Button
              startIcon={<HiArrowNarrowLeft size={15} />}
              variant={"outlined"}
              width={"auto"}
              onClick={() => dispatch(decrementAgent())}>
              Back
            </Button>
          ) : (
            <div />
          )}
          {(!watch("user_approval_status") || id) &&
            !(["1", "2"].includes(verticalId) && userStage === "Certified") && (
              <Button
                type="submit"
                width={"auto"}
                isLoading={isPending}
                endIcon={<HiArrowNarrowRight size={15} />}>
                {watch("approval_access") ? "Next" : "Submit"}
              </Button>
            )}
        </div>
      </form>
    </>
  );
};

export default ExamDetails;
