import React, { useState } from "react";
import GlobalModal from "../../../UI-Components/Modals/GlobalModal";
import UiButton from "../../../UI-Components/Buttons/UiButton";
import FilePicker from "../../../UI-Components/FilePicker";
import { useForm } from "react-hook-form";
import Button from "../../../UI-Components/Button";
import { HiArrowNarrowRight, HiOutlineRefresh } from "react-icons/hi";
import ButtonWrapper from "../../../UI-Components/ButtonWrapper";
import { Banknote, CheckCircleIcon, Landmark } from "lucide-react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { fileValidation } from "@/modules/OnboardingDetails/Schema";
import { useUpdateTaxPayerStatus } from "../service";
import { toast } from "react-toastify";
import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";

const PinCodeConfirmModal = ({
  open,
  onClose,
  title = "Tax Payer Confirmation",
  message = "Is your professional tax being deducted?",
}) => {
  const [uploadDocument, setUploadDocument] = useState(false);
  const { subRoute } = useGlobalRoutesHandler();

  const { mutate: updateTaxPayerMutate, isPending: isPendingStatus } =
    useUpdateTaxPayerStatus();
  const pinCodeConfirmSchema = yup.object().shape({
    supporting_documents: uploadDocument
      ? fileValidation.required("Supporting document is required")
      : yup.mixed().notRequired(),
  });
  const {
    watch,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    clearErrors,
  } = useForm({
    resolver: yupResolver(pinCodeConfirmSchema),
  });
  const onConfirm = () => {
    setUploadDocument(true);
  };

  const handleClose = () => {
    setUploadDocument(false);
    onClose();
  };
  const onSubmit = (data) => {
    updateTaxPayerMutate(
      {
        pt_document: data.supporting_documents[0],
        ...(subRoute !== "agent" && { id: subRoute }),
        pt_status: !uploadDocument ? "No" : "Yes",
      },
      {
        onSuccess: (response) => {
          if (response?.data?.status === 200) {
            toast.success(response?.data?.message);
            handleClose();
          }
          toast.error(response?.data?.errors?.pt_document[0]);
        },
      }
    );
  };
  return (
    <GlobalModal open={open} title={title} showESC={false} width={500}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 p-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Landmark size={25} className="  text-blue-600" />
            <p className="text-sm font-bold text-gray-800 text-center">
              {message}
            </p>
          </div>

          {!uploadDocument && (
            <div className="flex gap-3 mt-2">
              <UiButton
                text="Yes"
                buttonType="primary"
                isLoading={isPendingStatus}
                onClick={onConfirm}
                className={`flex-1 h-10 px-4 py-2 text-sm font-medium text-white `}
              />
              <UiButton
                text="No"
                buttonType="secondary"
                onClick={() => onSubmit({ supporting_documents: [] })}
                disabled={isPendingStatus}
                className="flex-1 h-10 px-4 py-2 border-1 border-gray-400 text-sm font-medium"
              />
            </div>
          )}
          {uploadDocument && (
            <>
              <div className="  ">
                <FilePicker
                  label="Supporting Documents"
                  name="supporting_documents"
                  control={control}
                  watch={watch}
                  isRequired={true}
                  tooltipText="Upload file (Max 10 MB) in .jpg, .jpeg, .png, or .pdf format"
                  setValue={setValue}
                  clearErrors={clearErrors}
                  errors={errors}
                  helperText="Please upload required documents (Max 10 MB). Allowed: .jpg, .jpeg, .png, .pdf"
                  acceptedFiles={{
                    "image/png": [".png"],
                    "image/jpg": [".jpg"],
                    "image/jpeg": [".jpeg"],
                    "application/pdf": [".pdf"],
                  }}
                />
              </div>
              <ButtonWrapper>
                <Button
                  type="submit"
                  width={"auto"}
                  disabled={isPendingStatus}
                  endIcon={
                    isPendingStatus ? (
                      <HiOutlineRefresh className="animate-spin" size={15} />
                    ) : (
                      <></>
                    )
                  }>
                  Submit
                </Button>
              </ButtonWrapper>
            </>
          )}
        </div>
      </form>
    </GlobalModal>
  );
};

export default PinCodeConfirmModal;
