import { useState } from "react";
import Button from "@/UI-Components/Button";
import MasterTable from "@/Components/MasterTable";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import Drawer from "@/UI-Components/Drawer";
import BranchForm from "./Components/BranchForm";
import { useSampleFile, useUploadFile } from "./service";
import UploadExcel from "../Payment-Bulk-Upload/UploadExcel";
import { PiGitBranchFill, PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { Grid2 } from "@mui/material";
import Input from "@/UI-Components/Input";
import { useForm } from "react-hook-form";
import MainContainer from "../OnboardingDetails/Components/MainContainer";

const BranchIndex = () => {
  const { register, handleSubmit } = useForm();
  const [searchData, setSearchData] = useState({});
  const [openModal, setOpenModal] = useState(false);
  const [openModal2, setOpenModal2] = useState({
    open: false,
    data: null,
    title: "",
  });

  const { data } = useSampleFile();
  const { mutate } = useUploadFile(setOpenModal);

  const onSubmit = (data) => {
    const payload = { file: data?.excel[0] };
    mutate(payload);
  };
  const searchSubmit = (data) => {
    setSearchData(data);
  };
  return (
    <MainContainer Icon={PiGitBranchFill} title={"Branch Onboarding"}>
      <form onSubmit={handleSubmit(searchSubmit)}>
        <Grid2
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          wrap="wrap"
        >
          {/* Input and Search Button */}
          <Grid2
            item
            size={{ lg: 4, md: 8, sm: 12, xs: 12 }}
            display="flex"
            gap={2}
          >
            <Input
              label="Search Branch Name"
              name="search_value"
              inputRef={register("search_value")}
              placeholder="Enter Branch Name / Mobile"
              style={{ flex: 1 }} // Allow the input to take up available space
            />
            <Button
              type="submit"
              width={"auto"}
              variant="contained"
              style={{ marginTop: "23px" }} // Set a fixed width for the button
            >
              Search
            </Button>
          </Grid2>

          <Grid2
            item
            size={{ lg: 4, md: 4, sm: 12, xs: 12 }}
            display="flex"
            justifyContent="flex-end"
            gap={2}
          >
            <Button
              variant="outlined"
              width={"auto"}
              startIcon={<PiGitBranchFill />}
              onClick={() =>
                setOpenModal2({
                  open: true,
                  data: null,
                  title: "Create",
                })
              }
            >
              Create Branch
            </Button>
            <Button
              variant="outlined"
              startIcon={<PiMicrosoftExcelLogoFill />}
              width={"auto"}
              onClick={() => setOpenModal(true)}
            >
              Bulk Upload
            </Button>
          </Grid2>
        </Grid2>
      </form>
      <MasterTable
        api={"listBranch"}
        payload={searchData}
        renderTopToolbarCustomActions={() => {
          return (
            <Button
              variant="outlined"
              startIcon={<PiMicrosoftExcelLogoFill />}
              width={"auto"}
              sx={{ fontSize: "12px !important" }}
            >
              Export
            </Button>
          );
        }}
      />

      <GlobalModal
        open={openModal}
        setOpen={setOpenModal}
        onClose={() => setOpenModal(false)}
        title={"Bulk Upload"}
        width={500}
      >
        <UploadExcel
          data={data}
          mutate={mutate}
          onSubmit={onSubmit}
          isBranch={true}
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
      >
        <BranchForm setModal={setOpenModal2} />
      </Drawer>
    </MainContainer>
  );
};

export default BranchIndex;
