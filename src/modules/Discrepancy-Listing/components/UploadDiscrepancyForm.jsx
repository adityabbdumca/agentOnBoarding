import UiButton from "@/UI-Components/Buttons/UiButton";
import UiFileInput from "@/UI-Components/Input/UiFileInput";
import { Controller, useForm } from "react-hook-form";

const UploadDiscrepancyForm = ({ discrepancyActionMutation, rowData }) => {
  const { handleSubmit, control, formState } = useForm();
  const onFileUpload = (data) => {
    discrepancyActionMutation.mutate({
      type: "upload",
      id: rowData?.user_id,
      master_desc_id: rowData?.master_desc_id,
      file: data?.attachment,
    });
  };
  return (
    <div>
      <form onSubmit={handleSubmit(onFileUpload)} className="flex flex-col gap-4 p-2">
        <div className="grid col-span-2 p-2">
          <Controller
            control={control}
            name="attachment"
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
                  name={"attachment"}
                  value={value}
                  error={formState?.errors?.attachment?.message}
                />
              );
            }}
          />
        </div>
        <section className="flex justify-end">
          <UiButton text="Submit" type="submit" className="p-2 w-24" />
        </section>
      </form>
    </div>
  );
};

export default UploadDiscrepancyForm;
