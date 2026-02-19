import MasterTable from "@/Components/MasterTable";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import { ActionContainer } from "@/UI-Components/GlobalStyles";
import { Tooltip } from "@mui/material";
import { HiCheck } from "react-icons/hi";

const NOCIndex = () => {
  return (
    <MainContainer
      heading="NOC Listing"
      subHeading="Approve NOC from the list below for your Insurance Agents"
    >
      <MasterTable
        api={"listNoc"}
        isActions={true}
        customActions={() => (
          <ActionContainer>
            <Tooltip title="Approve" placement="top" arrow>
              <div>
                <HiCheck />
              </div>
            </Tooltip>
          </ActionContainer>
        )}
      />
    </MainContainer>
  );
};

export default NOCIndex;
