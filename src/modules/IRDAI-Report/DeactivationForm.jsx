import { StyledModal } from "@/UI-Components/GlobalStyles";
import { useForm } from "react-hook-form";
import { Grid2 } from "@mui/material";
import Dropdown from "@/UI-Components/Dropdown";
import Button from "@/UI-Components/Button";
import { ReactDatePicker } from "@/UI-Components/DatePicker";
import Input from "@/UI-Components/Input";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import { useDeactivateAgent } from "./service";
import moment from "moment";
import { fileValidation } from "../OnboardingDetails/Schema";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FilePicker from "@/UI-Components/FilePicker";

const DeactivationForm = ({ rowData, setOpenModal }) => {
  const schema = Yup.object({
    deactivation_type: Yup.mixed().required("Deactivation Type is Required"),
    deactivation_date: Yup.date().required("Deactivation Date is Required"),
    deactivation_remarks: Yup.string().required("Remarks is Required"),
    deactivation_doc: fileValidation,
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    clearErrors,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const { mutate } = useDeactivateAgent(setOpenModal);
  const { deactivation_type } = watch();
  const onSubmit = (data) => {
    const payload = {
      id: rowData?.rowData?.id,
      deactivation_type: data?.deactivation_type?.value,
      deactivation_date: moment(data?.deactivation_date).format("YYYY-MM-DD"),
      deactivation_remark: data?.deactivation_remarks,
      deactivation_doc: data?.deactivation_doc?.[0],
    };
    mutate(payload);
  };

  return (
    <StyledModal>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid2 container spacing={2}>
          <Grid2 item size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
            <Dropdown
              name="deactivation_type"
              label="Deactivation Type"
              placeholder={"Select Deactivation Type"}
              errors={errors}
              isRequired={true}
              control={control}
              options={[
                { label: "Termination", value: "Termination" },
                { label: "NOC", value: "NOC" },
              ]}
            />
          </Grid2>
          <Grid2 item size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
            <ReactDatePicker
              control={control}
              isRequired={true}
              errors={errors}
              name="deactivation_date"
              label={`${
                deactivation_type ? deactivation_type?.value : ""
              } Date`}
              placeholder={"Select Deactivation Date"}
              inputRef={register("deactivation_date")}
            />
          </Grid2>
          <Grid2 item size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
            <Input
              name="deactivation_remarks"
              isRequired={true}
              errors={errors}
              label="Remarks"
              placeholder={"Enter Remarks"}
              inputRef={register("deactivation_remarks")}
            />
          </Grid2>
          <Grid2 item size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
            <FilePicker
              isTransparent={true}
              clearErrors={clearErrors}
              name={"deactivation_doc"}
              label={"Add Attachment"}
              isRequired={true}
              errors={errors}
              control={control}
              watch={watch}
              setValue={setValue}
              isMulti={false}
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
          <Button type={"submit"} variant="contained" width={"auto"}>
            Submit
          </Button>
        </ButtonWrapper>
      </form>
    </StyledModal>
  );
};

export default DeactivationForm;
