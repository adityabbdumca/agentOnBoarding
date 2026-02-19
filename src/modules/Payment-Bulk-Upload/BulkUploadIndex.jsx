import { useState } from "react";
import MasterTable from "@/Components/MasterTable";
import { useForm } from "react-hook-form";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import Button from "@/UI-Components/Button";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import { Grid2 } from "@mui/material";
import UploadExcel from "./UploadExcel";
import { useGetDemoExcel, useUploadExcel } from "./Service";
import Input from "@/UI-Components/Input";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { alphanumeric } from "@/HelperFunctions/helperFunctions";

const BulkUploadIndex = () => {
  const [openModal, setOpenModal] = useState(false);
  const [searchData, setSearchData] = useState({});
  const { register, handleSubmit } = useForm();
  const { data } = useGetDemoExcel();
  const { mutate } = useUploadExcel(setOpenModal);

  const onSubmit = (data) => {
    const payload = { file: data?.excel[0] };
    mutate(payload);
  };
  const searchSubmit = (data) => {
    setSearchData(data);
  };
  return (
    <MainContainer Icon={PiMicrosoftExcelLogoFill} title="Payment Bulk Upload">
      <Grid2
        container
        spacing={2}
        display={"flex"}
        justifyContent={"space-between"}
      >
        <form onSubmit={handleSubmit(searchSubmit)}>
          <Grid2
            item
            size={{ lg: 12, md: 6, sm: 12, xs: 12 }}
            display={"flex"}
            gap={2}
          >
            <Input
              name="search_value"
              label="Search Table"
              placeholder="Search"
              inputRef={register("search_value")}
              onChange={alphanumeric}
            />
            <ButtonWrapper>
              <Button width={"auto"} type="submit">
                Search
              </Button>
            </ButtonWrapper>
          </Grid2>
        </form>
        <Button
          width={"auto"}
          variant="outlined"
          onClick={() => setOpenModal(true)}
          style={{ marginTop: "18px" }}
          startIcon={<PiMicrosoftExcelLogoFill />}
        >
          Bulk Upload
        </Button>
      </Grid2>
      <MasterTable api={"ExcelFileList"} payload={searchData} />
      <GlobalModal
        open={openModal}
        setOpen={setOpenModal}
        onClose={() => setOpenModal(false)}
        title={"Bulk Upload"}
        width={500}
      >
        <UploadExcel data={data} mutate={mutate} onSubmit={onSubmit} />
      </GlobalModal>
    </MainContainer>
  );
};

export default BulkUploadIndex;
