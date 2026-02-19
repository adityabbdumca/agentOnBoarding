import { StyledModal } from "@/UI-Components/GlobalStyles";
import Input from "@/UI-Components/Input";
import { useForm } from "react-hook-form";
import { Grid2 } from "@mui/material";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import Button from "@/UI-Components/Button";
import { useUpdateExamResult } from "./Service";
import FilePicker from "@/UI-Components/FilePicker";
import { alphanumeric } from "@/HelperFunctions/helperFunctions";

const ExamPassForm = ({ rowData, setOpenTableModal }) => {
  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
    control,
    clearErrors,
    setValue,
  } = useForm();
  const { mutate: updateResult } = useUpdateExamResult(setOpenTableModal);

  const onSubmit = (data) => {
    const payload = {
      user_id: rowData?.data?.id,
      exam_result: rowData?.result,
      roll_no: data?.roll_no,
      file: data?.file[0],
    };
    updateResult(payload);
  };
  return (
    <StyledModal>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid2 container spacing={2}>
          <Grid2 item size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
            <Input
              inputRef={register("roll_no")}
              label="URN No"
              placeholder={"Enter URN No"}
               maxLength={14}
              isRequired={true}
              errors={errors}
              onChange={alphanumeric}
            />
          </Grid2>
          <Grid2 item size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
            <FilePicker
              name={"file"}
              label="Enter Exam Result"
              isRequired={true}
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
        </Grid2>
        <ButtonWrapper style={{ marginTop: "20px" }}>
          <Button width={"auto"} type="submit">
            Submit
          </Button>
        </ButtonWrapper>
      </form>
    </StyledModal>
  );
};

export default ExamPassForm;
