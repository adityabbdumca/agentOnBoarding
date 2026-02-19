import { Grid2 } from "@mui/material";
import Input from "./Input";
import Dropdown from "./Dropdown";
import FilePicker from "./FilePicker";
import { Controller } from "react-hook-form";
import UiDateInput from "./UiDateInput";

const RenderFormFields = ({
  item,
  register,
  errors,
  control,
  watch,
  setValue,
  clearErrors,
}) => {
  return (
    <>
      {item.dependsOnValue?.length > 0 &&
      !item.dependsOnValue?.includes(
        watch(`${item.dependsOn}`)?.value || watch(`${item.dependsOn}`)
      ) ? null : item.type === "input" ? (
        <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }} key={item.id}>
          <Input
            {...item}
            label={item.label}
            placeholder={"Enter " + item.label}
            name={`${item.name}`}
            inputRef={register(`${item.name}`)}
            errors={errors}
          />
        </Grid2>
      ) : item.type === "dropdown" ? (
        <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }} key={item.id}>
          <Dropdown
            {...item}
            label={item.label}
            placeholder={"Select " + item.placeholder || item.label}
            name={`${item.name}`}
            inputRef={register(`${item.name}`)}
            options={item.options}
            control={control}
            errors={errors}
          />
        </Grid2>
      ) : item.type === "file" ? (
        <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }} key={item.id}>
          <FilePicker
            {...item}
            label={item.label}
            placeholder={"Enter " + item.label}
            name={`${item.name}`}
            inputRef={register(`${item.name}`)}
            // type={item.type}
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
          <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }} key={item.id}>
            {/* <Input
              {...item}
              type="date"
              label={item.label}
              placeholder={"Enter " + item.label}
              name={`${item.name}`}
              inputRef={register(`${item.name}`)}
              errors={errors}
              control={control}
            /> */}
            <Controller
              control={control}
              name={`${item.name}`}
              render={({ field, fieldState }) => {
                return (
                  <UiDateInput
                    label={item.label}
                    value={field.value}
                    onChange={field?.onChange}
                    errors={fieldState?.error?.message}
                  />
                );
              }}
            />
          </Grid2>
        )
      )}
    </>
  );
};

export default RenderFormFields;
