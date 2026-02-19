import { AGENT_TYPE_OPTIONS } from "@/modules/Exam-Config/ExamConfigConstants";
import { Button, Dropdown, Input, RadioButton } from "@/UI-Components";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import { useForm, Controller } from "react-hook-form";
import Toggle from "./ToggleButton";
import UiButton from "@/UI-Components/Buttons/UiButton";
import { usePaymentWaiver } from "../hooks/usePaymentWaiver";
import { User, Phone, FileSearch, Minus, Plus } from "lucide-react";

const AddEditPaymentWaiverModal = ({ setRoleOpen }) => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      payment_waiver_status: "1",
      is_way_of: false,
      type: "",
      search_value: "",
    },
  });

  const paymentWaiverSelect = watch("payment_waiver_status");

  const {
    states: { curentNumber, upDateNumber },
    mutations: { createPaymentWaiverMutation },
    functions: { handlePaymentWaiverSubmit, clearSearchData },
    searchApplnData,
  } = usePaymentWaiver({ setRoleOpen });
  const selectedType = watch("type");
  const isNewAgentType = selectedType?.label?.toLowerCase() === "fresh";

  const renderRepaymentToggle = (
    <div className="flex mt-3 gap-2">
      <div className="text-sm flex-1 justify-start font-medium text-gray-700 mr-2">
        Payment To Be Taken
      </div>
      <div className="flex-1 justify-start">
        <Controller
          name="is_way_of"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Toggle value={value} onChange={onChange} />
          )}
        />
      </div>
    </div>
  );

  const renderNumberOfTaken = (
    <div className="flex mt-6 gap-2 items-center">
      <div className="text-sm flex-1 justify-start font-medium text-gray-700">
        Re-attempts
      </div>
      <div className="flex-1 justify-start space-x-2 whitespace-nowrap">
        <div className="flex items-center">
          <UiButton
            icon={<Minus size={16} />}
            buttonType="secondary"
            onClick={() => upDateNumber(Math.max(1, curentNumber - 1))}
            className="px-2 py-1 text-primary border rounded-full border-lightGray"
          />
          <span className="font-semibold min-w-[20px] text-center">
            {curentNumber}
          </span>
          <UiButton
            icon={<Plus size={16} />}
            buttonType="secondary"
            onClick={() => upDateNumber(curentNumber + 1)}
            className="px-2 py-1 text-primary border rounded-full border-lightGray"
          />
        </div>
      </div>
    </div>
  );

  const renderBottomButtons = (
    <div className="flex justify-between mt-10">
      <UiButton
        text="Cancel"
        buttonType="secondary"
        onClick={() => setRoleOpen(false)}
        className="p-2 text-primary"
      />
      <UiButton
        text="Submit"
        buttonType="primary"
        type="submit"
        isLoading={createPaymentWaiverMutation?.isPending}
        className="p-2"
      />
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit(handlePaymentWaiverSubmit)}
      className="space-y-4 p-6"
    >
      <div className="grid gap-4">
        <RadioButton
          label="Select Payment"
          name="payment_waiver_status"
          options={[
            { label: "Select Type", value: "1" },
            { label: "Individual", value: "0" },
          ]}
          control={control}
          errors={errors}
        />

        {paymentWaiverSelect === "1" && (
          <div className="space-y-3">
            <Dropdown
              label="Select Type"
              placeholder="Select Agent Type"
              name="type"
              isRequired={true}
              control={control}
              options={AGENT_TYPE_OPTIONS}
              errors={errors}
            />
            {selectedType && (
              <>
                {renderRepaymentToggle}
                {isNewAgentType && renderNumberOfTaken}
              </>
            )}
            {renderBottomButtons}
          </div>
        )}

        {paymentWaiverSelect === "0" && (
          <div className="space-y-4">
            <Controller
              name="search_value"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Search with Application Number"
                  placeholder="Search with Application Number"
                  maxLength={100}
                  isRequired={true}
                  icon={<FileSearch size={18} />}
                  onChange={(e) => {
                    const filteredValue = e.target.value.replace(
                      /[^a-zA-Z0-9]/g,
                      ""
                    );
                    field.onChange(filteredValue);
                    clearSearchData();
                  }}
                />
              )}
            />

            {searchApplnData?.return_data ? (
              <>
                <div className="mt-2 p-4 rounded-lg bg-gray-50 border border-gray-200 shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <User size={16} className="text-primary" />
                    <span>
                      <strong>Name:</strong>{" "}
                      {searchApplnData.return_data.first_name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <Phone size={16} className="text-primary" />
                    <span>
                      <strong>Mobile:</strong>{" "}
                      {searchApplnData.return_data.mobile}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-800">
                    <FileSearch size={16} className="text-primary" />
                    <span>
                      <strong>Application No:</strong>{" "}
                      {searchApplnData.return_data.application_number}
                    </span>
                  </div>
                </div>
                {renderRepaymentToggle}
                {renderNumberOfTaken}
                {renderBottomButtons}
              </>
            ) : (
              <div className="flex justify-between mt-8">
                <UiButton
                  text="Cancel"
                  buttonType="secondary"
                  onClick={() => setRoleOpen(false)}
                  className="p-2 text-primary"
                />
                <ButtonWrapper>
                  <Button width="auto" type="submit">
                    Search
                  </Button>
                </ButtonWrapper>
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
};

export default AddEditPaymentWaiverModal;
