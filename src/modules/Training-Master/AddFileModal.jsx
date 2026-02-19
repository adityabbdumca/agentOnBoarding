import { useEffect } from "react";
import { StyledModal } from "@/UI-Components/GlobalStyles";
import Dropdown from "@/UI-Components/Dropdown";
import { useForm } from "react-hook-form";
import Button from "@/UI-Components/Button";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAddAndUpdateTrainingTime } from "./service";
import { AGENT_TYPE_OPTIONS } from "../Exam-Config/ExamConfigConstants";
import Input from "@/UI-Components/Input";

const AddFileModal = ({ setOpen, open }) => {
  const schema = Yup.object({
    agent_type: Yup.mixed().required("Agent Type is required"),
    training_time: Yup.string()
      .required("Training Time is required")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Enter time in HH:MM format"),
  });
  const { mutate } = useAddAndUpdateTrainingTime(setOpen);
  // const { mutate: updateFile } = useUpdateTrainingDocument();
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    register,
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (open?.data && open?.modalTitle === "Edit Training") {
      reset({
        agent_type: {
          label: open?.data?.agent_type_name,
          value: open?.data?.agent_type_id,
        },
        training_time: String(open?.data?.training_time ?? ""),
      });
    }
  }, [open?.data]);

  const onSubmit = (data) => {
    mutate({
      ...open?.data,
      training_time: data?.training_time?.replace(":", ""),
      agent_type_id: data?.agent_type?.value,
      agent_type_name: data?.agent_type?.label,
    });
  };
  return (
    <StyledModal>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Dropdown
              control={control}
              options={AGENT_TYPE_OPTIONS}
              watch={watch}
              errors={errors}
              name={"agent_type"}
              label={"Agent Type"}
              placeholder={"Select Agent Type"}
              isRequired
              isMulti={false}
            />
          </div>
          <div>
            <Input
              control={control}
              watch={watch}
              errors={errors}
              inputRef={register("training_time")}
              name={"training_time"}
              label={"Training Time"}
              placeholder={"Enter Training Time"}
              isRequired
              onChange={(e) => {
                let value = e.target.value.replace(/[^\d]/g, "");
                if (value.length >= 3) {
                  value = `${value.slice(0, 2)}:${value.slice(2, 4)}`;
                }
                e.target.value = value.slice(0, 5);
              }}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-4">
          <Button type="submit" variant="contained" width={"auto"}>
            Submit
          </Button>
        </div>
      </form>
    </StyledModal>
  );
};

export default AddFileModal;
