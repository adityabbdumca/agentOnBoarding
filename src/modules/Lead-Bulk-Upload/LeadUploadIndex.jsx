import { useState } from "react";
import UploadExcel from "../Payment-Bulk-Upload/UploadExcel";
import Input from "@/UI-Components/Input";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import CreateLead from "../Agent-Master/CreateLead";
import { HiUserAdd } from "react-icons/hi";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { useForm } from "react-hook-form";
import { useGetDemoAgentExcel, useUploadAgentLeadExcel } from "./service";
import MasterTable from "@/Components/MasterTable";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import { debounce } from "lodash";
import DropdownMenuButton from "@/Components/DropdownMenuButton/DropdownMenuButton";

const LeadUploadIndex = () => {
  const [openLead, setOpenLead] = useState(false);
  const [openExcel, setOpenExcel] = useState(false);
  const [searchData, setSearchData] = useState({
    mobile: "",
  });

  const { handleSubmit } = useForm();
  const { data } = useGetDemoAgentExcel();
  const { mutate } = useUploadAgentLeadExcel(setOpenExcel);
  const onSubmit = (data) => {
    const payload = { file: data?.excel[0] };
    mutate(payload);
  };
  return (
    <MainContainer
      heading={"Lead Bulk Upload"}
      subHeading={"Upload the Leads for your Insurance Agent"}
      pageActions={
        <>
          <DropdownMenuButton
            isStatic
            dropdownList={[
              {
                label: "Create Lead",
                icon: <HiUserAdd className="size-4" />,
                onClick: () => setOpenLead(true),
              },
              {
                label: "Upload Lead",
                icon: <PiMicrosoftExcelLogoFill className="size-4" />,
                onClick: () => setOpenExcel(true),
              },
            ]}
          />
        </>
      }
    >
      <MasterTable
        api={"agentleadList"}
        payload={searchData}
        renderTopToolbarCustomActions={() => {
          return (
            <div className="w-full flex items-center justify-end gap-2">
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
      />
      <GlobalModal
        open={openLead}
        onClose={() => setOpenLead(false)}
        title={"Create Lead"}
        width={500}
      >
        <CreateLead setOpenModal={setOpenLead} />
      </GlobalModal>
      <GlobalModal
        open={openExcel}
        onClose={() => setOpenExcel(false)}
        title={"Upload Lead"}
        width={500}
      >
        <UploadExcel
          data={data}
          mutate={mutate}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
        />
      </GlobalModal>
    </MainContainer>
  );
};

export default LeadUploadIndex;
