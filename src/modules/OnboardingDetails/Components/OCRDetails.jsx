import { StyledModal } from "@/UI-Components/GlobalStyles";
import { Grid2, useMediaQuery } from "@mui/material";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import Button from "@/UI-Components/Button";
import styled from "styled-components";
import RadioButton from "@/UI-Components/RadioButton";
import Input from "@/UI-Components/Input";
import Dropdown from "@/UI-Components/Dropdown";
import { HierarchyWrapper } from "../../Onboarding/Components/CreateOnboarding";
import FilePicker from "@/UI-Components/FilePicker";
import {
  allowOnlyNumbers,
  formatAadhaarInput,
} from "@/HelperFunctions/helperFunctions";

const OCRDetails = ({
  setOpenModal,
  ocrMutate,
  ckycMutate,
  control,
  errors,
  clearErrors,
  watch,
  setValue,
  register,
}) => {
  const onSubmit = (data) => {
    const payload = {
      profile_photo: Array.isArray(data.profile_photo)
        ? data.profile_photo[0]
        : data.profile_photo,
      education_document: Array.isArray(data.education_document)
        ? data.education_document[0]
        : data.education_document,
      pan_card_photo: Array.isArray(data.pan_card_photo)
        ? data.pan_card_photo[0]
        : data.pan_card_photo,
      aadhar_card_front: Array.isArray(data.aadhar_card_front)
        ? data.aadhar_card_front[0]
        : data.aadhar_card_front,
      aadhar_card_back: Array.isArray(data.aadhar_card_back)
        ? data.aadhar_card_back[0]
        : data.aadhar_card_back,
      cheque_copy: Array.isArray(data.cheque_copy)
        ? data.cheque_copy[0]
        : data.cheque_copy,
      license_path: Array.isArray(data.license_path)
        ? data.license_path[0]
        : data.license_path,
      appointment_path: Array.isArray(data.appointment_path)
        ? data.appointment_path[0]
        : data.appointment_path,
      commision_path: Array.isArray(data.commision_path)
        ? data.commision_path[0]
        : data.commision_path,
      noc_path: Array.isArray(data.noc_path) ? data.noc_path[0] : data.noc_path,
      herediatary_certificate: Array.isArray(data.herediatary_certificate)
        ? data.herediatary_certificate[0]
        : data.herediatary_certificate,
    };
    ocrMutate(payload);
    setOpenModal(false);
  };

  const ckycSubmit = (data) => {
    ckycMutate({
      ...(data?.ckyc?.ckyc === "Y" && {
        ckyc_number: data?.ckyc?.ckyc_number,
      }),
      [data?.ckyc?.ckyc_type?.value]: data?.ckyc?.ckyc_number
        .split("-")
        .join(""),
    });
  };

  const lessthan576 = useMediaQuery("(max-width: 576px)");

  const document = [
    {
      name: "documents.pan_card_photo",
      label: "Upload PAN Card Photo",
    },
    {
      name: "documents.aadhar_card_front",
      label: "Upload Aadhar Card Front Side",
    },
    {
      name: "documents.cheque_copy",
      label: "Upload Cheque Copy",
    },
    {
      name: "documents.profile_photo",
      label: "Upload Profile Photo",
    },
    {
      name: "documents.education_document",
      label: "Upload Education Document",
    },
    {
      name: "documents.aadhar_card_back",
      label: "Upload Aadhar Card Back Side",
    },
    {
      name: "documents.license_path",
      label: "Upload License",
    },
    {
      name: "documents.appointment_path",
      label: "Upload Appointment Letter",
    },
    {
      name: "documents.commision_path",
      label: "Upload Commission Certificate",
    },
    {
      name: "documents.noc_path",
      label: "Upload NOC",
    },
    {
      name: "documents.herediatary_certificate",
      label: "Upload Hereditary Certificate",
    },
  ];

  return (
    <StyledModal>
      <HierarchyWrapper>
        <StyledBox flex={lessthan576 ? false : true}>
          <StyledBox>
            <h2>CKYC Verification</h2>
            <form
              onSubmit={() => ckycSubmit(watch())}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <RadioButton
                name="ckyc.ckyc"
                label="Do you have CKYC?"
                options={[
                  { label: "Yes", value: "Y" },
                  { label: "No", value: "N" },
                ]}
                control={control}
                onChange={() => {
                  setValue("ckyc.ckyc_type", "");
                  setValue("ckyc.ckyc_number", "");
                }}
              />
              {watch("ckyc.ckyc") === "N" && (
                <Dropdown
                  name="ckyc.ckyc_type"
                  control={control}
                  placeholder="Select CKYC Type"
                  label="Select CKYC Type"
                  options={[
                    { label: "Aadhar", value: "Aadhar" },
                    { label: "PAN", value: "PAN" },
                  ]}
                />
              )}
              <Input
                name="ckyc.ckyc_number"
                inputRef={register("ckyc.ckyc_number")}
                isRequired={true}
                control={control}
                error={errors?.ckyc_number}
                label={`Enter ${
                  watch("ckyc.ckyc_type")?.value ||
                  (watch("ckyc.ckyc") === "Y" ? "CKYC" : "")
                } Number`}
                placeholder={`Enter ${
                  watch("ckyc.ckyc_type")?.value ||
                  (watch("ckyc.ckyc") === "Y" ? "CKYC" : "")
                } Number`}
                maxLength={
                  watch("ckyc.ckyc_type")?.value === "Aadhar"
                    ? 14
                    : watch("ckyc.ckyc_type")?.value === "PAN"
                      ? 10
                      : 14
                }
                onChange={(e) => {
                  watch("ckyc.ckyc_type")?.value === "Aadhar"
                    ? formatAadhaarInput(e)
                    : watch("ckyc.ckyc_type")?.value === "PAN"
                      ? (e.target.value = e.target.value.toUpperCase())
                      : allowOnlyNumbers(e);
                }}
              />
              <ButtonWrapper style={{ marginTop: "20px" }}>
                <Button width={"auto"} type={"submit"} variant={"contained"}>
                  Submit
                </Button>
              </ButtonWrapper>
            </form>
          </StyledBox>
          <StyledBox left={lessthan576 ? false : true}>
            <h2>OCR - Upload Documents</h2>
            <Instructions>
              <InstructionTitle>Instructions</InstructionTitle>
              <InstructionList>
                <InstructionItem>
                  Upload any of the following documents: Aadhar Card, PAN Card,
                  or Cheque.
                </InstructionItem>
                <InstructionItem>
                  Ensure the document is clearly visible and all text is
                  readable.
                </InstructionItem>
                <InstructionItem>
                  The OCR process will automatically extract relevant
                  information.
                </InstructionItem>
                <InstructionItem>
                  You can upload multiple document types for comprehensive data
                  extraction.
                </InstructionItem>
                <InstructionItem>
                  Please upload all the required documents{" "}
                  <strong>(Maximum 10 MB)</strong>. File Format:{" "}
                  <strong>(PDF, DOC, IMAGE)</strong>
                </InstructionItem>
              </InstructionList>
            </Instructions>
            <form onSubmit={() => onSubmit(watch())}>
              <Grid2 container spacing={2}>
                {document.map((item, index) => (
                  <Grid2
                    item
                    size={{ lg: 12, md: 12, sm: 12, xs: 12 }}
                    key={index}
                  >
                    <FilePicker
                      name={item?.name}
                      label={item?.label}
                      errors={errors}
                      control={control}
                      clearErrors={clearErrors}
                      watch={watch}
                      isTransparent={true}
                      setValue={setValue}
                      acceptedFiles={{
                        "image/png": [".png"],
                        "image/jpg": [".jpg"],
                        "image/jpeg": [".jpeg"],
                        "application/pdf": [".pdf"],
                      }}
                    />
                  </Grid2>
                ))}
              </Grid2>
              <ButtonWrapper style={{ marginTop: "20px" }}>
                <Button width={"auto"} type={"submit"} variant={"contained"}>
                  Submit
                </Button>
              </ButtonWrapper>
            </form>
          </StyledBox>
        </StyledBox>
      </HierarchyWrapper>
    </StyledModal>
  );
};

export default OCRDetails;

const StyledBox = styled.div`
  padding: ${({ flex }) => !flex && "0 1rem"};
  width: 100%;
  height: 89vh;
  display: flex;
  flex-direction: ${({ flex }) => (flex ? "row" : "column")};
  border-left: ${({ left }) => left && "4px solid #eff3f6"};
  overflow-y: ${({ flex }) => !flex && "auto"};
  gap: 10px;

  h2 {
    font-family: ${({ theme }) => theme?.fontFamily};
    font-weight: 600;
    font-size: 1.5rem;
    color: #1e293b;
    text-align: center;
  }
`;

const Instructions = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 6px;
  font-family: ${({ theme }) => theme?.fontFamily};
  border-left: 4px solid #3b82f6;
`;

const InstructionTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
`;

const InstructionList = styled.ul`
  margin: 0;
  padding-left: 20px;
`;

const InstructionItem = styled.li`
  margin-bottom: 4px;
  font-size: 0.83rem;
  color: #475569;
`;
