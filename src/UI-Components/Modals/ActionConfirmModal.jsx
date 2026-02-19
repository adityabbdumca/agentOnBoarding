import {
  CheckCircleIcon,
  XCircleIcon,
  TriangleAlert,
  Trash2Icon,
} from "lucide-react";
import UiButton from "@/UI-Components/Buttons/UiButton";
import { GlobalModal } from "..";

const ActionConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  actionType = "approve", // 'approve', 'reject', 'discrepancy', "delete"
  title = "Confirm Action",
  message = "Are you sure you want to proceed with this action?",
  isLoading = false,
}) => {
  // Define icon and color based on action type
  const getIcon = () => {
    switch (actionType) {
      case "approve":
        return <CheckCircleIcon className="w-10 h-10 text-green-600" />;
      case "reject":
        return <XCircleIcon className="w-10 h-10 text-red-600" />;
      case "discrepancy":
        return <TriangleAlert className="w-10 h-10 text-orange-500" />;
      case "delete":
        return <Trash2Icon className="w-10 h-10 text-red-600" />;
      default:
        return <CheckCircleIcon className="w-10 h-10 text-green-600" />;
    }
  };

  const getButtonLabel = () => {
    switch (actionType) {
      case "approve":
        return "Approve";
      case "reject":
        return "Reject";
      case "discrepancy":
        return "Mark as Discrepancy";
      default:
        return "Proceed";
    }
  };

  const getButtonColor = () => {
    switch (actionType) {
      case "approve":
        return "bg-green-600 hover:bg-green-700";
      case "reject":
      case "delete":
        return "bg-red-600 hover:bg-red-700";
      case "discrepancy":
        return "bg-orange-500 hover:bg-orange-600";
      default:
        return "bg-blue-600 hover:bg-blue-700";
    }
  };

  return (
    <GlobalModal open={open} onClose={onClose} title={title} width={400}>
      <div className="flex flex-col gap-4 p-5 text-center">
        {/* Icon Circle */}
        <div
          className={`flex items-center justify-center w-16 h-16 mx-auto rounded-full ${
            actionType === "approve"
              ? "bg-green-100"
              : ["reject", "delete"].includes(actionType)
              ? "bg-red-100"
              : "bg-orange-100"
          }`}
        >
          {getIcon()}
        </div>

        {/* Message */}
        <p className="text-sm font-semibold text-gray-800">{message}</p>

        {/* Buttons */}
        <div className="flex gap-3 mt-2">
          {/* Cancel Button */}
          <UiButton
            text="Cancel"
            buttonType="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 h-10 px-4 py-2 text-sm font-medium"
          />

          {/* Confirm Button */}
          <UiButton
            text={getButtonLabel()}
            buttonType="primary"
            isLoading={isLoading}
            onClick={onConfirm}
            className={`flex-1 h-10 px-4 py-2 text-sm font-medium text-white ${getButtonColor()}`}
          />
        </div>
      </div>
    </GlobalModal>
  );
};

export default ActionConfirmationModal;
