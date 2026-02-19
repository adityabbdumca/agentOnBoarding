import { useState } from "react";
import { ActionContainer } from "@/UI-Components/GlobalStyles";
import MasterTable from "@/Components/MasterTable";
import { Tooltip } from "@mui/material";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import DiscrepancyPopUp from "./DiscrepancyPopUp";
import { DiscrepancyCells } from "../../../Discrepancy-Listing/components/DiscrepancyCells";
import { HiClipboardList } from "react-icons/hi";

const Discrepancy = ({ id }) => {
  const [openModal, setOpenModal] = useState(false);
  const [rowData, setRowData] = useState({});
  const [searchData] = useState({ id });
  return (
    <>
      <MasterTable
        api={"listDiscrepancy"}
        customCellRenderers={DiscrepancyCells}
        methods={"POST"}
        payload={searchData}
        isActions={true}
        customActions={({ row }) => {
          return (
            <ActionContainer>
              {["1", "4"]?.includes(row?.original?.discrepancy_status) && (
                <Tooltip title="Upload Document" arrow>
                  <div
                    onClick={() => {
                      setOpenModal(true);
                      setRowData(row?.original);
                    }}>
                    <HiClipboardList />
                  </div>
                </Tooltip>
              )}
            </ActionContainer>
          );
        }}
      />
      <GlobalModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={"Upload Document"}
        width={500}>
        <DiscrepancyPopUp rowData={rowData} setOpenModal={setOpenModal} />
      </GlobalModal>
    </>
  );
};

export default Discrepancy;
