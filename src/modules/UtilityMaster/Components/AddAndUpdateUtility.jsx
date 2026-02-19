import { useForm } from "react-hook-form";
import Input from "@/UI-Components/Input";
import { useEffect } from "react";
import Button from "@/UI-Components/Button";
import { useUpdateUtility } from "../service";

const AddAndUpdateUtility = ({ data, setOpenModal }) => {
  const { register, errors, control, reset, handleSubmit } = useForm();

  const { mutate } = useUpdateUtility(setOpenModal);

  useEffect(() => {
    if (data) {
      reset(data);
    }
  }, [data]);

  const onSubmit = (data) => {
    mutate(data);
  };
  return (
    <div className="p-4">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Input
            inputRef={register("stage_name")}
            name={"stage_name"}
            label={"Stage Name"}
            isRequired
            errors={errors}
            control={control}
            placeholder={"Enter your stage name"}
          />
        </div>
        <div className="space-y-2">
          <Input
            inputRef={register("stage_identifier")}
            name={"stage_identifier"}
            label={"Stage Identifier"}
            errors={errors}
            control={control}
            placeholder={"Enter your stage identifier"}
            readOnly
          />
        </div>
        <div className="space-y-2 flex items-center justify-end">
          <Button variant="contained" type="submit" className="w-full mt-4">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddAndUpdateUtility;
