import { Controller, useForm } from "react-hook-form";
import Button from "@/UI-Components/Button";
import Input from "@/UI-Components/Input";
import Dropdown from "@/UI-Components/Dropdown";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { useGetIFSCCode, useSendPaymentPayload } from "../service";
import { toast } from "react-toastify";
import {
  allowOnlyNumbers,
  handleIFSCInput,
} from "@/HelperFunctions/helperFunctions";
import UiDateInput from "@/UI-Components/UiDateInput";
const schema = Yup.object().shape({
  payment_type: Yup.mixed().required("Payment Type is required"),
  number: Yup.string()
    .required("Cheque Number is required")
    .matches(/^[0-9]+$/, "Only numbers are allowed")
    .min(6, "Minimum 6 characters required")
    .max(9, "Maximum 9 characters allowed"),
  date_of_payment: Yup.string().required("Date of Payment is required"),
  bank_name: Yup.string().required("Bank Name is required"),
  bank_ifsc: Yup.string().required("Bank IFSC Code is required"),
  branch_name: Yup.string().required("Branch Name is required"),
});

const OfflinePayment = ({ offlinePaymentMutate, id }) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
    clearErrors,
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: {
      // payment_type: {
      //   label: "Cheque",
      //   value: "Cheque",
      // },
    },
  });

  const { payment_type } = watch();
  const bank_ifsc = watch("bank_ifsc");
  const { data: ifscCode, mutate: getIFSCCode } = useGetIFSCCode({
    enabled: false,
  });

  // const { data: userdata } = useGetData();
  // const user_id = userdata?.data?.profile?.user_id;
  useEffect(() => {
    if (bank_ifsc?.length === 11) {
      getIFSCCode(
        { ifscCode: bank_ifsc },
        {
          onSuccess: (res) => {
            toast.success(res?.data?.message);
          },
          onError: (res) => {
            toast.error(res?.data?.message);
          },
        }
      );
    }
  }, [bank_ifsc]);

  const onSubmit = (data) => {
    const payload = {
      id: id || "",
      payment_method: data.payment_type.value,
      reference_number: data.number,
      payment_date: data.date_of_payment,
      ifsc_code: data.bank_ifsc,
      bank_name: data.bank_name,
      branch_name: data.branch_name,
      source: "Offline",
    };
    offlinePaymentMutate(payload);
  };

  useEffect(() => {
    if (ifscCode?.data?.bankDetails) {
      setValue("bank_name", ifscCode?.data?.bankDetails?.bank_name);
      setValue("branch_name", ifscCode?.data?.bankDetails?.bank_branch);
      clearErrors("bank_name");
      clearErrors("branch_name");
    }
  }, [ifscCode?.data?.bankDetails]);
  return (
    <div className="p-5 bg-white rounded-lg overflow-y-auto ">
      <form onSubmit={handleSubmit(onSubmit)} className=" space-y-4">
        <section className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Dropdown
              name={"payment_type"}
              label={"Payment Type"}
              isRequired
              errors={errors}
              control={control}
              options={[
                { label: "Cheque", value: "Cheque" },
                { label: "Demand Draft(DD)", value: "Demand Draft(DD)" },
              ]}
              placeholder={"Select Payment type"}
              onChange={(value) => {
                reset({
                  payment_type: value,
                  number: "",
                  date_of_payment: "",
                  bank_ifsc: "",
                  bank_name: "",
                  branch_name: "",
                });
              }}
            />
          </div>
          <div className="space-y-2">
            {payment_type && (
              <Input
                inputRef={register("number")}
                name={"number"}
                label={`${payment_type?.label || "Cheque"} Number`}
                isRequired
                errors={errors}
                control={control}
                placeholder={`Enter ${payment_type?.label || "Cheque"} Number`}
                minLength={6}
                maxLength={9}
                onChange={allowOnlyNumbers}
              />
            )}
          </div>
          <div className="space-y-2">
            <Controller
              control={control}
              name={"date_of_payment"}
              defaultValue=""
              rules={{ required: "date of payment is required" }}
              render={({ field, fieldState }) => (
                <UiDateInput
                  placeholder={`Enter ${payment_type?.label || "Cheque"} Date`}
                  label={` ${payment_type?.label || "Date"} Date`}
                  value={field.value}
                  onChange={field.onChange}
                  isRequired={true}
                  errors={fieldState?.error?.message}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Input
              inputRef={register("bank_ifsc")}
              name={"bank_ifsc"}
              label="Bank IFSC Code"
              errors={errors}
              control={control}
              placeholder={"Enter Bank IFSC Code"}
              isRequired
              onChange={(e) => {
                const value = e.target.value;
                handleIFSCInput(e);
                if (!value || value.length < 11) {
                  setValue("bank_name", "");
                  setValue("bank_city", "");
                  setValue("branch_name", "");
                }
              }}
            />
          </div>
          <div className="space-y-2">
            <Input
              inputRef={register("bank_name")}
              name={"bank_name"}
              label="Bank Name"
              errors={errors}
              control={control}
              placeholder={"Enter Bank Name"}
              isRequired
              disabled
            />
          </div>
          <div className="space-y-2">
            <Input
              inputRef={register("branch_name")}
              name={"branch_name"}
              label="Branch Name"
              errors={errors}
              control={control}
              placeholder={"Enter Branch Name"}
              isRequired
              disabled
            />
          </div>
        </section>
        <div className="flex items-center justify-end mx-auto">
          <Button type="submit" width={"auto"}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default OfflinePayment;
