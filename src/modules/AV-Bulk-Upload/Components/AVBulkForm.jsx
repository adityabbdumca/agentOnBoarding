import { useState } from "react";
import { EXCEL_URL } from "@/config/env";
import { StyledModal } from "@/UI-Components/GlobalStyles";
import { Grid2 } from "@mui/material";
import Button from "@/UI-Components/Button";
import { useForm } from "react-hook-form";
import {
  useGetNewBranch,
  useGetReportingUserList,
} from "../../Create-User/service";
import {
  FormWrapper,
  HierarchyWrapper,
} from "../../Onboarding/Components/CreateOnboarding";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { fileValidation } from "../../OnboardingDetails/Schema";
import {
  useGetBranchName,
  useUploadFile,
} from "../../BranchOnboarding/service";
import {
  NewTab,
  NewTabsWrapper,
  TabContainer,
} from "../../BranchOnboarding/Components/BranchForm";
import HierarchyFilePicker from "@/UI-Components/HierarchyFilePicker";
import RenderFormFields from "@/UI-Components/RenderFormFields";
import { commonFields } from "../../POS-Bulk-Upload/constants";
import { useSPCreateAndUpdate } from "../../SP-Bulk-Upload/service";

export const AVSchema = yup.object().shape({
  first_name: yup.string().required("First Name is required"),
  last_name: yup.string().required("Last Name is required"),
  mobile_no: yup.string().required("Mobile No is required"),
  email_id: yup
    .string()
    .email("Invalid email format")
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z.-]+\.(com|in|net)$/,
      "Invalid email format. Please check and try again."
    )
    .required("E-Mail Id is required"),
  pan_card: yup.string().required("PAN Card is required"),
  aadhaar_card: yup.string().required("Aadhaar Card is required"),
  av_code: yup.string().required("AV Code is required"),
  ...(location.pathname.includes("create-user")
    ? {}
    : { channel: yup.mixed().required("Channel is required") }),
});
const AVBulkForm = ({ setIsDrawerOpen }) => {
  const [tabValue, setTabValue] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(
      tabValue === 0
        ? AVSchema
        : yup.object().shape({
            excel: fileValidation,
          })
    ),
  });
  const { channel, list_name } = watch();
  const { data: reportingUserData } = useGetReportingUserList();
  const { mutate: mutateFile } = useUploadFile();
  const { mutate: spMutate } = useSPCreateAndUpdate(setIsDrawerOpen);

  const { data: branchName } = useGetBranchName(channel?.label);
  const { data: branchData } = useGetNewBranch(list_name?.value);

  const brokerOrBankList = branchName?.data?.return_data || [];
  const branchMappingList = branchData?.data?.return_data || [];
  const reportingUserList =
    reportingUserData?.data?.data?.map((item) => ({
      label: item.name,
      value: item.id,
    })) || [];
  const demoExcel = `${EXCEL_URL}storage/sample_excels/AV_Bulk_Onboarding.xlsx`;

  const onSubmit = (data) => {
    tabValue === 0
      ? spMutate({
          ...data,
          marital_status: data.marital_status.value,
          mapped_rm: data.mapped_rm.value,
          profile_photo: Array.isArray(data.profile_photo)
            ? data.profile_photo[0]
            : data.profile_photo,
          aadhar_card_front: Array.isArray(data.aadhar_card_front)
            ? data.aadhar_card_front[0]
            : data.aadhar_card_front,
          aadhar_card_back: Array.isArray(data.aadhar_card_back)
            ? data.aadhar_card_back[0]
            : data.aadhar_card_back,
          affidavit_document: Array.isArray(data.affidavit_document)
            ? data.affidavit_document[0]
            : data.affidavit_document,
          education_document: Array.isArray(data.education_document)
            ? data.education_document[0]
            : data.education_document,
        })
      : mutateFile({ file: data.excel[0] });
  };

  return (
    <StyledModal>
      <h1 style={{ margin: "10px 0px" }}>AV Details</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormWrapper>
          <TabContainer>
            <NewTabsWrapper
              value={tabValue}
              onChange={(e, value) => setTabValue(value)}
              aria-label="basic tabs example">
              <NewTab isActive={tabValue === 0} onClick={() => setTabValue(0)}>
                Manual Entry
              </NewTab>
              <NewTab isActive={tabValue === 1} onClick={() => setTabValue(1)}>
                Bulk Upload
              </NewTab>
            </NewTabsWrapper>
          </TabContainer>
          {tabValue === 0 ? (
            <Grid2 container spacing={2}>
              {commonFields(
                "av",
                reportingUserList,
                watch(),
                brokerOrBankList,
                branchMappingList
              ).map((item) => {
                return (
                  <RenderFormFields
                    key={item.id}
                    item={item}
                    register={register}
                    setValue={setValue}
                    errors={errors}
                    control={control}
                    watch={watch}
                    clearErrors={clearErrors}
                  />
                );
              })}
            </Grid2>
          ) : (
            <HierarchyFilePicker
              control={control}
              errors={errors}
              setValue={setValue}
              onSubmit={onSubmit}
              watch={watch}
              clearErrors={clearErrors}
              handleSubmit={handleSubmit}
              data={demoExcel}
              mutate={mutateFile}
            />
          )}
        </FormWrapper>
        <HierarchyWrapper style={{ marginTop: "20px" }}>
          <Button type="submit" width={"auto"}>
            Submit
          </Button>
        </HierarchyWrapper>
      </form>
    </StyledModal>
  );
};

export default AVBulkForm;
