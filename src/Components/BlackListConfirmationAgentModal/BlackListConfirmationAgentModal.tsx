import UiButton from "@/UI-Components/Buttons/UiButton";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import { ShieldBan } from "lucide-react";
import { useLogOutUser } from "../SideBar/Service";

const BlackListConfirmationAgentModal = ({
  open,
  onClose,
  text = "This agent is listed in the blacklist. You cannot proceed further with this PAN",
  title = "Blacklisted Agent Detected",
  isLogOutAction = true,
}: {
  open: boolean;
  onClose: () => void;
  text: string;
  type: string;
  title: string;
  isLogOutAction: boolean;
}) => {
  const { mutate: mutateLogout, isPending } = useLogOutUser();
  const handleLogOut = () => {
    if (isLogOutAction) {
      mutateLogout();
    }
    onClose();
  };
  return (
    <GlobalModal open={open} onClose={handleLogOut} title={title} width={400}>
      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-center justify-center rounded-full ring ring-primary p-3  mx-auto">
          <ShieldBan className="text-4xl text-primary" />
        </div>
        <div className=" w-full px-2 flex items-center justify-center rounded-md py-2">
          <p className="text-xs text-gray-700 font-semibold">{text}</p>
        </div>
        <div className="flex justify-end gap-2">
          <UiButton
            buttonType="primary"
            type="button"
            className="w-24"
            text="OK"
            isLoading={isPending}
            onClick={handleLogOut}
          />
        </div>
      </div>
    </GlobalModal>
  );
};
export default BlackListConfirmationAgentModal;
