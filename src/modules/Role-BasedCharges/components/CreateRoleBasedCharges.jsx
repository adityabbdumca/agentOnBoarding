import { Button, Dropdown, Input, RadioButton } from "@/UI-Components";
import { useForm } from "react-hook-form";
import { AGENT_TYPE_OPTIONS } from "@/modules/Exam-Config/ExamConfigConstants";
import { useEffect, useState } from "react";
import { useUpdateRoleCharges } from "../Service";
import { roleBasedSchema } from "@/modules/OnboardingDetails/Schema";
import { yupResolver } from "@hookform/resolvers/yup";

const CreateRoleBasedCharges = ({ rowData, setRoleOpen, setRoleTitle }) => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      payment_status: "0",
    },
    resolver: yupResolver(roleBasedSchema()),
  });
  const paymentStatus = watch("payment_status");
  const { mutate } = useUpdateRoleCharges(setRoleOpen);

  useEffect(() => {
    if (rowData) {
      const userType = AGENT_TYPE_OPTIONS.find(
        (item) => item.label.toLowerCase() === rowData.user_type.toLowerCase()
      );
      setValue("user_type", userType);
      setValue("payment_status", rowData.payment_status === "No" ? "0" : "1");
      setValue("payment_amount", rowData.payment_amount);
    }
  }, [rowData]);

  const onSubmit = (data) => {
   
    const payload = {
      ...data,

      user_type: data.user_type?.label,
      id: rowData?.id,
    };
    mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 p-4">
      <div className="grid  gap-3 grid-cols-1 ">
        <div>
          <Dropdown
            name="user_type"
            label="Select Agent Type"
            isRequired={true}
            control={control}
            errors={errors}
            options={AGENT_TYPE_OPTIONS}
            placeholder="Select Agent Type"
          />
        </div>

        <div>
          <RadioButton
            name="payment_status"
            label="Enable Payment"
            options={[
              { label: "Yes", value: "1" },
              { label: "No", value: "0" },
            ]}
            control={control}
          />
        </div>
        {paymentStatus == "1" && (
          <div>
            <Input
              name="payment_amount"
              label="Add Payment Amount"
              errors={errors}
              isRequired={true}
              placeholder="Add Payment Amount"
              inputRef={register("payment_amount")}
            />
          </div>
        )}
        <div className="flex items-center justify-end">
          <Button variant="contained" type="submit" width={"auto"}>
            Submit
          </Button>
        </div>
      </div>
    </form>
  );
};
export default CreateRoleBasedCharges;
