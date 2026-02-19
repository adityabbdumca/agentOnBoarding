import React, { useEffect } from "react";
import { StyledModal } from "@/UI-Components/GlobalStyles";
import { Grid2 } from "@mui/material";
import Input from "@/UI-Components/Input";
import { useForm } from "react-hook-form";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import Button from "@/UI-Components/Button";
import Dropdown from "@/UI-Components/Dropdown";
import { useAddEvent } from "./Service";

const AddEvent = ({ setOpen, rowData }) => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
  } = useForm();
  const { mutate: addEvent } = useAddEvent(setOpen);
  useEffect(() => {
    if (rowData) {
      setValue("name", rowData?.name);
      rowData?.status === 1
        ? setValue("active", { value: 1, label: "Active" })
        : setValue("active", { value: 0, label: "Inactive" });
    }
  }, [rowData]);
  const onSubmit = (data) => {
    addEvent({
      ...(rowData?.id && { id: rowData?.id }),
      name: data?.name,
      status: data.active?.value,
    });
  };
  return (
    <StyledModal>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid2 container spacing={2}>
          <Grid2 item size={{ lg: 6, md: 4, sm: 12 }}>
            <Input
              name={"name"}
              inputRef={register("name")}
              label={"Event Name"}
              placeholder={"Event Name"}
            />
          </Grid2>
          <Grid2 item size={{ lg: 6, md: 4, sm: 12 }}>
            <Dropdown
              name={"active"}
              control={control}
              options={[
                { value: 1, label: "Active" },
                { value: 0, label: "InActive" },
              ]}
              label={"Active Status"}
              placeholder={"Active Status"}
            />
          </Grid2>
        </Grid2>
        <ButtonWrapper>
          <Button width={"auto"} type={"submit"}>
            Submit
          </Button>
        </ButtonWrapper>
      </form>
    </StyledModal>
  );
};

export default AddEvent;
