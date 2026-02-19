import { StyledModal } from "@/UI-Components/GlobalStyles";
import { Controller, useForm } from "react-hook-form";
import { Grid2 } from "@mui/material";
import Input from "@/UI-Components/Input";
import Button from "@/UI-Components/Button";
import { constantsAgent, Schema } from "../constants";
import Dropdown from "@/UI-Components/Dropdown";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  FormWrapper,
  HierarchyWrapper,
} from "../../Onboarding/Components/CreateOnboarding";
import moment from "moment";
import { useGetReportingUserList } from "../../Create-User/service";
import { useCreateAndUpdateAgentBulkUpload } from "../Service";
import { ReactDatePicker } from "@/UI-Components/DatePicker";
import { useGetStateCity } from "../../OnboardingDetails/service";
import { useEffect } from "react";
import FilePicker from "@/UI-Components/FilePicker";
import UiDateInput from "@/UI-Components/UiDateInput";
import { DateTime } from "luxon";

const AgentBulkForm = ({ setOpen }) => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      agent: [{}],
    },
    resolver: yupResolver(Schema),
    mode: "onChange",
    reValidateMode: "onChange",
  });
  const { data: reportingUserData } = useGetReportingUserList();

  const reportingUserList =
    reportingUserData?.data?.data?.map((item) => ({
      label: item.name,
      value: item.id,
    })) || [];
  const constants = constantsAgent(reportingUserList);
  // eslint-disable-next-line no-console

  const { mutate } = useCreateAndUpdateAgentBulkUpload(setOpen);

  const { data: stateCity, mutate: getStateCity } = useGetStateCity();

  useEffect(() => {
    if (watch("pincode")?.length === 6) {
      getStateCity({ pincode: watch("pincode") });
    }
  }, [watch("pincode")?.length]);

  useEffect(() => {
    if (stateCity?.data?.status === 200) {
      setValue("city", stateCity?.data?.city_name);
      setValue("state", stateCity?.data?.state_name);
    }
  }, [stateCity?.data]);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      state: data?.state?.value,
      preferred_language: data?.preferred_language?.value,
      preferred_exam_date_1: moment(data?.preferred_exam_date_1).format(
        "YYYY-MM-DD"
      ),
      preferred_exam_date_2: moment(data?.preferred_exam_date_2).format(
        "YYYY-MM-DD"
      ),
      aadhar_card_no: data?.aadhar_card_no?.split("-").join(""),
      account_type: data?.account_type?.value,
      agent_type: data?.agent_type?.value,
      fls_mapping: data?.fls_mapping?.value,
      relation_with_applicant: data?.relation_with_applicant?.value,
      gender: data?.gender?.value,
      license_status: data?.license_status?.value,
      nominee_gender: data?.nominee_gender?.value,
      insurance_type: data?.insurance_type?.value,
      general_insurance: data?.general_insurance?.value,
      life_insurance: data?.life_insurance?.value,
      health_insurance: data?.health_insurance?.value,
      dob: moment(data?.dob).format("YYYY-MM-DD"),
      profile_photo: Array.isArray(data?.profile_photo)
        ? data?.profile_photo[0]
        : data?.profile_photo,
      education_document: Array.isArray(data?.education_document)
        ? data?.education_document[0]
        : data?.education_document,
      pan_card: Array.isArray(data?.pan_card)
        ? data?.pan_card[0]
        : data?.pan_card,
      aadhar_card: Array.isArray(data?.aadhar_card)
        ? data?.aadhar_card[0]
        : data?.aadhar_card,
      cancelled_cheque: Array.isArray(data?.cancelled_cheque)
        ? data?.cancelled_cheque[0]
        : data?.cancelled_cheque,
      license_copy: Array.isArray(data?.license_copy)
        ? data?.license_copy[0]
        : data?.license_copy,
      appointment_path: Array.isArray(data?.appointment_path)
        ? data?.appointment_path[0]
        : data?.appointment_path,
      commision_path: Array.isArray(data?.commision_path)
        ? data?.commision_path[0]
        : data?.commision_path,
      noc_path: Array.isArray(data?.noc_path)
        ? data?.noc_path[0]
        : data?.noc_path,
    };

    mutate(payload);
  };

  return (
    <StyledModal>
      <h1 style={{ margin: "10px 0px" }}>Agent Details</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormWrapper className="!pb-8 ">
          <Grid2 container spacing={2} sx={{ marginBottom: "20px" }}>
            {constants.map((item) => {
              if (
                item.dependsOn?.length > 0 &&
                !item.dependsOn.some((dep) => {
                  const value = watch(`${dep.field}`)?.value;
                  return dep.values.includes(value);
                })
              )
                return null;

              return item.type === "input" ? (
                <Grid2
                  item
                  size={{ lg: 3, md: 6, sm: 12, xs: 12 }}
                  key={item.id}
                >
                  <Input
                    {...item}
                    label={item.placeholder}
                    placeholder={"Enter " + item.placeholder}
                    name={`${item.name}`}
                    inputRef={register(`${item.name}`)}
                    errors={errors}
                  />
                </Grid2>
              ) : item.type === "dropdown" ? (
                <Grid2
                  item
                  size={{ lg: 3, md: 6, sm: 12, xs: 12 }}
                  key={item.id}
                >
                  <Dropdown
                    {...item}
                    label={item.placeholder}
                    placeholder={"Select " + item.placeholder}
                    name={`${item.name}`}
                    inputRef={register(`${item.name}`)}
                    options={item.options}
                    control={control}
                    errors={errors}
                  />
                </Grid2>
              ) : item.type === "file" ? (
                <Grid2
                  item
                  size={{ lg: 3, md: 6, sm: 12, xs: 12 }}
                  key={item.id}
                >
                  <FilePicker
                    {...item}
                    label={item.placeholder}
                    placeholder={"Enter " + item.placeholder}
                    name={`${item.name}`}
                    inputRef={register(`${item.name}`)}
                    type={item.type}
                    control={control}
                    watch={watch}
                    setValue={setValue}
                    clearErrors={clearErrors}
                    isTransparent
                    errors={errors}
                  />
                </Grid2>
              ) : (
                item.type === "date" && (
                  <Grid2
                    item
                    size={{ lg: 3, md: 6, sm: 12, xs: 12 }}
                    key={item.id}
                  >
                    <ReactDatePicker
                      {...item}
                      label={item.placeholder}
                      placeholder={"Enter " + item.placeholder}
                      name={`${item.name}`}
                      inputRef={register(`${item.name}`)}
                      type={item.type}
                      errors={errors}
                      control={control}
                      watch={watch}
                      setValue={setValue}
                      clearErrors={clearErrors}
                    />
                    {/* <Controller
                      control={control}
                      name={`${item.name}`}
                      rules={{ required: "Date of birth is required" }}
                      render={({ field, fieldState }) => (
                        <UiDateInput
                          label={item.placeholder}
                          value={field.value}
                          onChange={field.onChange}
                          isRequired={true}
                          maxAllowedDate={DateTime.now().minus({ years: 18 })}
                          errors={fieldState?.error?.message}
                        />
                      )}
                    /> */}
                  </Grid2>
                )
              );
            })}
          </Grid2>
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

export default AgentBulkForm;
