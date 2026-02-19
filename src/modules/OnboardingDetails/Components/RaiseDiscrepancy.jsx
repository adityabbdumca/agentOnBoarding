import { useEffect } from "react";
import { StyledModal } from "@/UI-Components/GlobalStyles";
import { Grid2 } from "@mui/material";
import Input from "@/UI-Components/Input";
import Dropdown from "@/UI-Components/Dropdown";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import Button from "@/UI-Components/Button";
import { useCreateDiscrepancy, useGetDiscrepancyList } from "../service";
import FilePicker from "@/UI-Components/FilePicker";

const RaiseDiscrepancy = ({ modalData, setModalData, id, mutate }) => {
  const schema = Yup.object().shape({
    subDiscrepancyType: Yup.mixed().required(
      "Sub Discrepancy Type is Required"
    ),
    // remark: Yup.string().required("Required"),
  });
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    clearErrors,
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });
  const { data } = useGetDiscrepancyList(modalData.key);
  const { mutate: discrepancyMutate } = useCreateDiscrepancy(setModalData);

  const subDiscrepancyTypeList = data?.data?.return_data?.map((item) => ({
    value: item?.sub_desc_id,
    label: item?.sub_desc_name,
  }));
  useEffect(() => {
    // mutate({ master_desc_id: modalData.key });
    setValue("discrepancyType", modalData.text);
  }, [modalData]);

  const onSubmit = (data) => {
    const payload = {
      id,
      user_id: location.search.split("=")[1],
      master_desc_id: +data?.discrepancyId,
      sub_desc_id: data?.subDiscrepancyType?.value,
      discrepancy_type: data?.discrepancyType,
      discrepancy_subtype: data?.subDiscrepancyType?.label,
      message: data?.remark,
      attachment: data?.attachment?.[0],
    };
    !mutate && discrepancyMutate(payload);

    mutate &&
      mutate({
        type: "reject",
        id: modalData?.data?.user_id,
        master_desc_id: modalData?.data?.master_desc_id,
      });
  };
  return (
    <StyledModal>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid2 container spacing={2}>
          <Grid2 item size={{ lg: 12, md: 12, sm: 12 }}>
            <input
              type="hidden"
              {...register("discrepancyId")}
              value={modalData.key}
            />
            <Input
              name={"discrepancyType"}
              label="Discrepancy"
              placeholder={"Enter Discrepancy"}
              isRequired={true}
              errors={errors}
              inputRef={register("discrepancyType")}
              readOnly={true}
              watch={watch}
            />
          </Grid2>
          <Grid2 item size={{ lg: 12, md: 12, sm: 12 }}>
            <Dropdown
              name={"subDiscrepancyType"}
              label={"Sub Discrepancy Type"}
              control={control}
              options={subDiscrepancyTypeList}
              errors={errors}
              watch={watch}
              isRequired={true}
            />
          </Grid2>
          <Grid2 item size={{ lg: 12, md: 12, sm: 12 }}>
            <Input
              name={"remark"}
              label={"Remark"}
              watch={watch}
              errors={errors}
              placeholder={"Enter Remark"}
              inputRef={register("remark")}
            />
          </Grid2>
          {/* <Grid2 item size={{ lg: 12, md: 12, sm: 12 }}>
            <FilePicker
              isTransparent={true}
              clearErrors={clearErrors}
              name={"attachment"}
              label={"Add Attachment"}
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
          </Grid2> */}
        </Grid2>
        <ButtonWrapper style={{ marginTop: "10px" }}>
          <Button type="submit" width={"100px"}>
            Submit
          </Button>
        </ButtonWrapper>
      </form>
    </StyledModal>
  );
};

export default RaiseDiscrepancy;
