import UiButton from "@/UI-Components/Buttons/UiButton";
import { CircleCheck } from "lucide-react";
import { useApproveCertificate } from "./Service";

const ResultCell = ({ row }) => {
  const { mutateAsync: approveCertificate, isPending } = useApproveCertificate();

  return (
    <>
      <UiButton
        buttonType="tertiary"
        className="w-24 bg-green-300/80 text-green-800  cursor-pointer p-2"
        icon={<CircleCheck className="size-4" />}
        text={"Accept"}
        onClick={() => {
          approveCertificate({
            user_id: row?.original?.id,
            type:"approve"
          });
        }}
        isLoading={isPending}
      />
    </>
  );
};

export default ResultCell;
