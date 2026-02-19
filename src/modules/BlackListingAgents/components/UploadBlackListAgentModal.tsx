import UiButton from "@/UI-Components/Buttons/UiButton";
import UiFileInput from "@/UI-Components/Input/UiFileInput";
import UiModalContainer from "@/UI-Components/Modals/UiModal";
import { UploadCloudIcon } from "lucide-react";
import { Controller, FormProvider, useForm } from "react-hook-form";

const UploadBlackListAgentModal = ({
  isOpen,
  handleClose,
  onSubmit,
  isLoading
}: {
  isOpen: boolean;
  handleClose: () => void;
  onSubmit: (data: any) => void;
  isLoading:boolean;
}) => {
  const formMethods = useForm({
    mode: "onChange",
  });
  return (
    <UiModalContainer
      isOpen={isOpen}
      handleCloseModal={handleClose}
      isLoading={false}
      containerClass="w-[500px]"
      headSection={
        <div className="flex gap-2 items-center">
          <UploadCloudIcon className="size-8 text-primary" />
          <section className="flex flex-col">
            <h2 className="text-md font-semibold text-primary">
              Upload BlackList Agent
            </h2>
          </section>
        </div>
      }>
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="flex flex-col gap-4">
          <div>
            <Controller
              control={formMethods.control}
              name="file"
              rules={{
                required: "File is required.",
              }}
              render={({ field: { onChange, value } }) => {
                return (
                  <UiFileInput
                    className="mt-2"
                    supportFormat={["xlsx", "csv", "txt"]}
                    maxSize="5MB"
                    handleChange={onChange}
                    name={"file"}
                    value={value}
                    error={formMethods?.formState?.errors?.file?.message}
                  />
                );
              }}
            />
          </div>
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
              isLoading={isLoading}
            />
          </div>
        </form>
      </FormProvider>
    </UiModalContainer>
  );
};

export default UploadBlackListAgentModal;
