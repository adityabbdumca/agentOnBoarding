import { useEffect, useState } from "react";
import { StyledModal } from "@/UI-Components/GlobalStyles";
import Input from "@/UI-Components/Input";
import { useFieldArray, useForm } from "react-hook-form";
import { Grid2 } from "@mui/material";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import Button from "@/UI-Components/Button";
import {
  useAddAndUpdateBranch,
  useGetBranchName,
  useUploadFile,
} from "../service";
import Dropdown from "@/UI-Components/Dropdown";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  FormWrapper,
  HierarchyWrapper,
} from "../../Onboarding/Components/CreateOnboarding";
import { useGetStateCity } from "../../OnboardingDetails/service";
import styled from "styled-components";
import HierarchyFilePicker from "@/UI-Components/HierarchyFilePicker";
import { fileValidation } from "../../OnboardingDetails/Schema";
import { useGetReportingUserList } from "../../Create-User/service";
import { EXCEL_URL } from "@/config/env";

const BranchForm = ({ setModal }) => {
  const [tabValue, setTabValue] = useState(0);

  const Schema = yup.object().shape({
    name: yup.mixed().required("Name is required"),
    type: yup.mixed().required("Type is required"),
    ...(tabValue === 0
      ? {
          branch: yup.array().of(
            yup.object().shape({
              branch_name: yup.string().required("Branch Name is required"),
              pincode: yup.string().required("Pincode is required"),
              branch_address: yup
                .string()
                .required("Branch Address is required"),
              branch_manager_name: yup
                .string()
                .required("Branch Manager Name is required"),
              branch_manager_mobile_number: yup
                .string()
                .required("Branch Manager Mobile is required"),
              branch_manager_email_id: yup
                .string()
                .required("Branch Manager Email is required")
                .matches(
                  /^[a-zA-Z0-9._-]+@[a-zA-Z.-]+\.(com|in|net)$/,
                  "Invalid email format. Please check and try again."
                ),
            })
          ),
        }
      : { excel: fileValidation }),
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm({
    reValidateMode: "onChange",
    mode: "onChange",
    defaultValues: {
      branch: [
        {
          branch_name: "",
          pincode: "",
          branch_address: "",
        },
      ],
    },
    resolver: yupResolver(Schema),
  });

  const { append, remove, fields } = useFieldArray({
    control,
    name: "branch",
  });

  const [indexNum, setIndexNum] = useState(0);

  const { mutate } = useAddAndUpdateBranch(setModal);
  const { data: branchName } = useGetBranchName(watch("type")?.label);

  const branchType = new URLSearchParams(window.location.search).get("type");

  useEffect(() => {
    if (branchType) setValue("type", { label: branchType, value: 1 });
  }, [branchType]);

  const { data: stateCity, mutate: getStateCity } = useGetStateCity();

  useEffect(() => {
    if (String(watch(`branch[${indexNum}].pincode`))?.length > 5) {
      getStateCity({ pincode: watch(`branch[${indexNum}].pincode`) });
    }
  }, [String(watch(`branch[${indexNum}].pincode`))?.length, indexNum]);

  useEffect(() => {
    if (stateCity?.data?.status === 200) {
      setValue(`branch[${indexNum}].city`, stateCity?.data?.city_name);
      setValue(`branch[${indexNum}].state`, stateCity?.data?.state_name);
    }
  }, [stateCity?.data]);

  const { mutate: mutateFile } = useUploadFile();
  const { data: reportingUserData } = useGetReportingUserList();

  const reportingUserList =
    reportingUserData?.data?.data?.map((item) => ({
      label: item.name,
      value: item.id,
    })) || [];
  const demoExcel = `${
    EXCEL_URL
  }storage/sample_excels/Branches_Bulk_Upload.xlsx`;
  const onSubmit = (data) => {
    tabValue === 1
      ? mutate({ file: data?.excel[0] })
      : mutate({
          organisation_name_id: data?.name?.value,
          organisation_name: data?.name?.label,
          bhu_id: data?.name?.hu_id,
          type_id: data?.type?.value,
          type: data?.type?.label,
          ...data,
        });
  };
  return (
    <StyledModal>
      <h1 style={{ margin: "10px 0px" }}>Branch Details</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormWrapper>
          <Grid2 container spacing={2}>
            <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
              <Dropdown
                name="type"
                label="Branch Type"
                options={[
                  { label: "Broker", value: 1 },
                  { label: "IMF", value: 2 },
                  { label: "Corporate Agent", value: 3 },
                  { label: "Bank", value: 4 },
                ]}
                isRequired={true}
                errors={errors}
                control={control}
                inputRef={register("type")}
                readOnly={branchType}
              />
            </Grid2>
            <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
              <Dropdown
                name="name"
                label={`${watch("type")?.label || "Branch"} Name`}
                options={branchName?.data?.return_data || []}
                isRequired={true}
                errors={errors}
                control={control}
                inputRef={register("name")}
              />
            </Grid2>
          </Grid2>
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
            <>
              {fields.map((item, index) => (
                <>
                  <h3 style={{ margin: "10px 0px" }}>Branch {index + 1}</h3>
                  <Grid2 container spacing={2} key={item.id}>
                    <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
                      <Input
                        label="Branch Name"
                        placeholder="Enter Branch Name"
                        name={`branch[${index}.branch_name`}
                        isRequired={true}
                        inputRef={register(`branch[${index}.branch_name`)}
                        errors={errors}
                        onChange={(e) =>
                          (e.target.value = e.target.value
                            .replace(/[^A-Za-z-\s]|(\s{2,})/g, "")
                            .replace(/\b\w/g, (l) => l.toUpperCase()))
                        }
                      />
                    </Grid2>
                    <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
                      <Input
                        label="Branch Pincode"
                        placeholder="Enter Branch Pincode"
                        name={`branch[${index}].pincode`}
                        isRequired={true}
                        inputRef={register(`branch[${index}].pincode`)}
                        errors={errors}
                        maxLength={6}
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(
                            /^0+|[^0-9]/g,
                            ""
                          );
                          setIndexNum(index);
                        }}
                      />
                    </Grid2>
                    <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
                      <Input
                        label="Branch City"
                        placeholder="Enter Branch City"
                        name={`branch[${index}].city`}
                        isRequired={true}
                        inputRef={register(`branch[${index}].city`)}
                        errors={errors}
                        readOnly={true}
                      />
                    </Grid2>
                    <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
                      <Input
                        label="Branch State"
                        placeholder="Enter Branch State"
                        name={`branch[${index}].state`}
                        isRequired={true}
                        inputRef={register(`branch[${index}].state`)}
                        errors={errors}
                        readOnly={true}
                      />
                    </Grid2>
                    <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
                      <Input
                        label="Branch Address"
                        placeholder="Enter Branch Address"
                        name={`branch[${index}].branch_address`}
                        isRequired={true}
                        inputRef={register(`branch[${index}].branch_address`)}
                        errors={errors}
                      />
                    </Grid2>
                    <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
                      <Input
                        label="Branch Manager Name"
                        placeholder="Enter Branch Manager Name"
                        name={`branch[${index}].branch_manager_name`}
                        isRequired={true}
                        inputRef={register(
                          `branch[${index}].branch_manager_name`
                        )}
                        errors={errors}
                        onChange={(e) =>
                          (e.target.value = e.target.value
                            .replace(/[^A-Za-z-\s]|(\s{2,})/g, "")
                            .replace(/\b\w/g, (l) => l.toUpperCase()))
                        }
                      />
                    </Grid2>
                    <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
                      <Input
                        label="Branch Manager Mobile Number"
                        placeholder="Enter Branch Manager Mobile Number"
                        name={`branch[${index}].branch_manager_mobile_number`}
                        isRequired={true}
                        inputRef={register(
                          `branch[${index}].branch_manager_mobile_number`
                        )}
                        errors={errors}
                        maxLength={10}
                        onChange={(e) => {
                          e.target.value = e.target.value.replace(
                            /^0+|[^0-9]/g,
                            ""
                          );
                        }}
                      />
                    </Grid2>
                    <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
                      <Input
                        label="Branch Manager Email"
                        placeholder="Enter Branch Manager Email"
                        name={`branch[${index}].branch_manager_email_id`}
                        isRequired={true}
                        inputRef={register(
                          `branch[${index}].branch_manager_email_id`
                        )}
                        errors={errors}
                      />
                    </Grid2>
                    <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
                      <Input
                        label="Branch Code"
                        placeholder="Enter Branch Code"
                        name={`branch[${index}].branch_code`}
                        isRequired={true}
                        inputRef={register(`branch[${index}].branch_code`)}
                        errors={errors}
                      />
                    </Grid2>
                    <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
                      <Dropdown
                        label="FLS Mapping"
                        placeholder="Enter FLS Mapping"
                        name={`branch[${index}].fls_mapping`}
                        isRequired={true}
                        control={control}
                        options={reportingUserList}
                        errors={errors}
                      />
                    </Grid2>
                  </Grid2>
                  <h5 style={{ margin: "1rem 0" }}>{`Mapping`}</h5>
                  <Grid2 container spacing={2} marginTop={2}>
                    {watch(`type`)?.label === "Broker" ? (
                      <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
                        <Dropdown
                          label="POSP Mapping"
                          placeholder="Enter POSP Mapping"
                          name={`branch[${index}].pos_mapping`}
                          isRequired={true}
                          control={control}
                          options={[]}
                          errors={errors}
                        />
                      </Grid2>
                    ) : null}
                    <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
                      <Dropdown
                        label="SP Mapping"
                        placeholder="Enter SP Mapping"
                        name={`branch[${index}].sp_mapping`}
                        isRequired={true}
                        control={control}
                        options={[]}
                        errors={errors}
                      />
                    </Grid2>
                    <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
                      <Dropdown
                        label="AV Mapping"
                        placeholder="Enter AV Mapping"
                        name={`branch[${index}].av_mapping`}
                        isRequired={true}
                        control={control}
                        options={[]}
                        errors={errors}
                      />
                    </Grid2>
                    <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
                      <Dropdown
                        label="Employee Mapping"
                        placeholder="Enter Employee Mapping"
                        name={`branch[${index}].employee_mapping`}
                        isRequired={true}
                        control={control}
                        options={[]}
                        errors={errors}
                      />
                    </Grid2>
                  </Grid2>
                  <ButtonWrapper>
                    <Button width={"auto"} onClick={() => append({})}>
                      Add +
                    </Button>
                    {index > 0 && (
                      <Button width={"auto"} onClick={() => remove(index)}>
                        Remove -
                      </Button>
                    )}
                  </ButtonWrapper>
                </>
              ))}
            </>
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
        <HierarchyWrapper>
          <Button type="submit" width={"auto"}>
            Submit
          </Button>
        </HierarchyWrapper>
      </form>
    </StyledModal>
  );
};

export default BranchForm;

export const NewTab = styled.div`
  position: relative;
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 600;
  text-align: center;
  background: ${(props) => (props.isActive ? "white" : "transparent")};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: ${(props) => (props.isActive ? "#0066FF" : "#64748b")};
  transition: all 0.3s ease;
  z-index: 1;
  flex: 1;

  ${(props) =>
    props.isActive &&
    `
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    transform: translateY(-1px);
  `}

  &:hover {
    color: ${(props) => (props.isActive ? "#0066FF" : "#0052cc")};
  }

  @media (max-width: 640px) {
    padding: 10px 16px;
    font-size: 14px;
  }
`;

export const NewTabsWrapper = styled.div`
  position: relative;
  display: flex;
  gap: 4px;
  background: #f8fafc;
  padding: 6px;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

export const TabContainer = styled.div`
  // width: 100%;
  max-width: 40%;
  // margin: 40px auto;
  padding: 20px 0;
`;
