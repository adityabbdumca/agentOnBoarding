import MainContainer from "../../OnboardingDetails/Components/MainContainer";
import { ICONS } from "@/constants/ICONS";
import MasterTable from "@/Components/MasterTable";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { useState } from "react";
import ExamConfigIndex from "../ExamConfigIndex";
import Button from "@/UI-Components/Button";
import Drawer from "@/UI-Components/Drawer";
import { ActionContainer } from "@/UI-Components/GlobalStyles";
import { Tooltip } from "@mui/material";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import { useDeleteExamConfig } from "../Service";
import DeleteModal from "@/Components/DeleteModal/DeleteModal";
import { GlobalModal } from "@/UI-Components";
import ExamConfigEdit from "./ExamConfigEdit";
import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";

const ExamConfigListing = () => {
  const {navigateTo, subRoute}=useGlobalRoutesHandler()
  const [drawerObj, setDrawerObj] = useState({
    open: false,
    data: null,
    title: "",
  });
  const [modal, setModal] = useState({
    open: false,
    data: {},
  });
  const [edit, setEdit] = useState({
    open: false,
    data: {},
    modalTitle: "Edit",
  });
  const { mutate: deleteExamConfigMutate } = useDeleteExamConfig();
 
  return (
    <MainContainer
      title={"Exam Config Listing"}
      Icon={ICONS["Exam Details"]}
      heading={"Exam Config Listing"}
      subHeading={
        " View and manage the list of configured exams for your Insurance Agent qualification exam"
      }
      pageActions={
        <>
          <Button
            variant={"outlined"}
            width={"auto"}
            onClick={() => {
              setDrawerObj({
                open: true,
                data: null,
                title: "Add Exam Config",
              });
            }}
          >
            Add Exam Config
          </Button>
        </>
      }
    >
      <MasterTable
        api={URLs.GET_EXAM_CONFIG_LIST}
        customActions={({ row }) => (
          
          <ActionContainer>
            <Tooltip title="Edit" arrow placement="top">
              <div
                onClick={() => {
                  setEdit({
                    open: true,
                    data: row?.original,
                    modalTitle: "Edit",
                  });
                  navigateTo({to:{"edit":row?.original?.id}})
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

      <DeleteModal
        open={modal.open}
        text="Are you sure you want to delete?"
        onClose={() => setModal({ open: false, data: {} })}
        onClick={() => {
          deleteExamConfigMutate({
            id: modal?.data?.id,
          });
          setModal({ open: false, data: {} });
        }}
      />
      <GlobalModal
        open={edit.open}
        onClose={() => setEdit({ open: false, data: {}, modalTitle: "Edit" })}
        title={`${edit.modalTitle} Exam Config`}
        width={800}
      >
        <ExamConfigEdit
          row={edit.data}
          setEdit={setEdit}
          setDrawerObj={setDrawerObj}
        />
      </GlobalModal>
      <Drawer
        isOpen={drawerObj.open}
        onClose={() => setDrawerObj({ data: null, open: false, title: "" })}
      >
        <ExamConfigIndex drawerObj={drawerObj} setDrawerObj={setDrawerObj} />
      </Drawer>
    </MainContainer>
  );
};

export default ExamConfigListing;
