import { StyledModal } from "@/UI-Components/GlobalStyles";
import { useForm } from "react-hook-form";
import { Grid2 } from "@mui/material";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import Button from "@/UI-Components/Button";
import styled from "styled-components";
import excel from "@/assets/images/excel.svg";
import Dropdown from "@/UI-Components/Dropdown";
import { useGetBranchName } from "../BranchOnboarding/service";
import { fileValidation } from "../OnboardingDetails/Schema";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FilePicker from "@/UI-Components/FilePicker";

const UploadExcel = ({ data, onSubmit, isBranch }) => {
  const schema = yup.object().shape({
    excel: fileValidation,
    type: yup.mixed().test("required", "Branch Type is required", (value) => {
      return isBranch ? !!value : true;
    }),
    name: yup.mixed().test("required", "Branch Name is required", (value) => {
      return isBranch ? !!value : true;
    }),
  });
  const {
    handleSubmit,
    clearErrors,
    watch,
    control,
    setValue,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const demoExcel = data?.data?.file_url;

  const { data: branchName } = useGetBranchName(watch("type")?.label);

  return (
    <StyledModal>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid2 container spacing={2}>
          {isBranch && (
            <>
              <Grid2 item size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
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
                />
              </Grid2>
              <Grid2 item size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Dropdown
                  name="name"
                  label={`${watch("type")?.label || "Branch"} Name`}
                  options={branchName?.data?.return_data || []}
                  isRequired={true}
                  errors={errors}
                  control={control}
                  inputRef={register("type")}
                />
              </Grid2>
            </>
          )}
          <Grid2 item size={{ lg: 12, md: 12, sm: 12 }}>
            <FilePicker
              isTransparent={true}
              isExcel={true}
              clearErrors={clearErrors}
              name={"excel"}
              label={`Upload Excel`}
              control={control}
              watch={watch}
              setValue={setValue}
              errors={errors}
              isMulti={false}
              acceptedFiles={{
                "application/vnd.ms-excel": [".xls", ".xlsx"],
              }}
            />
          </Grid2>
          <StyledDiv style={{ height: "50px", width: "100%" }}>
            <span
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <img src={excel} height={20} width={20} /> Download Excel Format
            </span>
            {demoExcel && (
              <StyledButton onClick={() => window.open(demoExcel, "_blank")}>
                Download
              </StyledButton>
            )}
          </StyledDiv>
        </Grid2>
        <ButtonWrapper style={{ marginTop: "20px", marginRight: "7px" }}>
          <Button variant="contained" type="submit" width={"auto"}>
            Submit
          </Button>
        </ButtonWrapper>
      </form>
    </StyledModal>
  );
};

const StyledDiv = styled.div`
  width: 100%;
  height: 50px;
  background: #ddf1f1;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
  font-family: ${({ theme }) => theme.fontFamily};
  font-size: 14px;
  color: #2e7d32;
  font-weight: 600;
`;
const StyledButton = styled.button`
  border: none;
  border-radius: 8px;
  background: #ddfff4;
  padding: 5px;
  color: #2e7d32;
  cursor: pointer;
  &:hover {
    background: #2e7d32;
    color: white;
    transition: all 0.2s ease-in-out;
  }
  font-weight: 600;
  font-family: ${({ theme }) => theme.fontFamily};
`;
export default UploadExcel;
