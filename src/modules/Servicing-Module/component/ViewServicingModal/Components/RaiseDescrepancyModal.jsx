import Button from "@/UI-Components/Button";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import Dropdown from "@/UI-Components/Dropdown";
import { StyledModal } from "@/UI-Components/GlobalStyles";
import Input from "@/UI-Components/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { Grid2 } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import useViewServicingModal from "../hooks/useViewServicingModal";
import { toast } from "react-toastify";
import { queryClientGlobal } from "@/lib/tanstack-query/query.config";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";

const RaiseDiscrepancyModal = ({
  modalData,
  setModalData,
  userId,
  closeDiscrepancyModal,
  closeDrawer,
  updateEndorsementStatusMutation,
  buttonId,
  endorsementId,
}) => {
  const schema = Yup.object().shape({
    subDiscrepancyType: Yup.mixed().required(
      "Sub Discrepancy Type is Required"
    ),
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  const {
    services: { getAllDiscrepancyList },
  } = useViewServicingModal({ modalData, setModalData, userId });

  const subDiscrepancyTypeList =
    getAllDiscrepancyList?.data?.data?.data?.map((item) => ({
      value: item?.id,
      label: item?.name,
    })) || [];

  useEffect(() => {
    setValue("discrepancyType", modalData.text);
  }, [modalData, setValue]);

  const onSubmit = async (data) => {
    const payload = {
      endorsement_sub_discrepancy_id: data?.subDiscrepancyType?.value,
      endorsement_status_id: buttonId,
      endorsement_id: endorsementId,
      respond: data?.remark,
    };

    updateEndorsementStatusMutation.mutateAsync(payload).then((res) => {
      toast.success(res?.data?.message);
      closeDiscrepancyModal();
      closeDrawer();
      queryClientGlobal.invalidateQueries([CACHE_KEYS.ENDORSEMENT_UPDATE]);
    });
  };

  return (
    <StyledModal>
      <div onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container spacing={2}>
            <Grid2 item size={{ lg: 12, md: 12, sm: 12 }}>
              <input
                type="hidden"
                {...register("discrepancyId")}
                value={modalData.key}
              />

              <Input
                name="discrepancyType"
                label="Discrepancy"
                placeholder="Enter Discrepancy"
                isRequired={true}
                errors={errors}
                inputRef={register("discrepancyType")}
                readOnly={true}
                watch={watch}
              />
            </Grid2>

            <Grid2 item size={{ lg: 12, md: 12, sm: 12 }}>
              <Dropdown
                name="subDiscrepancyType"
                label="Sub Discrepancy Type"
                control={control}
                options={subDiscrepancyTypeList}
                errors={errors}
                watch={watch}
                isRequired={true}
              />
            </Grid2>

            <Grid2 item size={{ lg: 12, md: 12, sm: 12 }}>
              <Input
                name="remark"
                label="Remark"
                placeholder="Enter Remark"
                errors={errors}
                watch={watch}
                inputRef={register("remark")}
              />
            </Grid2>
          </Grid2>

          <ButtonWrapper style={{ marginTop: "10px" }}>
            <Button
              type="submit"
              width="100px"
              isLoading={updateEndorsementStatusMutation?.isLoading}>
              Submit
            </Button>
          </ButtonWrapper>
        </form>
      </div>
    </StyledModal>
  );
};

export default RaiseDiscrepancyModal;
