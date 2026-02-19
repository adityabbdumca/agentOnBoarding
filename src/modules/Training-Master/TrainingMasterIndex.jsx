import { useState } from "react";
import { ActionContainer } from "@/UI-Components/GlobalStyles";
import MasterTable from "@/Components/MasterTable";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import AddFileModal from "./AddFileModal";
import { Tooltip } from "@mui/material";
import { useDeleteTrainingDoc, useDeleteTrainingTime } from "./service";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import DropdownMenuButton from "@/Components/DropdownMenuButton/DropdownMenuButton";
import {
  HiBookOpen,
  HiClock,
  HiOutlinePencilAlt,
  HiOutlineTrash,
} from "react-icons/hi";
import DeleteModal from "@/Components/DeleteModal/DeleteModal";
import AddFileDocument from "./AddFileDocument";
const TrainingMasterIndex = () => {
  const [open, setOpen] = useState({
    open: false,
    data: {},
    modalTitle: "Add",
  });

  const [drawerObj, setDrawerObj] = useState({
    open: false,
    data: {},
    modalTitle: "Add",
  });

  const [modal, setModal] = useState({
    open: false,
    data: {},
  });

  const [view, setView] = useState("doc");

  const { mutate: deleteTime } = useDeleteTrainingTime(setModal);
  const { mutate: deleteDoc } = useDeleteTrainingDoc(setModal);

  return (
    <MainContainer
      heading={"Training Master"}
      subHeading={"Master list of all the training documents available"}
      pageActions={
        <DropdownMenuButton
          isStatic
          dropdownList={[
            {
              label: "Add Document",
              icon: <HiBookOpen className="size-4" />,
              onClick: () =>
                setDrawerObj({
                  open: true,
                  data: {},
                  modalTitle: "Add",
                }),
            },
            {
              label: "Add Training Time",
              icon: <HiClock className="size-4" />,
              onClick: () =>
                setOpen({
                  open: true,
                  data: {},
                  modalTitle: "Add Training",
                }),
            },
          ]}
        />
      }
    >
      <div className="flex items-center my-2">
        <div className="relative h-12 w-48 rounded-lg bg-white shadow-md p-1 cursor-pointer">
          <span
            className={`
        absolute top-1 bottom-1 w-24 rounded-lg bg-primary transition-all duration-300 ease-in-out
        ${view === "doc" ? "left-1" : "left-1/2"}
      `}
          />
          <div className="relative flex h-full">
            <span
              onClick={() => {
                setView("doc");
              }}
              className={`
          flex-1 flex items-center justify-center text-sm font-medium transition-colors duration-300
          ${view === "doc" ? "text-white" : "text-gray-700"}
        `}
            >
              Document
            </span>
            <span
              onClick={() => {
                setView("time");
              }}
              className={`
          flex-1 flex items-center justify-center text-sm font-medium transition-colors duration-300
          ${view === "time" ? "text-white" : "text-gray-700"}
        `}
            >
              Time
            </span>
          </div>
        </div>
      </div>
      <MasterTable
        api={view === "doc" ? "getTrainingDoc" : "getTrainingConfig"}
        methods={"POST"}
        isActions={true}
        customActions={({ row }) => (
          <ActionContainer>
            <Tooltip title="Edit" arrow placement="top">
              <div
                onClick={() => {
                  if (view === "doc") {
                    setDrawerObj({
                      open: true,
                      data: row?.original,
                      modalTitle: "Edit",
                    });
                  } else {
                    setOpen({
                      open: true,
                      data: row?.original,
                      modalTitle: "Edit Training",
                    });
                  }
                }}
              >
                <HiOutlinePencilAlt />
              </div>
            </Tooltip>
            <Tooltip title="Delete" arrow placement="top">
              <div
                onClick={() => {
                  setModal({
                    open: true,
                    data: row?.original,
                  });
                }}
              >
                <HiOutlineTrash />
              </div>
            </Tooltip>
          </ActionContainer>
        )}
      />

      <GlobalModal
        open={drawerObj.open}
        onClose={() => setDrawerObj({ open: false, data: {} })}
        title={`${drawerObj.modalTitle} Document`}
        width={600}
      >
        <AddFileDocument setOpen={setDrawerObj} open={drawerObj} />
      </GlobalModal>
      <GlobalModal
        open={open.open}
        onClose={() => setOpen({ open: false, data: {} })}
        title={`${open.modalTitle} Time`}
        width={600}
      >
        <AddFileModal setOpen={setOpen} open={open} />
      </GlobalModal>
      <DeleteModal
        open={modal.open}
        onClose={() => setModal({ open: false, data: {} })}
        onClick={() => {
          if (view === "doc") {
            deleteDoc(modal.data?.id);
          } else {
            deleteTime(modal.data?.id);
          }
        }}
      />
    </MainContainer>
  );
};

export default TrainingMasterIndex;
