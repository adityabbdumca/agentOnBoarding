import { useState } from "react";
import MasterTable from "@/Components/MasterTable";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import UploadExcel from "../Payment-Bulk-Upload/UploadExcel";
import Button from "@/UI-Components/Button";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import Drawer from "@/UI-Components/Drawer";
import AgentBulkForm from "./Components/AgentBulkForm";
import { TbFileUpload } from "react-icons/tb";
import {
  useGetCertifiedAgentDemoExcel,
  useUploadCertifiedAgent,
} from "./Service";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import { HiUserAdd } from "react-icons/hi";

const AgentIndex = () => {
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState({
    open: false,
    data: null,
    title: "",
  });
  const { data: demoExcel } = useGetCertifiedAgentDemoExcel(openModal);
  const { mutate: uploadMutate } = useUploadCertifiedAgent(setOpenModal);

  const onSubmit = (data) => {
    const payload = { file: data?.excel[0] };
    uploadMutate(payload);
  };
  return (
    <MainContainer Icon={TbFileUpload} title="Agent Bulk Upload">
      <ButtonWrapper>
        <Button
          width={"auto"}
          startIcon={<HiUserAdd />}
          variant="outlined"
          onClick={() =>
            setOpenModal2({
              open: true,
              data: null,
              title: "Create",
            })
          }
        >
          Create Agent
        </Button>
        <Button
          width={"auto"}
          variant="outlined"
          startIcon={<TbFileUpload />}
          onClick={() => setOpenModal(true)}
        >
          Bulk Upload
        </Button>
      </ButtonWrapper>
      <MasterTable api={"certifiedAgentList"} />
      <GlobalModal
        open={openModal}
        setOpen={setOpenModal}
        onClose={() => setOpenModal(false)}
        title={"Bulk Upload"}
        width={500}
      >
        <UploadExcel
          data={demoExcel}
          mutate={uploadMutate}
          onSubmit={onSubmit}
        />
      </GlobalModal>

      <Drawer
        isOpen={openModal2.open}
        onClose={() =>
          setOpenModal2({
            open: false,
            data: null,
            title: "",
          })
        }
        // width={"500px"}
      >
        <AgentBulkForm setOpen={setOpenModal2} />
      </Drawer>
    </MainContainer>
  );
};

export default AgentIndex;
