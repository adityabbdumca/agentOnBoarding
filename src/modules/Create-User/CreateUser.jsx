import { useEffect, useState } from "react";
import { StyledModal } from "@/UI-Components/GlobalStyles";
import { Grid2 } from "@mui/material";
import { useForm } from "react-hook-form";
import Button from "@/UI-Components/Button";
import Dropdown from "@/UI-Components/Dropdown";
import { yupResolver } from "@hookform/resolvers/yup";
import { userFields, userSchema } from "./UserConstants";
import moment from "moment";
import {
  useGetNewBranch,
  useGetNewRole,
  useGetReportingUserList,
} from "./service";
import {
  FormWrapper,
  HierarchyWrapper,
  StyledH2,
} from "../Onboarding/Components/CreateOnboarding";
import { useGetBranchName } from "../BranchOnboarding/service";
import RenderFormFields from "@/UI-Components/RenderFormFields";
import { commonFields } from "../POS-Bulk-Upload/constants";
import { SPSchema } from "../SP-Bulk-Upload/Components/SPBulkForm";
import { POSSchema } from "../POS-Bulk-Upload/Components/POSBulkForm";
import { AVSchema } from "../AV-Bulk-Upload/Components/AVBulkForm";
import {
  NewTab,
  NewTabsWrapper,
  TabContainer,
} from "../BranchOnboarding/Components/BranchForm";
import HierarchyFilePicker from "@/UI-Components/HierarchyFilePicker";
import { usePOSCreateAndUpdate } from "../POS-Bulk-Upload/service";
import { useSPCreateAndUpdate } from "../SP-Bulk-Upload/service";
import { useGetStateCity } from "../OnboardingDetails/service";
import { EXCEL_URL } from "@/config/env";
const CreateUser = ({ setIsDrawerOpen }) => {
  const [activeSchema, setActiveSchema] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [activePerson, setActivePerson] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    clearErrors,
  } = useForm({
    shouldUnregister: true,
    resolver: yupResolver(activeSchema || userSchema),
    reValidateMode: "onChange",
  });
  const { channel, list_name, role_id, vertical } = watch();
  const { data: roleData } = useGetNewRole(channel?.value);
  const { data: stateCity, mutate: getStateCity } = useGetStateCity();
  const { data: branchData } = useGetNewBranch({
    bankOrBrokerName: list_name?.value,
    vertical: vertical?.value,
    channel: channel?.value,
  });
  const { data: reportingUserData } = useGetReportingUserList();
  const reportingUserList =
    reportingUserData?.data?.data?.map((item) => ({
      label: item.name,
      value: item.id,
    })) || [];
  const { data: branchName } = useGetBranchName(channel?.label);
  const { mutate: posMutate } = usePOSCreateAndUpdate(setIsDrawerOpen);
  const { mutate: spMutate } = useSPCreateAndUpdate(setIsDrawerOpen);

  const roleOptions =
    roleData?.data?.return_data?.map((item) => ({
      label: item?.label,
      value: item?.value,
    })) || [];

  const branchList = branchData?.data?.return_data || [];

  const renderFields = [20, 24].includes(role_id?.value)
    ? userFields(branchList, vertical)
    : [18, 21].includes(role_id?.value)
    ? commonFields("sp", reportingUserList, watch(), null, branchList)
    : [23].includes(role_id?.value)
    ? commonFields("posp", reportingUserList, watch(), null, branchList)
    : [19, 22].includes(role_id?.value)
    ? commonFields("av", reportingUserList, watch(), null, branchList)
    : [];

  const onboardType = new URLSearchParams(window.location.search).get("type");
  useEffect(() => {
    if (onboardType === "Bank") {
      setValue("channel", { label: "Bank", value: 5 });
    } else if (onboardType === "Broker") {
      setValue("channel", { label: "Broker", value: 6 });
    }
  }, [onboardType]);

  useEffect(() => {
    if (String(watch("pincode"))?.length === 6) {
      getStateCity({ pincode: watch("pincode") });
    }
  }, [watch("pincode")?.length]);

  useEffect(() => {
    if (stateCity?.data?.status === 200) {
      setValue("city", stateCity?.data?.city_name);
      setValue("state", stateCity?.data?.state_name);
    }
  }, [stateCity?.data]);

  useEffect(() => {
    if ([18, 21].includes(role_id?.value)) {
      setActiveSchema(SPSchema);
      setActivePerson("SP");
    } else if ([23].includes(role_id?.value)) {
      setActiveSchema(POSSchema);
      setActivePerson("POSP");
    } else if ([19, 22].includes(role_id?.value)) {
      setActiveSchema(AVSchema);
      setActivePerson("AV");
    } else if ([20, 24].includes(role_id?.value)) {
      setActiveSchema(userSchema);
      setActivePerson("EMP");
    }
  }, [role_id?.value]);

  useEffect(() => {
    setValue("list_name", null);
    setValue("vertical", null);
    setValue("branch", null);
    setValue("role_id", null);
    clearErrors();
  }, [channel?.value]);

  useEffect(() => {
    clearErrors();
    renderFields.map((item) => setValue(item.name, null));
  }, [activePerson]);

  const showTabs =
    channel?.value && list_name?.value && role_id?.value && vertical?.value;

  const demoExcel = (() => {
    switch (activePerson) {
      case "EMP":
        return "";
      case "SP":
        return `${
          EXCEL_URL
        }storage/sample_excels/SP_Bulk_Upload.xlsx`;
      case "POSP":
        return `${
          EXCEL_URL
        }storage/sample_excels/POS_Bulk_upload_on_broker.xlsx`;
      case "AV":
        return `${
          EXCEL_URL
        }storage/sample_excels/AV_Bulk_Onboarding.xlsx`;
      default:
    }
  })();
  const onSubmit = (data) => {

    const userData = {
      ...data,
      channel: data?.channel?.value,
      list_name: data?.list_name?.value,
      hu_id: data?.branch_mapping?.hu_id,
      vertical: data?.vertical?.value,
      branch: data?.branch?.value,
      name: data?.first_name + " " + data?.last_name,
      role_id: data?.role_id?.value,
      role_name: data?.role_id?.label,
      gender: data?.gender?.value,
      branch_mapping: data?.branch_mapping?.value,
      qualification: data?.qualification?.value,
      dob: moment(data?.dob).format("YYYY-MM-DD"),
    };
    switch (activePerson) {
      case "EMP":
        spMutate(userData);
        break;
      case "POSP":
        posMutate({
          ...userData,
          branch_id: data?.branch?.hu_id,
        });
        break;
      case "SP":
        spMutate({
          ...userData,
          branch_id: data?.branch?.hu_id,
        });
        break;
      case "AV":
        spMutate({
          ...userData,
        });
        break;
    }
  };
  return (
    <StyledModal>
      <StyledH2 style={{ margin: "0 0 1rem 0" }}>Create User</StyledH2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormWrapper>
          <Grid2 container spacing={2}>
            <h3 style={{ margin: "1rem 0" }}>Basic Details</h3>
          </Grid2>

          <Grid2 container spacing={2}>
            <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
              <Dropdown
                name="channel"
                isRequired={true}
                errors={errors}
                readOnly={onboardType}
                watch={watch}
                label="Select Channel"
                placeholder="Select "
                options={[
                  { value: 5, label: "Bank" },
                  { value: 6, label: "Broker" },
                ]}
                control={control}
              />
            </Grid2>
            {channel?.value ? (
              <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
                <Dropdown
                  name="list_name"
                  isRequired={true}
                  errors={errors}
                  watch={watch}
                  label={`${channel?.label} Name`}
                  placeholder="Select "
                  options={branchName?.data?.return_data || []}
                  control={control}
                />
              </Grid2>
            ) : null}
            <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
              <Dropdown
                name="vertical"
                isRequired={true}
                errors={errors}
                watch={watch}
                label="Select Vertical"
                placeholder="Select "
                options={[
                  { value: 1, label: "Branch Banking" },
                  ...(channel?.value === 5
                    ? [{ value: 2, label: "Assets" }]
                    : []),
                  { value: 3, label: "Telemarketing" },
                  { value: 4, label: "Digital" },
                ]}
                control={control}
              />
            </Grid2>
            <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
              <Dropdown
                name="role_id"
                errors={errors}
                isRequired={true}
                label="Role"
                Height={100}
                placeholder="Select Role"
                control={control}
                options={roleOptions}
              />
            </Grid2>
          </Grid2>

          {showTabs ? (
            <TabContainer>
              <NewTabsWrapper
                value={tabValue}
                onChange={(e, value) => setTabValue(value)}
                aria-label="basic tabs example"
              >
                <NewTab
                  isActive={tabValue === 0}
                  onClick={() => setTabValue(0)}
                >
                  Manual Entry
                </NewTab>
                <NewTab
                  isActive={tabValue === 1}
                  onClick={() => setTabValue(1)}
                >
                  Bulk Upload
                </NewTab>
              </NewTabsWrapper>
            </TabContainer>
          ) : null}
          {tabValue === 0 && showTabs ? (
            <Grid2 container spacing={2}>
              {renderFields.map((item) => (
                <RenderFormFields
                  key={item.id}
                  item={item}
                  register={register}
                  control={control}
                  errors={errors}
                  watch={watch}
                  setValue={setValue}
                  clearErrors={clearErrors}
                />
              ))}
            </Grid2>
          ) : showTabs ? (
            <HierarchyFilePicker
              control={control}
              errors={errors}
              setValue={setValue}
              onSubmit={onSubmit}
              watch={watch}
              clearErrors={clearErrors}
              handleSubmit={handleSubmit}
              data={demoExcel}
              mutate={""}
            />
          ) : null}

          <HierarchyWrapper>
            <Button variant="contained" width="auto" type="submit">
              Create User
            </Button>
          </HierarchyWrapper>
        </FormWrapper>
      </form>
    </StyledModal>
  );
};

export default CreateUser;
