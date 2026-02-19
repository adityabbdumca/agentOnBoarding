import {
  dynamicAlphaNumeric
} from "@/HelperFunctions/helperFunctions";
import { FilePicker } from "@/UI-Components";
import UiButton from "@/UI-Components/Buttons/UiButton";
import UiTextArea from "@/UI-Components/UiTextArea";
import { yupResolver } from "@hookform/resolvers/yup";
import { Send } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import { ENDORSEMENT_TYPE_MESSAGE } from "../servicingModule.constant";
const schema = Yup.object().shape({
  // respond: Yup.string()
  //   .nullable()
  //   .min(10, "Response must be at least 10 characters")
  //   .max(100, "Response must not exceed 100 characters"),
  supporting_documents: Yup.mixed()
    .nullable()
    .test("file-check", "Invalid file", (value) => {
      if (!value || (Array.isArray(value) && value.length === 0)) return true;
      return Array.isArray(value) ? value.length > 0 : true;
    }),
});

export default function RespondModal({
  endorsement_id,
  onSubmit,
  endorsement_status_id,
  endorsement_type_name,
  isLoading,
}) {
  const methods = useForm({
    resolver: yupResolver(schema),
  });
  const endorsementTypekey = endorsement_type_name?.trim();
  const onValid = (data) => {
    onSubmit({
      ...data,
      endorsement_id,
      endorsement_status_id,
      ...(data?.documents && { document: data.supporting_documents[0] }),
    });
  };

  return (
    <div className="p-6">
      <FormProvider {...methods}>
        <form onSubmit={methods?.handleSubmit(onValid)}>
          {/* Info Box */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-orange-800 mb-2">
              Operations Requirement:
            </h3>
            <p className="text-sm text-orange-700">
              {ENDORSEMENT_TYPE_MESSAGE[endorsementTypekey]}
            </p>
          </div>

          {/* Form */}

          <div className="space-y-2 mb-2">
            <UiTextArea
              name="respond"
              placeholder="Provide your response or additional information..."
              label="Comments"
              registerOptions={{
                onChange: (e) => {
                  dynamicAlphaNumeric(e, ["_", "-"], 100);
                },
                maxLength: {
                  value: 100,
                  message: "Response must not exceed 100 characters",
                },
              }}
            />
          </div>

          <section>
            <FilePicker
              label="Supporting Documents"
              name="supporting_documents"
              control={methods?.control}
              watch={methods?.watch}
              setValue={methods?.setValue}
              clearErrors={methods?.clearErrors}
              setError={methods?.setError}
              errors={methods.formState.errors}
              isRequired={false}
              acceptedFiles={{
                "image/png": [".png"],
                "image/jpg": [".jpg"],
                "image/jpeg": [".jpeg"],
                "application/pdf": [".pdf"],
              }}
            />
          </section>

          <div className="flex justify-end border-t border-gray-200 pt-2">
            <UiButton
              text="Submit Response"
              type="submit"
              icon={<Send className="w-4 h-4" />}
              className="p-2"
              buttonType="primary"
              isLoading={isLoading}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
