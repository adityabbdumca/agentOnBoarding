import { useState } from "react";
import { ActionContainer } from "@/UI-Components/GlobalStyles";
import { Grid2, Tooltip } from "@mui/material";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import MasterTable from "@/Components/MasterTable";
import Button from "@/UI-Components/Button";
import Drawer from "@/UI-Components/Drawer";
import CreateOnboarding from "./Components/CreateOnboarding";
import { MdEdit } from "react-icons/md";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import UploadExcel from "../Payment-Bulk-Upload/UploadExcel";
import { useExportOnboarding, useGetDemoOnboardingExcel } from "./service";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import Input from "@/UI-Components/Input";
import { useForm } from "react-hook-form";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import { FaBuilding } from "react-icons/fa";
const OnboardingIndex = () => {
  const [open, setOpen] = useState(false);
  const [openModal, setOpenModal] = useState({
    open: false,
    data: null,
    title: "",
  });
  const [searchData, setSearchData] = useState({});
  const { register, handleSubmit } = useForm();
  const { data: demoExcel } = useGetDemoOnboardingExcel(open);
  const { mutate: exportExcel } = useExportOnboarding();

  const onSubmit = (data) => {
    setSearchData(data);
  };

  return (
    <MainContainer Icon={HiOutlineOfficeBuilding} title="Onboarding">
      <Grid2
        container
        spacing={2}
        display={"flex"}
        justifyContent={"space-between"}
      >
        <Grid2 item size={{ lg: 4, md: 8, sm: 12 }} display={"flex"} gap={2}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{ display: "flex", gap: "10px" }}
          >
            <Input
              name={"search_value"}
              inputRef={register("search_value")}
              label="Search by Type / Organization Name"
              placeholder="Search"
            />
            <ButtonWrapper style={{ marginTop: "13px" }}>
              <Button variant="contained" width={"auto"} type={"submit"}>
                Search
              </Button>
            </ButtonWrapper>
          </form>
        </Grid2>
        <Grid2 item size={{ lg: 6, md: 4, sm: 12 }}>
          <ButtonWrapper style={{ marginTop: "14px" }}>
            <Button
              variant="outlined"
              width={"auto"}
              startIcon={<FaBuilding />}
              onClick={() =>
                setOpenModal({
                  open: true,
                  data: null,
                  title: "Create",
                })
              }
            >
              Add Onboarding
            </Button>
            <Button
              variant="outlined"
              width={"auto"}
              startIcon={<PiMicrosoftExcelLogoFill />}
              onClick={() => setOpen(true)}
            >
              Bulk Upload
            </Button>
          </ButtonWrapper>
        </Grid2>
      </Grid2>
      <MasterTable
        api={"getOnboardingDataList"}
        methods={"POST"}
        payload={searchData}
        isMarginTop={true}
        isActions={true}
        renderTopToolbarCustomActions={() => {
          return (
            <ActionContainer>
              <Button
                variant="outlined"
                width={"80px"}
                height={"30px"}
                startIcon={<PiMicrosoftExcelLogoFill />}
                sx={{ fontSize: "12px !important" }}
                onClick={() => {
                  exportExcel();
                }}
              >
                Export
              </Button>
            </ActionContainer>
          );
        }}
        customActions={({ row }) => {
          return (
            <ActionContainer>
              <Tooltip title="Edit" arrow>
                <div
                  onClick={() =>
                    setOpenModal({
                      open: true,
                      data: row.original,
                      title: "Edit",
                    })
                  }
                >
                  <MdEdit />
                </div>
              </Tooltip>
            </ActionContainer>
          );
        }}
      />
      <GlobalModal
        open={open}
        onClose={() => setOpen(false)}
        title={"Bulk Upload"}
        width={500}
      >
        <UploadExcel data={demoExcel} mutate={""} onSubmit={""} />
      </GlobalModal>
      <Drawer
        isOpen={openModal.open}
        onClose={() =>
          setOpenModal({
            open: false,
            data: null,
          })
        }
        title="Add Onboarding"
      >
        <CreateOnboarding
          setModal={setOpenModal}
          rowData={openModal.data}
          title={openModal.title}
        />
      </Drawer>
    </MainContainer>
  );
};

export default OnboardingIndex;
