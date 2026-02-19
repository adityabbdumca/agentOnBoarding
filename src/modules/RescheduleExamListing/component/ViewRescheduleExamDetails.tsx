import UiButton from "@/UI-Components/Buttons/UiButton";
import UiModalContainer from "@/UI-Components/Modals/UiModal";
import { EyeIcon } from "lucide-react";

const ViewRescheduleExamDetailsModal = ({
  isOpen,
  handleClose,
  isLoading,
  viewData,
}: {
  isOpen: Boolean;
  handleClose: () => void;
  isLoading: Boolean;
  viewData: any;
}) => {
  return (
    <UiModalContainer
      isOpen={isOpen}
      handleCloseModal={handleClose}
      isLoading={isLoading}
      headSection={
        <>
          <div className="flex gap-4">
            <UiButton
              icon={<EyeIcon className="size-6 text-primary" />}
              type="button"
              buttonType="tertiary"
              className={""}
            />

            <span className="text-base font-bold text-primary">
              View Reschedule Exam details
            </span>
          </div>
        </>
      }
      containerClass={"w-[650px] h-[350px]"}>
      <div className="flex flex-col gap-4">
        <div className={`grid grid-cols-3 gap-6 p-4`}>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-500">Name</span>
            <span className="mt-1 text-xs font-semibold">
              {viewData?.name ?? "--"}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-500">
              Mobile Number
            </span>
            <span className="mt-1 text-xs font-semibold ">
              {viewData?.mobile ?? "--"}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-500">
              Application Number
            </span>
            <span className="mt-1 text-xs font-semibold ">
              {viewData?.application_number ?? "--"}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-500">
              Allocated Exam Date
            </span>
            <span className="mt-1 text-xs font-semibold ">
              {viewData?.selected_date ?? "--"}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-500">
              Allocated Language
            </span>
            <span className="mt-1 text-xs font-semibold ">
              {viewData?.language ?? "--"}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-500">
              Allocated State
            </span>
            <span className="mt-1 text-xs font-semibold ">
              {viewData?.state ?? "--"}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-500">
              Allocated Exam Center
            </span>
            <span className="mt-1 text-xs font-semibold">
              {viewData?.exam_center ?? "--"}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-500">Status</span>
            <span className="mt-1 text-xs font-semibold text-gray-900 capitalize">
              {viewData?.action_status ?? "--"}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-500">
            Allocated Exam Center Address
          </span>
          <span className="mt-1 text-xs font-semibold truncate text-gray-900">
            {viewData?.center_address ?? "--"}
          </span>
        </div>
      </div>
    </UiModalContainer>
  );
};

export default ViewRescheduleExamDetailsModal;
