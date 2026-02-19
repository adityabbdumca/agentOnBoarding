import { useForm } from "react-hook-form";
import { ICONS } from "@/constants/ICONS";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import Dropdown from "@/UI-Components/Dropdown";
import Input from "@/UI-Components/Input";
import { HiOutlineRefresh } from "react-icons/hi";
import ExamConfigPreview from "./Components/ExamConfigPreview";
import Button from "@/UI-Components/Button";
import { AGENT_TYPE_OPTIONS, examConfigSchema } from "./ExamConfigConstants";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAddExamConfig } from "./Service";
import { StyledModal } from "@/UI-Components/GlobalStyles";
import { allowOnlyNumbers } from "@/HelperFunctions/helperFunctions";
const ExamConfigIndex = ({ drawerObj, setDrawerObj }) => {
  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(examConfigSchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      type: null,
      number_of_questions: "10",
      passing_percentage: "60",
      exam_time: "60",
    },
  });

  const { mutate } = useAddExamConfig(setDrawerObj);

  const handleReset = () => {
    reset({
      type: null,
      number_of_questions: 10,
      passing_percentage: 60,
      exam_time: 60,
    });
  };

  const onSubmit = (data) => {
    const payload = {
      type: data.type?.value,
      number_of_questions: data.number_of_questions,
      passing_percentage: data.passing_percentage,
      exam_time: data.exam_time,
      exam_type: data.exam_type?.value,
    };
    mutate(payload);
    // Here you can handle the form submission, e.g., send data to an API
  };
  return (
    <StyledModal>
      <div>
        <div className="bg-white overflow-hidden ">
          <div className=" p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">Configure Agent Exam</h2>
            <p className="mt-2 text-slate-600 ">
              Set the parameters for your Insurance Agent qualification exam.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="grid md:grid-cols-2 gap-4 space-y-2">
              <div>
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
              </div>

              <div>
                <ExamConfigPreview watch={watch} />
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                type="button"
                onClick={handleReset}
                className="w-full text-sm sm:w-auto px-6 py-2 flex items-center justify-center bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-all duration-200 cursor-pointer"
              >
                <HiOutlineRefresh size={18} className="mr-2" />
                Reset to Default
              </button>

              <Button
                type="submit"
                width={"auto"}
                // disabled={hasErrors}
                className={`w-full sm:w-auto px-8 py-2 flex bg-primary items-center justify-center rounded-md text-white transition-all duration-200 `}
              >
                Submit Configuration
              </Button>
            </div>
          </form>
        </div>
      </div>
    </StyledModal>
  );
};

export default ExamConfigIndex;
