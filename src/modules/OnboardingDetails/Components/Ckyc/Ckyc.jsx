import {
  allowOnlyNumbers,
  formatAadhaarInput,
} from "@/HelperFunctions/helperFunctions";
import Button from "@/UI-Components/Button";
import Dropdown from "@/UI-Components/Dropdown";
import Input from "@/UI-Components/Input";
import RadioButton from "@/UI-Components/RadioButton";
import { Grid2 } from "@mui/material";
import { useEffect } from "react";
import {
  HiArrowNarrowLeft,
  HiArrowNarrowRight,
  HiOutlineRefresh,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { decrementAgent } from "../../agent.slice";
import { useCkycData } from "../../service";

const Ckyc = ({
  register,
  errors,
  watch,
  handleSubmit,
  id,
  control,
  setValue,
  showSubmitButton,
}) => {
  const { mutate: ckycMutate, isPending } = useCkycData();

  const { agent } = useSelector((state) => state.agent);

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      watch("profile.aadhar_no")?.length >= 12 &&
      !watch("ckyc.ckyc_number")
    ) {
      setValue("ckyc.ckyc_type", { label: "Aadhar", value: "Aadhar" });
      setValue("ckyc.ckyc", "N");
      setValue("ckyc.ckyc_number", watch("profile.aadhar_no"));
    }
  }, [watch("profile.aadhar_no")]);

  const onSubmit = (data) => {
    const payload = {
      id,
      ...(data?.ckyc?.ckyc === "Y" && {
        ckyc_number: data?.ckyc?.ckyc_number,
      }),
      ...(data?.ckyc?.ckyc_type?.value &&
        data?.ckyc?.ckyc_number && {
          [data?.ckyc?.ckyc_type?.value]: String(data?.ckyc?.ckyc_number)
            .split("-")
            .join(""),
        }),
    };

    ckycMutate(payload);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <RadioButton
          name="ckyc.ckyc"
          label="Do you have CKYC?"
          options={[
            { label: "Yes", value: "Y" },
            { label: "No", value: "N" },
          ]}
          control={control}
          onChange={() => {
            setValue("ckyc.ckyc_type", "");
            setValue("ckyc.ckyc_number", "");
          }}
        />
        <Grid2 container spacing={2} style={{ marginTop: "10px" }}>
          {watch("ckyc.ckyc") === "N" && (
            <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
              <Dropdown
                name="ckyc.ckyc_type"
                control={control}
                errors={errors}
                isRequired
                placeholder="Select CKYC Type"
                label="Select CKYC Type"
                options={[
                  { label: "Aadhar", value: "Aadhar" },
                  { label: "PAN", value: "PAN" },
                ]}
                onChange={() => {
                  setValue("ckyc.ckyc_number", "");
                }}
              />
            </Grid2>
          )}
          <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }}>
            <Input
              name="ckyc.ckyc_number"
              inputRef={register("ckyc.ckyc_number")}
              label={`Enter ${
                watch("ckyc.ckyc_type")?.value ||
                (watch("ckyc.ckyc") === "Y" ? "CKYC" : "")
              } Number`}
              control={control}
              maxLength={
                watch("ckyc.ckyc_type")?.value === "Aadhar"
                  ? 14
                  : watch("ckyc.ckyc_type")?.value === "PAN"
                  ? 10
                  : 14
              }
              errors={errors}
              onChange={(e) => {
                watch("ckyc.ckyc_type")?.value === "Aadhar"
                  ? formatAadhaarInput(e)
                  : watch("ckyc.ckyc_type")?.value === "PAN"
                  ? (e.target.value = e.target.value.toUpperCase())
                  : allowOnlyNumbers(e);
              }}
              placeholder={`Enter ${
                watch("ckyc.ckyc_type")?.value ||
                (watch("ckyc.ckyc") === "Y" ? "CKYC" : "")
              } Number`}
              isRequired={true}
            />
          </Grid2>
          {/* <Grid2 item size={{ lg: 2, md: 6, sm: 12 }}>
            <ButtonWrapper style={{ marginTop: "20px" }}>
              <Button
                width={"auto"}
                variant={"outlined"}
                //required comment
                // onClick={() => {
                //   getCkyc({ id_number: watch("ckyc"), document_type: "PAN" });
                // }}
              >
                Validate Ckyc
              </Button>
            </ButtonWrapper>
          </Grid2> */}
        </Grid2>
        <div className="mt-4 flex justify-between gap-2">
          {agent > 0 ? (
            <Button
              startIcon={<HiArrowNarrowLeft size={15} />}
              variant={"outlined"}
              width={"auto"}
              onClick={() => {
                dispatch(decrementAgent());
              }}
            >
              Back
            </Button>
          ) : (
            <div />
          )}
          {showSubmitButton && (
            <Button
              type="submit"
              width={"auto"}
              disabled={isPending}
              endIcon={
                isPending ? (
                  <HiOutlineRefresh className="animate-spin" size={15} />
                ) : (
                  <HiArrowNarrowRight size={15} />
                )
              }
            >
              {watch("approval_access") ? "Next" : "Submit"}
            </Button>
          )}
        </div>
      </form>
    </>
  );
};

export default Ckyc;
