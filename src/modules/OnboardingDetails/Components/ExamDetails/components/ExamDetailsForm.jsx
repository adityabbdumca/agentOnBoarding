import { statesList } from "@/Components/MasterTable/constants";
import { LANGUAGE_OPTIONS } from "@/constants/global.constant";
import Dropdown from "@/UI-Components/Dropdown";
import Input from "@/UI-Components/Input";
import UiDateInput from "@/UI-Components/UiDateInput";
import { DateTime } from "luxon";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { HiChevronUp } from "react-icons/hi";
import { useGetExamCenter } from "../../../service";

const ExamDetailsForm = ({
  register,
  errors,
  control,
  watch,
  setValue,
  index,
}) => {
  const [open, setOpen] = useState(true);
  const { data: examCenterData, mutate: getExamCenter } = useGetExamCenter();
  const centerList = examCenterData?.data?.return_data?.map((item) => ({
    label: item?.label,
    value: item?.id,
    address: item?.address,
  }));

  const examCenter = watch(`exam[${index}].exam_center`);
  useEffect(() => {
    if (examCenter?.value) {
      setValue(
        `exam[${index}].center_address`,
        centerList?.find((item) => item?.value === examCenter?.value)
          ?.address || examCenter?.address
      );
    }
  }, [examCenter]);

  useEffect(() => {
    if (!watch(`exam[${index}].state`)?.value) {
      setValue(`exam[${index}].exam_center`, null);
      setValue(`exam[${index}].center_address`, null);
    }
  }, [watch(`exam[${index}].state`)?.value]);

  return (
    <div
      data-open={open}
      className={`border border-gray-200 rounded-lg shadow-md p-4 overflow-hidden transition-all duration-300 ease-in-out max-h-[32rem] data-[open=false]:max-h-16`}>
      <h1 className="flex items-center justify-between text-lg font-semibold tracking-wide pb-4 text-slate-700">
        {`Preference ${index + 1}`}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="cursor-pointer bg-gray-200 rounded-lg p-1">
          <HiChevronUp
            size={20}
            className={`${
              open ? "rotate-180" : "rotate-0"
            } transition-all duration-300 ease-in-out text-slate-600`}
          />
        </button>
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
        <div className="col-span-1">
          <Controller
            control={control}
            name={`exam[${index}].preferred_exam_date`}
            rules={{ required: "Preferred exam date is required" }}
            render={({ field, fieldState }) => {
              const prevDateStr = watch(
                `exam[${index - 1}].preferred_exam_date`
              );
              const minAllowedDate =
                index === 0
                  ? DateTime.now()
                  : typeof prevDateStr === "string" && prevDateStr.trim() !== ""
                    ? DateTime.fromFormat(prevDateStr, "dd-MM-yyyy").plus({
                        days: 1,
                      })
                    : null;
              return (
                <UiDateInput
                  label="Preferred Exam Date"
                  value={field.value}
                  onChange={(dateStr) => {
                    field.onChange(dateStr);
                    index <= 1 &&
                      setValue(`exam[${index + 1}].preferred_exam_date`, null);
                  }}
                  isRequired={index == 0}
                  isDisabled={!!watch("approval_access")}
                  minAllowedDate={minAllowedDate}
                  errors={fieldState?.error?.message}
                />
              );
            }}
          />
        </div>

        <div className="col-span-1">
          <Dropdown
            control={control}
            name={`exam[${index}].preferred_language`}
            label="Preferred Language"
            isDisabled={!!watch("approval_access") || [1, 2].includes(index)}
            placeholder="Enter Preferred Language"
            isRequired={index == 0}
            onChange={(value) => {
              setValue(`exam[${1}].preferred_language`, value);
              setValue(`exam[${2}].preferred_language`, value);
            }}
            errors={errors}
            options={LANGUAGE_OPTIONS}
          />
        </div>

        <div className="col-span-1">
          <Dropdown
            control={control}
            label="State"
            placeholder="Enter State"
            isRequired={index == 0}
            options={statesList}
            readOnly={!!watch("approval_access")}
            isDisabled={!!watch("approval_access")}
            errors={errors}
            name={`exam[${index}].state`}
            onChange={(e) => {
              setValue(`exam[${index}].exam_center`, null);
              setValue(`exam[${index}].center_address`, null);
              getExamCenter({ state: e.value });
            }}
          />
        </div>

        <div className="col-span-1">
          <Dropdown
            control={control}
            label="Exam Center"
            placeholder="Select Exam Center"
            isRequired={index == 0}
            errors={errors}
            readOnly={!!watch("approval_access")}
            isDisabled={!!watch("approval_access")   }
            name={`exam[${index}].exam_center`}
            options={centerList || []}
            onChange={(e) => {
              setValue(`exam[${index}].center_address`, null);
            }}
          />
        </div>

        <div className="sm:col-span-2 lg:col-span-4">
          <Input
            label="Center Address"
            inputRef={register(`exam[${index}].center_address`)}
            placeholder="Enter Center Address"
            isDisabled={!!watch("approval_access")}
            isRequired={index == 0}
            readOnly={true}
            errors={errors}
            name={`exam[${index}].center_address`}
          />
        </div>
      </div>
      {watch(`exam[${index}].center_address`) && (
        <p className="text-xs font-bold text-primary mt-4">
          Exam slots are subject to availability with NSEIT. Preferred date/time
          selected by you may not guarantee
        </p>
      )}
    </div>
  );
};

export default ExamDetailsForm;
