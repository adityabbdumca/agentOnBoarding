import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { AGENT_TYPE_OPTIONS, examConfigSchema } from "../ExamConfigConstants";
import { Button, Dropdown, Input } from "@/UI-Components";
import { useAddExamConfig } from "../Service";
import { allowOnlyNumbers } from "@/HelperFunctions/helperFunctions";

const ExamConfigEdit = ({ row, setEdit, setDrawerObj }) => {
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
  const getOption = (options, label) => {
    return options.find((opt) => opt.label === label) || null;
  };
  const { mutate: editConfigEdit } = useAddExamConfig(setDrawerObj, setEdit);
  useEffect(() => {
    if (row) {
      reset({
        type: getOption(AGENT_TYPE_OPTIONS, row.type),
        number_of_questions: row.number_of_questions,
        passing_percentage: row.passing_percentage,
        exam_time: row.exam_time,
        exam_type: getOption(
          [
            { label: "Round Robin", value: "Round Robin" },
            { label: "Set Wise", value: "Set Wise" },
          ],
          row.exam_type
        ),
      });
    }
  }, [row, reset]);
  const onSubmit = (data) => {
    const payload = {
      id: row?.id,
      type: data.type?.value,
      number_of_questions: data.number_of_questions,
      passing_percentage: data.passing_percentage,
      exam_time: data.exam_time,
      exam_type: data.exam_type?.value,
    };
    // mutate(payload);
    editConfigEdit(payload);
  };
  return (
    <div>
      {" "}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="grid md:grid-cols-2 gap-2">
          <div className="my-3">
            <Dropdown
              name="type"
              placeholder={"Select User Type for Exam Configuration"}
              label="User Type"
              isRequired={true}
              errors={errors}
              control={control}
              options={AGENT_TYPE_OPTIONS}
              // helperText="Select the category of insurance exam"
            />
          </div>
          <div className="my-3">
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
          <div className="my-3">
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
          <div className="my-3">
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
          <div className="my-3">
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
              className={`w-full sm:w-auto px-8 py-2 flex bg-primary items-center justify-center rounded-md text-white transition-all duration-200 `}
            >
              Submit Configuration
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ExamConfigEdit;
