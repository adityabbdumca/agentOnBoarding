import { Grid2 } from "@mui/material";
import Dropdown from "@/UI-Components/Dropdown";
import { useForm } from "react-hook-form";
import CustomFilePicker from "@/UI-Components/CustomFilePicker";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import Button from "@/UI-Components/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { fileValidation } from "../OnboardingDetails/Schema";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import MainContainer from "../OnboardingDetails/Components/MainContainer";

const DocUploadIndex = () => {
  const schema = yup.object().shape({
    document_type: yup.mixed().required("Document Type is required"),
    document: fileValidation,
  });
  const {
    control,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  return (
    <MainContainer Icon={HiOutlineDocumentDuplicate} title={"Document Upload"}>
      <form onSubmit={handleSubmit(() => {})}>
        <Grid2 container spacing={2}>
          <Grid2 item size={{ lg: 3 }}>
            <Dropdown
              name={"document_type"}
              control={control}
              errors={errors}
              watch={watch}
              label={"Document Type"}
              placeholder={"Select Document Type"}
              options={[
                {
                  label: "Profile Photo",
                  value: "Profile Photo",
                },
                {
                  label: "Aadhar Card",
                  value: "Aadhar Card",
                },
                {
                  label: "PAN Card",
                  value: "PAN Card",
                },
                {
                  label: "Education Document",
                  value: "Education Document",
                },
                {
                  label: "License Copy",
                  value: "License Copy",
                },
                {
                  label: "Cancelled Cheque",
                  value: "Cancelled Cheque",
                },
                {
                  label: "Bank Statement",
                  value: "Bank Statement",
                },
                {
                  label: "Commission Statement",
                  value: "Commission Statement",
                },
                {
                  label: "Appointment Letter",
                  value: "Appointment Letter",
                },
              ]}
            />
          </Grid2>
        </Grid2>
        <CustomFilePicker
          name={"document"}
          errors={errors}
          watch={watch}
          label={"Upload Document"}
          setValue={setValue}
          control={control}
          clearErrors={clearErrors}
        />
        <ButtonWrapper >
          <Button type={"submit"} width={"auto"}>
            Submit
          </Button>
        </ButtonWrapper>
      </form>
    </MainContainer>
  );
};

export default DocUploadIndex;
