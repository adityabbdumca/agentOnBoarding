import { StyledModal } from "@/UI-Components/GlobalStyles";
import { useForm } from "react-hook-form";
import Input from "@/UI-Components/Input";
import { Grid2 } from "@mui/material";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import Button from "@/UI-Components/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAddAndUpdateIFSC } from "./service";
import {
  allowOnlyName,
  handleIFSCInput,
} from "@/HelperFunctions/helperFunctions";

const AddIFSC = ({ setOpenModal, data, title }) => {
  const ifscSchema = yup.object().shape({
    ifsc_code: yup.string().required("IFSC Code is required"),
    bank_name: yup.string().required("Bank Name is required"),
    branch_name: yup.string().required("Branch Name is required"),
    address: yup.string().required("Address is required"),
    bank_city: yup.string().required("City is required"),
    state: yup.string().required("State is required"),
    district: yup.string().required("District is required"),
  });
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: data || {},
    resolver: yupResolver(ifscSchema),
  });

  const { mutate } = useAddAndUpdateIFSC(setOpenModal);
  const onSubmit = (data) => {
    mutate(data);
  };
  return (
    <StyledModal>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2 item size={{ lg: 4, md: 6, sm: 12 }}>
            <Input
              label="IFSC Code"
              name="ifsc_code"
              errors={errors}
              isRequired={true}
              watch={watch}
              placeholder={"Enter IFSC Code"}
              inputRef={register("ifsc_code")}
              maxLength={11}
              onChange={(e) => {
                const value = e.target.value;
                handleIFSCInput(e);
                if (!value || value.length < 11) {
                  setValue("bank_name", "");
                  setValue("bank_city", "");
                  setValue("branch_name", "");
                }
              }}
            />
          </Grid2>
          <Grid2 item size={{ lg: 4, md: 6, sm: 12 }}>
            <Input
              label="Bank Name"
              name="bank_name"
              errors={errors}
              isRequired={true}
              watch={watch}
              placeholder={"Enter Bank Name"}
              inputRef={register("bank_name")}
              onChange={allowOnlyName}
              maxLength={100}
            />
          </Grid2>
          <Grid2 item size={{ lg: 4, md: 6, sm: 12 }}>
            <Input
              label="Branch Name"
              name="branch_name"
              errors={errors}
              isRequired={true}
              watch={watch}
              placeholder={"Enter Branch Name"}
              inputRef={register("branch_name")}
              onChange={allowOnlyName}
              maxLength={100}
            />
          </Grid2>
          <Grid2 item size={{ lg: 4, md: 6, sm: 12 }}>
            <Input
              label="District"
              name="district"
              errors={errors}
              isRequired={true}
              watch={watch}
              placeholder={"Enter District"}
              inputRef={register("district")}
              onChange={allowOnlyName}
              maxLength={100}
            />
          </Grid2>
          <Grid2 item size={{ lg: 4, md: 6, sm: 12 }}>
            <Input
              label="City"
              errors={errors}
              isRequired={true}
              watch={watch}
              name="bank_city"
              placeholder={"Enter City"}
              inputRef={register("bank_city")}
              onChange={allowOnlyName}
              maxLength={100}
            />
          </Grid2>
          <Grid2 item size={{ lg: 4, md: 6, sm: 12 }}>
            <Input
              label="State"
              name="state"
              errors={errors}
              isRequired={true}
              watch={watch}
              placeholder={"Enter State"}
              inputRef={register("state")}
              onChange={allowOnlyName}
              maxLength={100}
            />
          </Grid2>
          <Grid2 item size={{ lg: 12, md: 12, sm: 12 }}>
            <Input
              label="Address"
              errors={errors}
              isRequired={true}
              watch={watch}
              name="address"
              placeholder={"Enter Address"}
              inputRef={register("address")}
              maxLength={100}
              onChange={(e) =>
                (e.target.value = e.target.value.replace(
                  /[^A-Za-z0-9\s,.-/]|(\s{2,})/g,
                  ""
                ))
              }
            />
          </Grid2>
        </Grid2>
        <ButtonWrapper style={{ marginTop: "20px" }}>
          <Button variant="contained" width={"auto"} type={"submit"}>
            {title}
          </Button>
        </ButtonWrapper>
      </form>
    </StyledModal>
  );
};

export default AddIFSC;
