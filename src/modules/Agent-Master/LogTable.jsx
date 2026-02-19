import { StyledModal } from "@/UI-Components/GlobalStyles";
import MasterTable from "@/Components/MasterTable";

const LogTable = ({ logId }) => {
  return (
    <StyledModal>
      <MasterTable
        api={"getTrainingTracker"}
        methods={"POST"}
        payload={{ id: logId }}
      />
    </StyledModal>
  );
};

export default LogTable;
