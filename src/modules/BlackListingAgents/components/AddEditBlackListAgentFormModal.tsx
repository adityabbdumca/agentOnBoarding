import { dynamicAlphaNumeric } from "@/HelperFunctions/helperFunctions";
import UiButton from "@/UI-Components/Buttons/UiButton";
import UiTextInput from "@/UI-Components/Input/UiTextInput";
import UiModalContainer from "@/UI-Components/Modals/UiModal";
import UiDateInput from "@/UI-Components/UiDateInput";
import { panValidation } from "@/utlities/input.utility";
import { onlyAlphabets } from "@/utlities/string.utlity";
import { ShieldBan } from "lucide-react";
import { DateTime } from "luxon";
import { Controller, FormProvider, useForm } from "react-hook-form";
import useAddEditBlackListAgent from "../hooks/useAddEditBlackListAgent";
import { useEffect } from "react";
import UiTextArea from "@/UI-Components/UiTextArea";

const AddEditBlackListAgentFormModal = ({
  isOpen,
  handleClose,
}: {
  isOpen: boolean;
  handleClose: () => void;
}) => {
  const formMethods = useForm({
    mode: "onChange",
  });
  const {
    services: { getSingleBlackListAgentService },
    functions: { handleAddEditBlackListAgent },
    mutations: { addBlackListMutations, updateBlackListMutations },
    routing: { editId },
  } = useAddEditBlackListAgent({ handleClose });
  const singleData = getSingleBlackListAgentService?.data?.data?.data;
  useEffect(() => {
    if (singleData) {
      formMethods.reset({
        name: singleData?.name,
        blacklisted_on:
          DateTime.fromISO(singleData?.blacklisted_on).toFormat("dd-MM-yyyy") ??
          "",
        reason: singleData?.reason,
        agency_code: singleData?.agency_code,
        pan_number: singleData?.pan_number,
      });
    }
  }, [getSingleBlackListAgentService?.data?.data?.data, editId]);

  return (
    <UiModalContainer
      isOpen={isOpen}
      handleCloseModal={handleClose}
      isLoading={false}
      containerClass="w-[550px]"
      headSection={
        <div className="flex gap-2 items-center">
          <ShieldBan className="size-8 text-primary" />
          <section className="flex flex-col">
            <h2 className="text-md font-semibold text-primary">
              Add BlackList Agent
            </h2>
            <p className="text-xs font-medium">
              Enter all the details to add blacklist agent
            </p>
          </section>
        </div>
      }>
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(handleAddEditBlackListAgent)}
          className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <UiTextInput
              name="name"
              containerClass="w-full"
              placeholder="Enter name"
              label="Name"
              registerOptions={{
                onChange: (e) => {
                  onlyAlphabets(e);
                },
              }}
            />
            <UiTextInput
              name="pan_number"
              containerClass="w-full"
              placeholder="Enter PAN number"
              label="PAN Number"
              registerOptions={{
                required: "PAN number is required",
                pattern: {
                  value: /^[A-Z]{3}P[A-Z][0-9]{4}[A-Z]{1}$/i,
                  message:
                    "Invalid PAN format. Please enter a valid 10-character PAN.",
                },
                onChange: (e) => {
                  panValidation(e);
                },
              }}
            />
            <UiTextInput
              name="agency_code"
              containerClass="w-full"
              placeholder="Enter Agency Code"
              label="Agency Code"
              registerOptions={{
                onChange: (e) => {
                  dynamicAlphaNumeric(e, ["-", "_"]);
                },
              }}
            />
            <Controller
              name="blacklisted_on"
              control={formMethods?.control}
              render={({ field: { onChange, value }, fieldState }) => {
                return (
                  <UiDateInput
                    label={"BlackListed Date"}
                    value={value}
                    onChange={onChange}
                    maxAllowedDate={DateTime.now()}
                    errors={fieldState?.error?.message}
                  />
                );
              }}
            />
           
          </div>
           <UiTextArea
              name="reason"
              placeholder="Provide your reason or additional information..."
              label="Reason"
              registerOptions={{
                onChange: (e:any) => {
                  dynamicAlphaNumeric(e, ["-", "_"], 100);
                },
                maxLength: {
                  value: 100,
                  message: "Reason must not exceed 100 characters",
                },
              }}
            />
          <div className="flex justify-between gap-4 w-full">
            <UiButton
              text="Cancel"
              onClick={() => handleClose()}
              buttonType="secondary"
              className="p-4"
            />
            <UiButton
              text="Submit"
              type="submit"
              buttonType="primary"
              className="p-4 "
              isLoading={
                addBlackListMutations?.isPending ||
                updateBlackListMutations?.isPending
              }
            />
          </div>
        </form>
      </FormProvider>
    </UiModalContainer>
  );
};

export default AddEditBlackListAgentFormModal;
