import Dropdown from "@/UI-Components/Dropdown";
import { useForm } from "react-hook-form";
import { AGENT_TYPE_OPTIONS } from "../Exam-Config/ExamConfigConstants";
import Input from "@/UI-Components/Input";
import FilePicker from "@/UI-Components/FilePicker";
import { StyledModal } from "@/UI-Components/GlobalStyles";
import Button from "@/UI-Components/Button";
import { useAddTrainingDocument } from "./service";
import { useEffect } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
//  Yup schema
const addFileDocumentSchema = Yup.object().shape({
  agent_type: Yup.object().nullable().required("Agent Type is required"),
  training_type: Yup.object().nullable().required("Training Type is required"),
  document_name: Yup.string().trim().required("Document Name is required"),
  link_path: Yup.string().when("training_type.value", {
    is: "link",
    then: (schema) =>
      schema.url("Enter a valid URL").required("Link Path is required"),
  }),
  pdf_path: Yup.mixed().when("training_type.value", {
    is: "pdf",
    then: (schema) =>
      schema
        .required("PDF is required")
        .test("file-type", "Only PDF allowed", (value) => {
          if (!value) return false;
          const file = Array.isArray(value) ? value[0] : value;
          return file?.type === "application/pdf";
        }),
  }),
});

const AddFileDocument = ({ open, setOpen }) => {
  const {
    control,
    watch,

    setValue,
    clearErrors,
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addFileDocumentSchema),
  });

  const { mutate } = useAddTrainingDocument(setOpen);

  useEffect(() => {
    if (open?.data && open?.modalTitle === "Edit") {
      reset({
        agent_type: {
          label: open?.data?.agent_type_name,
          value: open?.data?.agent_type_id,
        },
        training_type: {
          label: open?.data?.training_type,
          value: open?.data?.training_type,
        },
        document_name: open?.data?.document_name,
        link_path: open?.data?.link_path,
        pdf_path: open?.data?.pdf_path,
      });
    }
  }, [open?.data]);

  const onSubmit = (data) => {
    mutate({
      id: open?.data?.id,
      agent_type_id: data?.agent_type?.value,
      agent_type_name: data?.agent_type?.label.toLowerCase(),
      training_type: data?.training_type?.value,
      document_name: data?.document_name,
      link_path: data?.link_path,
      pdf_path: Array.isArray(data.pdf_path) ? data.pdf_path[0] : data.pdf_path,
    });
  };

  return (
    <StyledModal>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Dropdown
              control={control}
              watch={watch}
              errors={errors}
              name={"agent_type"}
              label={"Agent Type"}
              options={AGENT_TYPE_OPTIONS}
              placeholder={"Select Agent Type"}
              isRequired
            />
          </div>
          <div>
            <Dropdown
              control={control}
              watch={watch}
              errors={errors}
              name={"training_type"}
              label={"Training Type"}
              options={[
                { label: "PDF", value: "pdf", id: 1 },
                { label: "Link", value: "link", id: 2 },
              ]}
              placeholder={"Select Training Type"}
              isRequired
            />
          </div>
          <div>
            <Input
              errors={errors}
              inputRef={register("document_name")}
              name={"document_name"}
              label={"Document Name"}
              isRequired
              placeholder={"Enter Document Name"}
            />
          </div>
          {watch("training_type")?.value === "link" ? (
            <div>
              <Input
                errors={errors}
                inputRef={register("link_path")}
                name={"link_path"}
                label={"Link Path"}
                placeholder={"Enter Link Path"}
                disable={!watch("training_type")}
                isRequired
              />
            </div>
          ) : (
            <div>
              <FilePicker
                errors={errors}
                clearErrors={clearErrors}
                control={control}
                watch={watch}
                setValue={setValue}
                name={"pdf_path"}
                disable={!watch("training_type")}
                isRequired
                label={"PDF Path"}
              />
            </div>
          )}
        </div>
        <div className="flex justify-end mt-4">
          <Button type={"submit"} width={"auto"}>
            Submit
          </Button>
        </div>
      </form>
    </StyledModal>
  );
};

export default AddFileDocument;
