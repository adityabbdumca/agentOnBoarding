import { alphanumeric } from "@/HelperFunctions/helperFunctions";
import UiButton from "@/UI-Components/Buttons/UiButton";
import UiTextArea from "@/UI-Components/UiTextArea";
import { yupResolver } from "@hookform/resolvers/yup";
import { Send } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import * as Yup from "yup";
import { useDocumentFinalApproval } from "../../service";

const schema = Yup.object().shape({
  comment: Yup.string()
    .required("Response is required")
    .min(10, "Response must be at least 10 characters")
    .max(100, "Response must not exceed 100 characters"),
});

export default function NomineeCommentModal({
  isApprovalAccess,
  agentId,
  handleModalClose,
}) {
  const methods = useForm({
    resolver: yupResolver(schema),
  });
  const {
      mutateAsync,
      isPending
    } = useDocumentFinalApproval();
  const onSubmit = (data) => {
 
    const payload = {
      comment: data?.comment,
      id: agentId,
    };
    if (isApprovalAccess) {
      mutateAsync(payload).then((res) => {
        if (res.status === 200 || res.status == 201) {
          handleModalClose();
        }
      });
    }
  };

  return (
    <div className="p-6">
      <FormProvider {...methods}>
        <form onSubmit={methods?.handleSubmit(onSubmit)}>
          <div className="space-y-2 mb-2">
            <UiTextArea
              name="comment"
              placeholder="Provide your response or additional information..."
              label="Comments"
              registerOptions={{
                // onChange: (e) => {
                //   alphanumeric(e);
                // },
                required: "Comment is required",
                maxLength: {
                  value: 100,
                  message: "Comment must not exceed 100 characters",
                },
              }}
            />
          </div>

          <div className="flex justify-end border-t border-gray-200 pt-2">
            <UiButton
              text="Submit"
              type="submit"
              icon={<Send className="w-4 h-4" />}
              className="p-2"
              buttonType="primary"
              isLoading={isPending}
            />
          </div>
        </form>
      </FormProvider>
    </div>
  );
}
