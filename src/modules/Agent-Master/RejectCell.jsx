import UiButton from "@/UI-Components/Buttons/UiButton";
import { XCircle } from "lucide-react";
import { useApproveCertificate } from "./Service";

const RejectCell = ({ row }) => {
  const { mutateAsync: rejectCertificate, isPending } = useApproveCertificate();

  return (
    <>
      <UiButton
        buttonType="tertiary"
        className="w-24 bg-red-100  text-red-700 cursor-pointer p-2"
        icon={<XCircle className="size-4" />}
        text={"Reject"}
        onClick={() => {
          rejectCertificate({
            user_id: row?.original?.id,
            type: "reject",
          });
        }}
        isLoading={isPending}
      />
    </>
  );
};

export default RejectCell;
