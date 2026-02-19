import { useForm } from "react-hook-form";
import Button from "@/UI-Components/Button";
import Input from "@/UI-Components/Input";
import { useAddUrlConfig, useUpdateUrlConfig } from "../Service";
import { useEffect } from "react";

const AddURLForm = ({ setOpenModal, rowData }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (rowData?.data) {
      reset(rowData.data);
    }
  }, [rowData.data]);

  const { mutate: addConfig } = useAddUrlConfig(setOpenModal);
  const { mutate: updateConfig } = useUpdateUrlConfig(setOpenModal);

  const onSubmit = (data) => {
    rowData?.data?.credential_id && rowData.title === "Edit"
      ? updateConfig(data)
      : addConfig(data);
  };
  return (
    <div className="p-4">
      <form onSubmit={handleSubmit(onSubmit)} className=" space-y-4">
        <div className="space-y-2">
          <Input
            inputRef={register("credential_label")}
            name={"credential_label"}
            label={"Enter Credential Label"}
            isRequired
            errors={errors}
            control={control}
            placeholder={"Enter Credential label"}
          />
        </div>
        <div className="space-y-2">
          <Input
            inputRef={register("credential_key")}
            name={"credential_key"}
            label={"Credential Key"}
            isRequired
            errors={errors}
            control={control}
            type={"tel"}
            placeholder={"Enter your Credential Key"}
          />
        </div>
        <div className="space-y-2">
          <Input
            inputRef={register("credential_value")}
            name={"credential_value"}
            label={"Enter Value"}
            isRequired
            errors={errors}
            control={control}
            placeholder={"Enter your Value"}
          />
        </div>
        <div className="space-y-2">
          <Input
            inputRef={register("enviroment")}
            name={"enviroment"}
            label={"Enter Environment"}
            isRequired
            errors={errors}
            control={control}
            placeholder={"Enter your environment"}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" width={"auto"}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddURLForm;
