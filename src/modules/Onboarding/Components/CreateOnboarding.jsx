import { Grid2 } from "@mui/material";
import { useEffect } from "react";
import Dropdown from "@/UI-Components/Dropdown";
import Input from "@/UI-Components/Input";
import { useForm } from "react-hook-form";
import { StyledModal } from "@/UI-Components/GlobalStyles";
import Button from "@/UI-Components/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCreateOnboardingData } from "../service";
import moment from "moment";
import styled from "styled-components";
import { brokerValidationSchema, constantsBroker } from "./OnboardingConstants";
import { ReactDatePicker } from "@/UI-Components/DatePicker";
import { useGetIFSCCode } from "../../OnboardingDetails/service";
import { useGetReportingUserList } from "../../Create-User/service";
import FilePicker from "@/UI-Components/FilePicker";

const CreateOnboarding = ({ setModal, title }) => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
    setValue,
    clearErrors,
    watch,
    reset,
    unregister,
  } = useForm({
    resolver: yupResolver(brokerValidationSchema()),
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const onboardType = new URLSearchParams(window.location.search).get("type");
  const { data: reportingUserData } = useGetReportingUserList();
  const reportingUserList =
    reportingUserData?.data?.data?.map((item) => ({
      label: item.name,
      value: item.id,
    })) || [];
  useEffect(() => {
    if (onboardType) {
      setValue("type", { label: onboardType, value: onboardType });
    }
  }, [onboardType]);

  const { mutate } = useCreateOnboardingData(setModal, reset);
  const { data: ifscCode, mutate: getIFSCCode } = useGetIFSCCode();
  useEffect(() => {
    if (watch("ifsc_code")?.length === 11) {
      getIFSCCode({ ifscCode: watch("ifsc_code") });
    }
  }, [watch("ifsc_code")?.length]);
  useEffect(() => {
    if (ifscCode?.data?.bankDetails) {
      setValue("bank_name", ifscCode?.data?.bankDetails?.bank_name);
      setValue("bank_city", ifscCode?.data?.bankDetails?.bank_city);
      setValue("branch_name", ifscCode?.data?.bankDetails?.bank_branch);
    }
  }, [ifscCode?.data?.bankDetails]);

  useEffect(() => {
    if (
      !watch("telemarketing_check")?.value ||
      watch("telemarketing_check")?.value === "No"
    ) {
      unregister([
        "telemarketing_code",
        "license_copy_of_av",
        "telemarketing_document",
      ]);
    }
  }, [watch("telemarketing_check")?.value]);

  useEffect(() => {
    if (!watch("bank_document")?.value) {
      unregister(["bank_document_file"]);
    }
  }, [watch("bank_document")?.value]);
  useEffect(() => {
    watch("license_start_date") &&
      setValue(
        "license_end_date",
        moment(watch("license_start_date")).add(3, "years")
      );
  }, [watch("license_start_date")]);
  const onSubmit = (data) => {
    const payload = {
      ...data,
      type: data?.type?.value,
      telemarketing_check: data?.telemarketing_check?.value,
      bank_document: data?.bank_document?.value,
      agreement_copy_check: data?.agreement_copy_check?.value,
      ...(watch("type")?.value === "Bank" && {
        digital_check: data?.digital_check?.value,
      }),
      license_start_date: moment(data?.license_start_date).format("YYYY-MM-DD"),
      license_end_date: moment(data?.license_end_date).format("YYYY-MM-DD"),
      telemarketing_document: Array.isArray(data?.telemarketing_document)
        ? data?.telemarketing_document[0]
        : data?.telemarketing_document,
      license_copy_of_av: Array.isArray(data?.license_copy_of_av)
        ? data?.license_copy_of_av[0]
        : data?.license_copy_of_av,
      list_of_av: Array.isArray(data?.list_of_av)
        ? data?.list_of_av[0]
        : data?.list_of_av,
      bank_document_file: Array.isArray(data?.bank_document_file)
        ? data?.bank_document_file[0]
        : data?.bank_document_file,
      license_copy: Array.isArray(data?.license_copy)
        ? data?.license_copy[0]
        : data?.license_copy,
      pan_card_document: Array.isArray(data?.pan_card_document)
        ? data?.pan_card_document[0]
        : data?.pan_card_document,
      gst_document: Array.isArray(data?.gst_document)
        ? data?.gst_document[0]
        : data?.gst_document,
      ...(watch("type")?.value === "Bank" && {
        agreement_copy_bank: Array.isArray(data?.agreement_copy_bank)
          ? data?.agreement_copy_bank[0]
          : data?.agreement_copy_bank,
      }),
      ...(watch("type")?.value === "Bank" && {
        list_of_av: Array.isArray(data?.list_of_av)
          ? data?.list_of_av[0]
          : data?.list_of_av,
      }),
      irdai_screenshot: Array.isArray(data?.irdai_screenshot)
        ? data?.irdai_screenshot[0]
        : data?.irdai_screenshot,
      sp_data: Array.isArray(data?.sp_data) ? data?.sp_data[0] : data?.sp_data,
      license_copy_sp: Array.isArray(data?.license_copy_sp)
        ? data?.license_copy_sp[0]
        : data?.license_copy_sp,
      nda: Array.isArray(data?.nda) ? data?.nda[0] : data?.nda,
      pos_data: Array.isArray(data?.pos_data)
        ? data?.pos_data[0]
        : data?.pos_data,
      broker_branch_list: Array.isArray(data?.broker_branch_list)
        ? data?.broker_branch_list[0]
        : data?.broker_branch_list,
      bqp_data: Array.isArray(data?.bqp_data) // lg data
        ? data?.bqp_data[0]
        : data?.bqp_data,
      agreement_copy: Array.isArray(data?.agreement_copy)
        ? data?.agreement_copy[0]
        : data?.agreement_copy,
      rm_mapping: data?.rm_mapping?.value,
      ...(watch("type")?.value === "Broker" && {
        website_code: data?.website_code,
      }),
    };
    mutate(payload);
  };

  const type = watch("type")?.value;
  const BankDocument = watch("bank_document")?.value;
  return (
    <StyledModal>
      <StyledH2 style={{ margin: "0 0 1rem 0" }}>{`${
        onboardType || title
      } Onboarding`}</StyledH2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormWrapper>
          {constantsBroker(type, BankDocument, reportingUserList).map(
            (items) => {
              if (
                !items.default &&
                items.dependsOnValue?.length > 0 &&
                !items.dependsOnValue?.includes(
                  watch(`${items.dependsOn}`)?.value ||
                    watch(`${items.dependsOn}`)
                )
              )
                return null;
              return (
                <>
                  <h3 style={{ margin: "1rem 0" }}>{`${items.title}`}</h3>
                  <Grid2
                    container
                    spacing={2}
                    sx={{
                      borderBottom: "1px solid #e0e0e0",
                      padding: "1rem 0",
                    }}
                  >
                    {items.children.map((item) => {
                      if (
                        item.dependsOnValue?.length > 0 &&
                        !item.dependsOnValue?.includes(
                          watch(`${item.dependsOn}`)?.value ||
                            watch(`${item.dependsOn}`)
                        )
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
                            label={item.label}
                            placeholder={"Enter " + item.placeholder}
                            name={item.name}
                            isRequired={true}
                            readOnly={item.disabled}
                            inputRef={register(item.name)}
                            errors={errors}
                            onChange={item.onChange}
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
                            label={item.label}
                            placeholder={"Select " + item.placeholder}
                            name={item.name}
                            isRequired={true}
                            inputRef={register(item.name)}
                            options={item.options}
                            control={control}
                            readOnly={item.disabled}
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
                            label={item.label}
                            placeholder={"Enter " + item.placeholder}
                            name={item.name}
                            isRequired={item.isRequired}
                            inputRef={register(item.name)}
                            type={item.type}
                            control={control}
                            watch={watch}
                            setValue={setValue}
                            clearErrors={clearErrors}
                            isTransparent
                            errors={errors}
                            demoExcel={item.demoExcel}
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
                              control={control}
                              label={item.placeholder}
                              placeholder={"Enter " + item.placeholder}
                              name={item.name}
                              isRequired={item.isRequired}
                              inputRef={register(item.name)}
                              errors={errors}
                              {...item}
                            />
                          </Grid2>
                        )
                      );
                    })}
                  </Grid2>
                </>
              );
            }
          )}
        </FormWrapper>
        <HierarchyWrapper>
          <Button type="submit" width={"auto"}>
            {`${title || "Create"} Onboarding`}
          </Button>
        </HierarchyWrapper>
      </form>
    </StyledModal>
  );
};

export default CreateOnboarding;

export const HierarchyWrapper = styled.div`
  margin-top: 10px;
  position: absolute;
  width: 100%;
  right: 0;
  bottom: 0;
  padding: 10px 40px;
  background-color: #fff;
  border-top: 1px solid #e5e5e5;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  button {
    width: 12rem;
  }
`;

export const FormWrapper = styled.div`
  height: calc(100vh - 130px);
  overflow-x: hidden;
  overflow-y: auto;
  padding-right: 10px;
`;

export const StyledH2 = styled.h2`
  margin: 0 0 1rem 0;
  text-transform: capitalize;
`;
