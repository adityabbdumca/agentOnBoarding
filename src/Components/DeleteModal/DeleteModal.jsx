import {
  HiOutlineRefresh,
  HiQuestionMarkCircle,
  HiTrash,
} from "react-icons/hi";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";

const DeleteModal = ({
  open,
  onClose,
  onClick,
  text = "This action cannot be undone!",
  type = "delete",
  title = "Delete Record",
  isLoading = false,
}) => {
  return (
    <GlobalModal
      open={open}
      onClose={onClose}
      title={title}
      width={400}
      // className={"h-1/3 w-1/4"}
    >
      <div className="flex flex-col gap-3 p-4">
        <div
          data-modalType={type}
          className="flex items-center justify-center rounded-full p-3 bg-red-600 data-[modalType=question]:bg-blue-100 mx-auto"
        >
          {type === "delete" ? (
            <HiTrash className="text-4xl text-white" />
          ) : (
            <HiQuestionMarkCircle className="text-4xl  text-blue-600" />
          )}
        </div>
        <div className=" w-full px-2 flex items-center justify-center rounded-md py-2">
          <p className="text-sm font-bold">{text}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 flex items-center justify-center gap-1 text-sm font-semibold
        border border-lightGray cursor-pointer w-full text-body rounded-lg bg-white outline-gray
         transition-all disabled:brightness-90  disabled:cursor-not-allowed disabled:ring-0
         hover:brightness-90 active:ring-1 active:ring-extraLightGray/50 "
          >
            Cancel
          </button>

          <button
            data-modalType={type}
            type="button"
            disabled={isLoading}
            onClick={onClick}
            className="text-sm bg-red-600 data-[modalType=question]:bg-blue-600 data-[modalType=question]:hover:bg-blue-700 font-medium  flex items-center justify-center  gap-1
           focus:outline-1 focus:outline-extraLightGray cursor-pointer h-10 text-white w-full rounded-lg
          active:brightness-90 transition-all disabled:opacity-60 disabled:cursor-not-allowed outline-gray"
          >
            {isLoading ? (
              <HiOutlineRefresh className="animate-spin" size={18} />
            ) : (
              <span>{type === "delete" ? "Delete" : "Proceed"}</span>
            )}
          </button>
        </div>
      </div>
    </GlobalModal>
  );
};
export default DeleteModal;
