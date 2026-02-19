import { useState } from "react";
import { ActionContainer } from "@/UI-Components/GlobalStyles";
import MasterTable from "@/Components/MasterTable";
import Button from "@/UI-Components/Button";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { useExportIRDAI } from "./service";
import Input from "@/UI-Components/Input";
import { Tooltip } from "@mui/material";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import DeactivationForm from "./DeactivationForm";
import { FaUserSlash } from "react-icons/fa";
import { debounce } from "lodash";
const ReportIndex = () => {
  const [openModal, setOpenModal] = useState({ open: false, rowData: {} });
  const [searchData, setSearchData] = useState({
    search_value: "",
    stage_id: 18,
  });
  const { mutate } = useExportIRDAI();

  return (
    <MainContainer
      heading={"IRDAI Report"}
      subHeading={"Listing of All Certified Insurance Agents"}
    >
      <MasterTable
        api={"agentMasterList"}
        methods={"POST"}
        payload={searchData}
        renderTopToolbarCustomActions={() => {
          return (
            <div className="w-full flex items-center justify-between gap-2">
              <Button
                variant="outlined"
                startIcon={<PiMicrosoftExcelLogoFill />}
                onClick={() => {
                  mutate();
                }}
              >
                Export
              </Button>
              <Input
                name="search_value"
                placeholder={"Search Table"}
                onChange={debounce(
                  (e) => setSearchData({ search_value: e.target.value }),
                  300
                )}
              />
            </div>
          );
        }}
        isActions={true}
        customActions={({ row }) => {
          return (
            <ActionContainer>
              <Tooltip title="Deactivate Agent" arrow placement="top">
                <div>
                  <FaUserSlash
                    onClick={() =>
                      setOpenModal({ open: true, rowData: row?.original })
                    }
                  />
                </div>
              </Tooltip>
            </ActionContainer>
          );
        }}
      />
      <GlobalModal
        open={openModal.open}
        onClose={() => setOpenModal({ open: false, rowData: {} })}
        width={500}
        title={"Deactivation Reason"}
      >
        <DeactivationForm rowData={openModal} setOpenModal={setOpenModal} />
      </GlobalModal>
    </MainContainer>
  );
};

export default ReportIndex;
