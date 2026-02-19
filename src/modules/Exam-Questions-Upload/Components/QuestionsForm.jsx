import _ from "lodash";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { MdDelete } from "react-icons/md";
import Button from "@/UI-Components/Button";
import Dropdown from "@/UI-Components/Dropdown";
import { StyledModal } from "@/UI-Components/GlobalStyles";
import HierarchyFilePicker from "@/UI-Components/HierarchyFilePicker";
import Input from "@/UI-Components/Input";
import {
  NewTab,
  NewTabsWrapper,
  TabContainer,
} from "../../BranchOnboarding/Components/BranchForm";
import { AGENT_TYPE_OPTIONS } from "../../Exam-Config/ExamConfigConstants";
import {
  FormWrapper,
  HierarchyWrapper,
} from "../../Onboarding/Components/CreateOnboarding";
import {
  useAddBulkExamQuestions,
  useAddExamQuestions,
  useGetSampleQuestionExcel,
} from "../Service";
const QuestionsForm = ({ drawerObj, setDrawerObj }) => {
  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
    clearErrors,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      type: "",
      question: "",
      options: [{}, {}],
      correct: "",
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "options",
  });
  const [tabValue, setTabValue] = useState(0);
  const { mutate } = useAddExamQuestions(setDrawerObj);
  const { mutate: bulkUpload } = useAddBulkExamQuestions(setDrawerObj);

  const { data } = useGetSampleQuestionExcel(drawerObj);
  const demoExcel = data?.file_url;

  useEffect(() => {
    if (drawerObj?.data) {
      // Set question and correct answer
      setValue("question", drawerObj.data.question);
      setValue("correct", drawerObj.data.correct);

      // Build options array from API response
      const optionsArray = [];
      if (drawerObj.data.option1)
        optionsArray.push({ value: drawerObj.data.option1 });
      if (drawerObj.data.option2)
        optionsArray.push({ value: drawerObj.data.option2 });
      if (drawerObj.data.option3)
        optionsArray.push({ value: drawerObj.data.option3 });
      if (drawerObj.data.option4)
        optionsArray.push({ value: drawerObj.data.option4 });

      // Replace the options field array
      replace(optionsArray);
    }
  }, [drawerObj?.data, replace]);

  const onSubmit = (data) => {
    const payload = {
      ...(drawerObj.data?.question_id && { id: drawerObj.data?.question_id }),
      type: data.type?.value,
      question: data.question,
      correct: data.correct,
    };
    const options = data.options.reduce((acc, curr, index) => {
      acc["option" + (index + 1)] = curr.value;
      return acc;
    }, {});

    if (!_.isEmpty(data?.excel)) {
      bulkUpload({ type: data?.type?.value, file: data?.excel[0] });
    } else
      mutate({
        ...payload,
        ...options,
      });
  };
  return (
    <StyledModal>
      <div className="my-3">
        <h1 className="font-semibold text-lg">Add Questions</h1>
        <h3 className=" font-semibold text-sm text-gray-600">
          MCQ Configuration Portal
        </h3>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormWrapper>
          <div className="grid md:grid-cols-4 grid-cols-4 gap-4 space-y-2">
            <div className="my-3">
              <Dropdown
                name="type"
                placeholder={"Select User Type"}
                label="User Type"
                isRequired={true}
                errors={errors}
                control={control}
                options={AGENT_TYPE_OPTIONS}
              />
            </div>
          </div>
          <TabContainer>
            <NewTabsWrapper
              value={tabValue}
              onChange={(e, value) => setTabValue(value)}
              aria-label="basic tabs example"
            >
              <NewTab isActive={tabValue === 0} onClick={() => setTabValue(0)}>
                Manual Entry
              </NewTab>
              <NewTab isActive={tabValue === 1} onClick={() => setTabValue(1)}>
                Bulk Upload
              </NewTab>
            </NewTabsWrapper>
          </TabContainer>
          {tabValue === 0 ? (
            <>
              <div className="grid md:grid-cols-2 grid-cols-4 gap-4 space-y-2">
                <div className="col-span-2 mb-3 ">
                  <label
                    className="mb-2 pl-2 text-xs font-medium text-gray-700"
                    htmlFor="exampleFormControlTextarea1"
                  >
                    Add Question
                  </label>

                  <textarea
                    name={"question"}
                    {...register("question", { required: true })}
                    placeholder="Enter your Question here"
                    className="form-control p-2.5 border text-xs w-full border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ml-1"
                    id="exampleFormControlTextarea1"
                    rows="5"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">
                  Answer Options
                </span>
                <div className="flex gap-4 mt-2">
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-center gap-2">
                      <Input
                        type="text"
                        name={`option_${index}`}
                        inputRef={register(`options.${index}.value`)}
                        placeholder={`Option ${index + 1}`}
                      />
                      {fields.length > 2 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500 hover:text-red-700 text-sm cursor-pointer"
                        >
                          <MdDelete size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 ml-1">
                <Button
                  type="button"
                  variant="outlined"
                  width={"auto"}
                  onClick={() => append({ value: "" })}
                  disabled={fields.length === 4}
                >
                  Add Option
                </Button>

                <span className="text-xs text-gray-500">
                  {fields.length}/4 options
                </span>
              </div>
              <div className="grid md:grid-cols-4 grid-cols-4 gap-4 space-y-2">
                <div className="space-y-2 mt-4">
                  <Input
                    type="text"
                    inputRef={register("correct")}
                    name="correct"
                    label="Correct Answer"
                    errors={errors}
                    placeholder="Enter the correct answer here"
                  />
                </div>
              </div>
            </>
          ) : (
            <HierarchyFilePicker
              control={control}
              errors={errors}
              setValue={setValue}
              onSubmit={onSubmit}
              watch={watch}
              clearErrors={clearErrors}
              handleSubmit={handleSubmit}
              data={demoExcel}
              //   mutate={mutateFile}
            />
          )}
        </FormWrapper>
        <HierarchyWrapper>
          <Button type="submit" width={"auto"}>
            Submit
          </Button>
        </HierarchyWrapper>
      </form>
    </StyledModal>
  );
};

export default QuestionsForm;
