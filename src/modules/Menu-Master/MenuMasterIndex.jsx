import React from "react";
import { StyledBg, StyledContainer } from "@/UI-Components/GlobalStyles";
import Header from "@/Components/Header/Header";
import { useAddMenu } from "./Service";
import { useForm } from "react-hook-form";
import { Grid2 } from "@mui/material";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import Button from "@/UI-Components/Button";
import Input from "@/UI-Components/Input";

const MenuMasterIndex = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { mutate } = useAddMenu();
  return (
    <StyledBg>
      <Header title="Menu Master" />
      <StyledContainer>
        <form onSubmit={handleSubmit((data) => mutate(data))}>
          <Grid2 container spacing={2}>
            <Grid2 item size={{ lg: 3 }}>
              <Input
                name={"name"}
                label={"Menu Name"}
                placeholder={"Enter Menu Name"}
                inputRef={register("name")}
              />
            </Grid2>
            <Grid2 item size={{ lg: 3 }}>
              <Input
                label={"Menu URL"}
                name={"route"}
                placeholder={"Enter Menu URL"}
                inputRef={register("route")}
              />
            </Grid2>
          </Grid2>
          <ButtonWrapper>
            <Button type={"submit"} width={"auto"}>
              Submit
            </Button>
          </ButtonWrapper>
        </form>
      </StyledContainer>
    </StyledBg>
  );
};

export default MenuMasterIndex;
