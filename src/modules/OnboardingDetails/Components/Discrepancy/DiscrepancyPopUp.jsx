import { StyledModal } from "@/UI-Components/GlobalStyles";
import { useForm } from "react-hook-form";
import { Grid2 } from "@mui/material";
import Input from "@/UI-Components/Input";
import Button from "@/UI-Components/Button";
import { useUpdateDiscrepancy } from "../../service";
import FilePicker from "@/UI-Components/FilePicker";

const DiscrepancyPopUp = ({ rowData, setOpenModal }) => {
  const { handleSubmit, watch, clearErrors, setValue, control, register } =
    useForm();
  const { mutate } = useUpdateDiscrepancy(setOpenModal);
  const onSubmit = (data) => {
    const payload = {
      id: rowData?.user_id,
      master_desc_id: rowData?.master_desc_id,
      // id: rowData?.id,
      comment: data?.comment,
      ...(rowData?.isNoc
        ? {
            commission_letter: data?.commission_letter[0],
            appointment_letter: data?.appointment_letter[0],
          }
        : { update_discrepancy_path: data?.file[0] }),
    };
    mutate(payload);
  };
  return (
    <StyledModal>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid2 container spacing={2}>
          {rowData?.isNoc ? (
            <>
              <Grid2 item size={{ lg: 12, md: 12, sm: 12 }}>
                <FilePicker
                  isTransparent={true}
                  clearErrors={clearErrors}
                  name={"commission_letter"}
                  label={`Add Commision Letter`}
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
              <Grid2 item size={{ lg: 12, md: 12, sm: 12 }}>
                <FilePicker
                  isTransparent={true}
                  clearErrors={clearErrors}
                  name={"appointment_letter"}
                  label={`Add Appointment Letter `}
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
            </>
          ) : (
            <Grid2 item size={{ lg: 12, md: 12, sm: 12 }}>
              <FilePicker
                isTransparent={true}
                clearErrors={clearErrors}
                name={"file"}
                label={`Add ${rowData?.master_desc_name || "File"} `}
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
          )}
          <Grid2 item size={{ lg: 12, md: 12, sm: 12 }}>
            <Input
              isTransparent={true}
              clearErrors={clearErrors}
              name={"comment"}
              inputRef={register("comment")}
              label={"Add Comment"}
              placeholder={"Add Comment"}
              control={control}
              watch={watch}
              setValue={setValue}
              isMulti={false}
            />
          </Grid2>
        </Grid2>
        <div className="flex justify-end mt-4">
          <Button type="submit" width={"auto"}>
            Submit
          </Button>
        </div>
      </form>
    </StyledModal>
  );
};

export default DiscrepancyPopUp;
