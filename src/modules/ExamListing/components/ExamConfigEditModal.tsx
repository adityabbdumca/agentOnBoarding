import { allowOnlyNumbers } from "@/HelperFunctions/helperFunctions";
import { Button, Dropdown, Input } from "@/UI-Components";
import UiModalContainer from "@/UI-Components/Modals/UiModal";
import { yupResolver } from "@hookform/resolvers/yup";
import { NotebookPen } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AGENT_TYPE_OPTIONS, examConfigSchema } from "../ExamConfigConstants";
import {
  IAddEditExamPropSchema,
  IAgentTypeOptionSchema,
} from "../examListing.type";

const ExamConfigEditModal = ({
  isOpen,
  handleCloseModal,
  examData,
  setExamData,
  mutation: examMutation,
}: IAddEditExamPropSchema) => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(examConfigSchema),
  });
  const getOption = ({
    options,
    label,
  }: {
    options: IAgentTypeOptionSchema[];
    label: string;
  }) => {
    return (
      options?.find((opt: IAgentTypeOptionSchema) => opt?.label === label) || {
        label: "POSP",
        value: 5,
        tooltip:
          "Authorized to sell specific, pre-approved simple insurance products. \nRequires CKYC, payment, and 15 hrs mandatory training. Exam taken here itself.",
      }
    );
  };

  useEffect(() => {
    if (examData?.data) {
      reset({
        type: getOption({
          options: AGENT_TYPE_OPTIONS,
          label: examData?.data?.type,
        }),
        number_of_questions: examData?.data?.number_of_questions,
        passing_percentage: examData?.data?.passing_percentage,
        exam_time: examData?.data?.exam_time,
        exam_type: getOption({
          options: [
            { label: "Round Robin", value: "Round Robin" },
            { label: "Set Wise", value: "Set Wise" },
          ],
          label: examData?.data?.exam_type,
        }),
      });
    }
  }, [examData?.data, reset]);

  const onSubmit = (data: any) => {
    const payload = {
      id: examData?.data?.id,
      type: data.type?.value,
      number_of_questions: data.number_of_questions,
      passing_percentage: data.passing_percentage,
      exam_time: data.exam_time,
      exam_type: data.exam_type?.value,
    };
    examMutation.mutateAsync(payload).then((res) => {
      if (res.status == 200) {
        setExamData({ title: "", data: null });
        handleCloseModal();
      }
    });
  };
  return (
    <UiModalContainer
      isOpen={isOpen}
      isLoading={examMutation?.isPending}
      headSection={
        <div className="w-1/2 flex gap-2 items-start">
          <NotebookPen className="size-7 text-primary mt-1" />
          <div className="flex flex-col">
            <h1 className="text-base text-primary">{examData?.title}</h1>
            <p className="text-xs text-body">here we can config exam details</p>
          </div>
        </div>
      }
      containerClass="w-[650px]"
      handleCloseModal={handleCloseModal}>
      <div>
        <form onSubmit={handleSubmit(onSubmit)} className="">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="">
              <Dropdown
                name="type"
                placeholder={"Select User Type for Exam Configuration"}
                label="User Type"
                isRequired={true}
                errors={errors}
                control={control}
                options={AGENT_TYPE_OPTIONS}
                isDisabled={true}
                defaultValue={{
                  label: "POSP",
                  value: 5,
                  tooltip:
                    "Authorized to sell specific, pre-approved simple insurance products. \nRequires CKYC, payment, and 15 hrs mandatory training. Exam taken here itself.",
                }}
                // helperText="Select the category of insurance exam"
              />
            </div>
            <div className="">
              <Input
                inputRef={register("number_of_questions")}
                name="number_of_questions"
                label="Number of Questions"
                errors={errors}
                min={10}
                max={200}
                maxLength={3}
                onChange={allowOnlyNumbers}
                helperText="Range: 10-200 questions"
              />
            </div>
            <div className="">
              <Input
                inputRef={register("passing_percentage")}
                name="passing_percentage"
                label="Passing Percentage"
                errors={errors}
                watch={watch}
                maxLength={3}
                onChange={allowOnlyNumbers}
                helperText="Range: 35-100%"
              />
            </div>
            <div className="">
              <Input
                inputRef={register("exam_time")}
                name="exam_time"
                label="Exam Time"
                errors={errors}
                onChange={allowOnlyNumbers}
                maxLength={3}
                helperText="Set the total time allowed for the exam in minutes"
              />
            </div>
            <div className="">
              <Dropdown
                name="exam_type"
                label="Exam Type"
                errors={errors}
                isRequired={true}
                control={control}
                placeholder={"Select How the Exam questions are selected"}
                options={[
                  {
                    label: "Round Robin",
                    value: "Round Robin",
                  },
                  {
                    label: "Set Wise",
                    value: "Set Wise",
                  },
                ]}
                // helperText="Select the category of insurance exam"
              />
            </div>

            <div className="mt-8 flex flex-col   items-end space-y-4 sm:space-y-0 sm:space-x-4">
              <Button
                type="submit"
                width={"auto"}
                // disabled={hasErrors}
                className={`w-full sm:w-auto px-8 py-2 flex bg-primary items-center justify-center rounded-md text-white transition-all duration-200 `}>
                Submit Configuration
              </Button>
            </div>
          </div>
        </form>
      </div>
    </UiModalContainer>
  );
};

export default ExamConfigEditModal;
