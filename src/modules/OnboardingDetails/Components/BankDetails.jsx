import {
  allowOnlyName,
  allowOnlyNumbers,
  handleIFSCInput,
} from "@/HelperFunctions/helperFunctions";
import Button from "@/UI-Components/Button";
import UiButton from "@/UI-Components/Buttons/UiButton";
import Dropdown from "@/UI-Components/Dropdown";
import Input from "@/UI-Components/Input";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  HiArrowNarrowLeft,
  HiArrowNarrowRight,
  HiOutlineRefresh,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { decrementAgent } from "../agent.slice";
import { useBankDetails, useGetIFSCCode } from "../service";
import BankOCRModal from "./BankOCRModal";

const BankDetails = ({
  control,
  handleSubmit,
  watch,
  setValue,
  register,
  resetField,
  errors,
  id,
  clearErrors,
  showSubmitButton,
  userData,
}) => {
  const [isBankOCRModalOpen, toggleIsBankOCRModal] = useState(false);

  const { mutate, isPending } = useBankDetails();
  const { data: ifscCode, mutate: getIFSCCode } = useGetIFSCCode();
  const { agent } = useSelector((state) => state.agent);
  const verticalId = +localStorage.getItem("vertical_id");
  const dispatch = useDispatch();
  const isPaymentCompleted = userData?.payment_status;

  useEffect(() => {
    if (watch("bank.ifsc_code")?.length === 11) {
      getIFSCCode({ ifscCode: watch("bank.ifsc_code") });
    }
  }, [watch("bank.ifsc_code")]);

  useEffect(() => {
    if (ifscCode?.data?.bankDetails) {
      setValue("bank.bank_name", ifscCode?.data?.bankDetails?.bank_name);
      setValue("bank.bank_city", ifscCode?.data?.bankDetails?.bank_city);
      setValue("bank.branch_name", ifscCode?.data?.bankDetails?.bank_branch);
      clearErrors("bank.bank_name");
      clearErrors("bank.bank_city");
      clearErrors("bank.branch_name");
    }
  }, [ifscCode?.data?.bankDetails]);

  const firstName = watch("profile.first_name");
  const middleName = watch("profile.middle_name");
  const lastName = watch("profile.last_name");

  const nameinAsBankAccount = userData?.bank?.name_as_in_bank_acount;

  const onSubmit = (data) => {
    mutate(
      {
        ...data.bank,
        id,
        account_type: data.bank.account_type?.value,
        bank_account_number: data.bank.bank_account_number,
      },
      {
        onSuccess: (response) => {
          if (response?.status === 200) {
            resetField("name_as_in_bank_acount", "");
          }
        },
      }
    );
  };

  useEffect(() => {
    const fullName = [firstName, middleName, lastName]
      .filter(Boolean)
      .join(" ");

    if (!nameinAsBankAccount) {
      if (fullName) {
        setValue("bank.name_as_in_bank_acount", fullName);
      }
    } else {
      setValue("bank.name_as_in_bank_acount", nameinAsBankAccount);
    }
  }, [nameinAsBankAccount, firstName, middleName, lastName, setValue]);

  return (
    <div className="flex flex-col gap-6">
      {![1, 2].includes(verticalId) && !isPaymentCompleted && (
        <div className=" p-2 rounded-md  bg-lightGray/30 flex justify-between items-center">
          <span className="text-sm text-primary font-semibold">
            Upload your bank document
          </span>
          <UiButton
            text={"Upload"}
            className="px-4 flex flex-row-reverse"
            icon={<Plus className="size-4" />}
            onClick={() => toggleIsBankOCRModal(true)}
          />
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <div
          data-id={!!id}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 data-[id=true]:grid-cols-2 gap-4">
          <div>
            <Dropdown
              name="bank.account_type"
              control={control}
              label="Account Type"
              placeholder="Select Account Type"
              defaultValue={{ label: "Savings", value: "Savings" }}
              isRequired={true}
              errors={errors}
              options={[
                { label: "Savings", value: "Savings" },
                { label: "Current", value: "Current" },
              ]}
            />
          </div>

          <div>
            <Input
              label="Name as in Bank Account"
              inputRef={register("bank.name_as_in_bank_acount")}
              placeholder="Enter Name as in Bank Account"
              isRequired={true}
              errors={errors}
              maxLength={100}
              name="bank.name_as_in_bank_acount"
              onChange={allowOnlyName}
            />
          </div>

          <div>
            <Input
              autoComplete="one-time-code"
              label="Bank Account Number"
              inputRef={register("bank.bank_account_number")}
              placeholder="Enter Bank Account Number"
              isRequired={true}
              errors={errors}
              maxLength={20}
              name="bank.bank_account_number"
              type="tel"
              onChange={(e) => (e.target.value = allowOnlyNumbers(e))}
            />
          </div>

          <div>
            <Input
              label="Re-Enter Bank Account Number"
              inputRef={register("bank.re_enter_bank_account_number")}
              placeholder="Re-Enter Bank Account Number"
              isRequired={true}
              maxLength={20}
              errors={errors}
              onPaste={(e) => e.preventDefault()}
              name="bank.re_enter_bank_account_number"
              type="tel"
              onChange={(e) => (e.target.value = allowOnlyNumbers(e))}
            />
          </div>

          <div>
            <Input
              label="IFSC Code"
              inputRef={register("bank.ifsc_code")}
              placeholder="Enter IFSC Code"
              maxLength={11}
              isRequired={true}
              errors={errors}
              onChange={(e) => {
                const value = e.target.value;
                handleIFSCInput(e);
                if (!value || value.length < 11) {
                  setValue("bank.bank_name", "");
                  setValue("bank.bank_city", "");
                  setValue("bank.branch_name", "");
                }
              }}
              name="bank.ifsc_code"
            />
          </div>

          <div>
            <Input
              label="Bank Name"
              inputRef={register("bank.bank_name")}
              placeholder="Enter Bank Name"
              isRequired={true}
              errors={errors}
              readOnly={true}
              name="bank.bank_name"
            />
          </div>

          <div>
            <Input
              label="Bank City"
              inputRef={register("bank.bank_city")}
              placeholder="Enter Bank City"
              isRequired={true}
              errors={errors}
              readOnly={true}
              name="bank.bank_city"
            />
          </div>

          <div>
            <Input
              label="Branch Name"
              inputRef={register("bank.branch_name")}
              placeholder="Enter Branch Name"
              isRequired={true}
              errors={errors}
              readOnly={true}
              name="bank.branch_name"
            />
          </div>
        </div>

        <div className="mt-4 flex justify-between gap-2">
          {agent > 0 ? (
            <Button
              startIcon={<HiArrowNarrowLeft size={15} />}
              variant={"outlined"}
              width={"auto"}
              onClick={() => dispatch(decrementAgent())}>
              Back
            </Button>
          ) : (
            <div />
          )}
          {showSubmitButton && (
            <Button
              type="submit"
              width={"auto"}
              disabled={isPending}
              isLoading={isPending}
              endIcon={
                isPending ? (
                  <HiOutlineRefresh className="animate-spin" size={15} />
                ) : (
                  <HiArrowNarrowRight size={15} />
                )
              }>
              {watch("approval_access") ? "Next" : "Submit"}
            </Button>
          )}
        </div>
      </form>

      <BankOCRModal
        isOpen={isBankOCRModalOpen}
        handleClose={() => toggleIsBankOCRModal(false)}
      />
    </div>
  );
};

export default BankDetails;
