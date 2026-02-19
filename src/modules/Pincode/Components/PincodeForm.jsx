import { useEffect } from "react";
import { StyledModal } from "@/UI-Components/GlobalStyles";
import Input from "@/UI-Components/Input";
import Dropdown from "@/UI-Components/Dropdown";
import { useForm } from "react-hook-form";
import { useAddAndUpdatePincode, useGetCity, useGetStates } from "../service";
import Button from "@/UI-Components/Button";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { verifyValidPincode } from "@/HelperFunctions/helperFunctions";

const PincodeForm = ({ data, setModal }) => {
  const Schema = yup.object().shape({
    pincode: yup.string().required("Pincode is required"),
    state_id: yup.mixed().required("State is required"),
    city_id: yup.mixed().required("City is required"),
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    register,
    watch,
  } = useForm({
    resolver: yupResolver(Schema),
  });

  const { data: stateData } = useGetStates();

  const state = stateData?.data?.return_data?.map((item) => {
    return {
      label: item?.state_name,
      value: item?.state_code,
      id: item?.state_id,
    };
  });
  const { data: cityData } = useGetCity(watch("state_id")?.id);

  const city = cityData?.data?.return_data?.map((item) => {
    return {
      label: item?.city_name,
      value: item?.city_id,
      id: item?.city_id,
    };
  });

  useEffect(() => {
    if (data) {
      setValue("pincode", data?.pincode);
      setValue("state_id", {
        label: data?.state_name,
        value: data?.state_id,
        id: data?.state_id,
      });
      setValue("city_id", {
        label: data?.city_name,
        value: data?.city_id,
        id: data?.city_id,
      });
      setValue("pincode_id", data?.pincode_id);
    }
  }, [data]);

  const { mutate: addAndUpdatePincode } = useAddAndUpdatePincode(setModal);

  const onSubmit = (data) => {
    addAndUpdatePincode({
      ...data,
      state_id: data?.state_id?.id,
      city_id: data?.city_id?.id,
    });
  };
  return (
    <StyledModal>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Input
              label={"Pincode"}
              placeholder={"Enter Pincode"}
              inputRef={register("pincode")}
              errors={errors}
              isRequired={true}
              watch={watch}
              name={"pincode"}
              onChange={(e) => {
                return (e.target.value = verifyValidPincode(e));
              }}
              maxLength={6}
            />
          </div>
          <div>
            <Dropdown
              label={"State"}
              placeholder={"Select State"}
              options={state || []}
              control={control}
              errors={errors}
              isRequired={true}
              watch={watch}
              name={"state_id"}
            />
          </div>
          <div>
            <Dropdown
              label={"City"}
              placeholder={"Select City"}
              options={city || []}
              control={control}
              errors={errors}
              isRequired={true}
              watch={watch}
              name={"city_id"}
            />
          </div>
        </div>
        <div className="flex items-center justify-end">
          <Button type={"submit"} width={"auto"}>
            {!data ? "Add" : "Update"}
          </Button>
        </div>
      </form>
    </StyledModal>
  );
};

export default PincodeForm;
