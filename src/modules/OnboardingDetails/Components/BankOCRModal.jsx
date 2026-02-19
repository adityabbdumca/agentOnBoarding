import UiModalContainer from "@/UI-Components/Modals/UiModal";
import { Controller, useForm } from "react-hook-form";
import UiFileInput from "@/UI-Components/Input/UiFileInput";
import UiButton from "@/UI-Components/Buttons/UiButton";
import { ArrowRight } from "lucide-react";
import { useBankDocumentUpload } from "../service";
import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";

const BankOCRModal = ({ isOpen, handleClose }) => {
  const formMethods = useForm();
  const { subRoute } = useGlobalRoutesHandler();

  const { mutate, isPending } = useBankDocumentUpload({ handleClose });
  const verticalId = +localStorage.getItem("vertical_id");
  const closeAndReset = () => {
    formMethods.reset();
    handleClose();
  };

  const onSubmit = (data) => {
    const payload = {
      ...(![4].includes(verticalId) && { id: subRoute }),
      document_id: "6",
      file: Array.isArray(data.file) ? data.file[0] : data.file,
      upload_type: "journey",
      is_ocr: true,
    };
    mutate(payload);
  };

  return (
    <UiModalContainer
      isOpen={isOpen}
      handleCloseModal={closeAndReset}
      headSection={
        <div className="text-base font-semibold text-primary">
          Upload Bank Document
        </div>
      }>
      <form onSubmit={formMethods.handleSubmit(onSubmit)} className="w-[400px]">
        <span className="text-sm">Upload Bank Cancelled Cheque</span>
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
                supportFormat={[".pdf", ".jpg", ".png", ".jpeg"]}
                maxSize="10MB"
                handleChange={onChange}
                name={"file"}
                value={value}
                error={formMethods?.formState?.errors?.file?.message}
              />
            );
          }}
        />
        <section className="flex items-center gap-2 mt-10 col-span-2">
          <UiButton
            buttonType="secondary"
            text="Cancel"
            className="w-full"
            onClick={handleClose}
          />
          <UiButton
            type="submit"
            text="Submit"
            icon={<ArrowRight className="size-4" />}
            className="w-full"
            isLoading={isPending}
          />
        </section>
      </form>
    </UiModalContainer>
  );
};

export default BankOCRModal;
