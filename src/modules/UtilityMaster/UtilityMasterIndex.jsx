import { Tooltip } from "@mui/material";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import MasterTable from "@/Components/MasterTable";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { useState } from "react";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import { ActionContainer } from "@/UI-Components/GlobalStyles";
import AddAndUpdateUtility from "./Components/AddAndUpdateUtility";

const UtilityMasterIndex = () => {
  const [openModal, setOpenModal] = useState({ open: false, data: null });

  return (
    <MainContainer
      heading={"Utility Master"}
      subHeading={"Master to keep track of all the utilities"}
    >
      <MasterTable
        api={"listMasterStage"}
        methods={"POST"}
        customActions={({ row }) => (
          <ActionContainer>
            <Tooltip title="Edit" arrow placement="top">
              <div
                onClick={() => {
                  setOpenModal({
                    open: true,
                    data: row?.original,
                  });
                }}
              >
                <HiOutlinePencilAlt />
              </div>
            </Tooltip>
          </ActionContainer>
        )}
        // isActions={true}
      />

      <GlobalModal
        open={openModal.open}
        onClose={() => setOpenModal({ open: false, data: null })}
        title={"Utility Master"}
        width={400}
      >
        <AddAndUpdateUtility
          data={openModal?.data}
          setOpenModal={setOpenModal}
        />
      </GlobalModal>
    </MainContainer>
  );
};

export default UtilityMasterIndex;
