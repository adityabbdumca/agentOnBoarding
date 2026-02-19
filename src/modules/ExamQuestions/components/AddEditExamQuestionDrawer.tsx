import { dynamicAlphaNumeric } from "@/HelperFunctions/helperFunctions";
import { AGENT_TYPE_OPTIONS } from "@/modules/ExamListing/ExamConfigConstants";
import UiButton from "@/UI-Components/Buttons/UiButton";
import UiDrawerWrapper from "@/UI-Components/Drawer/UiDrawer";
import UiTextInput from "@/UI-Components/Input/UiTextInput";
import UiSelector from "@/UI-Components/Selector/UiSelector";
import UiTextArea from "@/UI-Components/UiTextArea";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { CORRECT_OPTIONS } from "../examQuestion.constant";
import {
  IAddEditExamFormSchema,
  OptionItem,
  OptionsPayload,
} from "../examQuestion.type";
const AddEditExamQuestionDrawer = ({
  isOpen,
  handleClose,
  addEditExamQuestionMutation,
  rowData,
}: {
  isOpen: boolean;
  handleClose: () => void;
  addEditExamQuestionMutation: any;
  rowData: any;
}) => {
  const methods = useForm<IAddEditExamFormSchema>({
    defaultValues: {
      type: {},
      question: "",
      options: [{}, {}],
      correct: {},
    },
  });
  const {
    control,
    reset,
    //  formState: { errors },
    handleSubmit,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const onSubmit = (data: IAddEditExamFormSchema) => {
    const payload = {
      ...(rowData.data?.question_id &&
        rowData?.title == "Add" && { id: rowData.data?.question_id }),
      user_type_id: data?.type?.value,
      question: data?.question,
      correct: data?.correct?.value,
    };

    const options: OptionsPayload = data?.options?.reduce<any>(
      (acc, curr: OptionItem, index: number) => {
        acc[`option${index + 1}`] = curr.value;
        return acc;
      },
      {}
    );

    if (rowData?.title === "Add") {
      addEditExamQuestionMutation
        .mutateAsync({
          ...payload,
          ...options,
        })
        .then(() => {
          handleClose();
        });
      return;
    }
    addEditExamQuestionMutation
      .mutateAsync({
        ...payload,
        ...options,
        question_id: rowData?.data?.question_id,
      })
      .then(() => {
        handleClose();
      });
  };

  useEffect(() => {
    if (rowData?.data) {
      reset({
        question: rowData?.data?.question,
        type: {
          label: "POSP",
          value: 5,
        },
        correct: CORRECT_OPTIONS?.find(
          (opt) => opt.value === rowData?.data?.correct?.label
        ),
        options: rowData?.data?.options,
      });
    }
  }, [rowData?.data]);
  return (
    <UiDrawerWrapper
      HeadSection={
        <div className="flex flex-col gap-6">
          <div className="my-3">
            <h1 className="font-semibold text-lg">{`${rowData?.title} Exam Question`}</h1>
            <h3 className=" font-semibold text-xs text-body">
              MCQ Configuration Portal
            </h3>
          </div>
        </div>
      }
      isOpen={isOpen}
      containerClass="w-[50%]"
      handleClose={handleClose}
      BackButtonComponent={true}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
          <UiTextArea
            name="question"
            label="Add Questions"
            placeholder="Enter your Question here"
            registerOptions={{
              onChange: (e: any) => {
                dynamicAlphaNumeric(e, ["_", "-", "?"], 100);
              },
              maxLength: {
                value: 100,
                message: "Question must not exceed 100 characters",
              },
              required: true,
            }}
          />
          <div className="flex flex-col gap-2">
            <section className="flex items-center justify-between px-2">
              <h2 className="text-sm font-semibold text-gray-700">
                Answer Options
              </h2>
              <div className="flex justify-between items-center">
                <UiButton
                  text="Add Option"
                  type="button"
                  buttonType="secondary"
                  onClick={() => {
                    append({ value: "" });
                  }}
                  icon={<Plus className="size-4" />}
                  isLoading={false}
                  disabled={false}
                  className="w-40 px-2 flex-row-reverse text-primary"
                />
              </div>
            </section>

            <section className="flex gap-4 mt-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <UiTextInput
                    label=""
                    name={`options.${index}.value`}
                    className=""
                    placeholder={`Option ${index + 1}`}
                  />
                  {fields.length > 2 && (
                    <UiButton
                      text={<></>}
                      type="button"
                      buttonType="tertiary"
                      onClick={() => {
                        remove(index);
                      }}
                      icon={<Trash2 className="size-4" />}
                      isLoading={false}
                      disabled={false}
                      className="text-red-500 hover:text-red-900 text-sm cursor-pointer"
                    />
                  )}
                </div>
              ))}
            </section>
            <div className="text-xs text-gray-500 w-full">
              <span className="flex justify-end">
                {fields.length}/4 options
              </span>
            </div>
          </div>
          <div className="w-full flex justify-between gap-4">
            <Controller
              control={control}
              name="correct"
              rules={{ required: "user type is Required" }}
              render={({ field: { onChange, value }, fieldState }) => (
                <UiSelector
                  label="Correct"
                  value={value}
                  onChange={onChange}
                  options={CORRECT_OPTIONS?.slice(0, fields?.length) || []}
                  accessorKey="label"
                  placeholder="Select correct option"
                  error={fieldState?.error?.message}
                  className="w-full"
                />
              )}
            />

            <Controller
              control={control}
              name="type"
              rules={{ required: "user type is Required" }}
              render={({ field: { onChange, value }, fieldState }) => (
                <UiSelector
                  label="User Type"
                  value={value}
                  onChange={onChange}
                  options={AGENT_TYPE_OPTIONS || []}
                  accessorKey="label"
                  placeholder="Select user type"
                  error={fieldState?.error?.message}
                  className="w-full"
                />
              )}
            />
          </div>
          <div className="flex justify-end absolute bottom-4 right-4">
            <UiButton
              text="Submit"
              type="submit"
              buttonType="primary"
              icon={<></>}
              isLoading={addEditExamQuestionMutation?.isPending}
              className="w-28"
            />
          </div>
        </form>
      </FormProvider>
    </UiDrawerWrapper>
  );
};

export default AddEditExamQuestionDrawer;
