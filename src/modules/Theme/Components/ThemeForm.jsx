import { StyledModal } from "@/UI-Components/GlobalStyles";
import ThemePreview from "./ThemePreview";
import { useForm } from "react-hook-form";
import Input from "@/UI-Components/Input";
import { Grid2 } from "@mui/material";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import Button from "@/UI-Components/Button";
import { useCreateAndUpdateTheme } from "../service";

const ThemeForm = ({ data, setOpen }) => {
  const {
    register,
    formState: { errors },
    watch,
    control,
    handleSubmit,
  } = useForm({
    defaultValues: data?.data || {
      primaryColor: "",
      secondaryColor: "",
      tertiaryColor: "",
      buttonsColor: "",
      textColor: "",
      fontFamily: "Manrope",
      themeName: "",
    },
  });

  const { mutate } = useCreateAndUpdateTheme(setOpen);

  const onSubmit = (formData) => {
    const { created_at, updated_at, ...payload } = formData;
    mutate(payload);
    // dispatch(setTheme(data));
  };
  return (
    <StyledModal>
      <ThemePreview
        colorValue={watch()}
        register={register}
        control={control}
        errors={errors}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid2 container spacing={2} sx={{ mt: 2 }}>
          <Grid2 item size={{ lg: 6, md: 6, sm: 12 }}>
            <Input
              label="Theme Name"
              type="text"
              name="themeName"
              inputRef={register("themeName")}
              errors={errors}
              isRequired={true}
            />
          </Grid2>
          <Grid2 item size={{ lg: 6, md: 6, sm: 12 }}>
            <Input
              label="Primary Color"
              type="color"
              name="primaryColor"
              inputRef={register("primaryColor")}
              errors={errors}
              isRequired={true}
            />
          </Grid2>
          <Grid2 item size={{ lg: 6, md: 6, sm: 12 }}>
            <Input
              label="Secondary Color"
              type="color"
              name="secondaryColor"
              inputRef={register("secondaryColor")}
              errors={errors}
              isRequired={true}
            />
          </Grid2>
          <Grid2 item size={{ lg: 6, md: 6, sm: 12 }}>
            <Input
              label="Tertiary Color"
              type="color"
              name="tertiaryColor"
              inputRef={register("tertiaryColor")}
              errors={errors}
              isRequired={true}
            />
          </Grid2>
          <Grid2 item size={{ lg: 6, md: 6, sm: 12 }}>
            <Input
              label="Buttons Color"
              type="color"
              name="buttonsColor"
              inputRef={register("buttonsColor")}
              errors={errors}
              isRequired={true}
            />
          </Grid2>
          <Grid2 item size={{ lg: 6, md: 6, sm: 12 }}>
            <Input
              label="Text Color"
              type="color"
              name="textColor"
              inputRef={register("textColor")}
              errors={errors}
              isRequired={true}
            />
          </Grid2>
        </Grid2>
        <ButtonWrapper style={{ margin: "20px 0px" }}>
          <Button variant="contained" type="submit">
            {data?.modalTitle}
          </Button>
        </ButtonWrapper>
      </form>
    </StyledModal>
  );
};

export default ThemeForm;
