import MasterTable from "@/Components/MasterTable";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { Button, GlobalModal } from "@/UI-Components";
import { ActionContainer } from "@/UI-Components/GlobalStyles";
import { Tooltip } from "@mui/material";
import { useState } from "react";
import { HiOutlinePencilAlt } from "react-icons/hi";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import CreateRoleBasedCharges from "./components/CreateRoleBasedCharges";

const RoleBasedCharges = () => {
  const [roleOpen, setRoleOpen] = useState(false);
  const [roleTitle, setRoleTitle] = useState("Role Based");
  const [rowData, setRowData] = useState(null);
  
  return (
    <MainContainer
      heading={"Role Based Charges"}
      subHeading={
        "Configure onboarding fees for different agent types such as New, POSP, Composite, and Transfer."
      }
      pageActions={
        <>
          <Button onClick={() => setRoleOpen(true)}>Add Amount</Button>
        </>
      }
    >
      {/* Table */}
      <MasterTable
        queryKey={CACHE_KEYS.ROLE_MASTER}
        api={"listPaymentConfig"}
        method={"POST"}
        customActions={({ row }) => (
          <ActionContainer>
            <Tooltip title="Edit" arrow placement="top">
              <div
                onClick={() => {
                  setRoleOpen(true);
                  setRowData(row?.original);
                    
                }}
              >
                <HiOutlinePencilAlt />
              </div>
            </Tooltip>
          </ActionContainer>
        )}
      />

      <GlobalModal
        open={roleOpen}
        onClose={() => setRoleOpen(false)}
        width={400}
        title={`${roleTitle} Charges`}
      >
        <CreateRoleBasedCharges
          rowData={rowData}
          setRoleOpen={setRoleOpen}
          setRoleTitle={setRoleTitle}
        />
   
        
      </GlobalModal>
    </MainContainer>
  );
};
export default RoleBasedCharges;
