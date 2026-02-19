import { useEffect } from "react";
import { StyledModal } from "@/UI-Components/GlobalStyles";
import Input from "@/UI-Components/Input";
import { useForm } from "react-hook-form";
import Dropdown from "@/UI-Components/Dropdown";
import Button from "@/UI-Components/Button";
import {
  useGetRoleMaster,
  useCreateRole,
  useGetVertical,
  useUpdateRole,
} from "./Service";

const CreateRole = ({ modalTitle, rowData, setOpenModal }) => {
  const { register, handleSubmit, control, setValue } = useForm();
  const { data } = useGetRoleMaster();
  const { mutate: createRole } = useCreateRole(setOpenModal);
  const { mutate: updateRole } = useUpdateRole(setOpenModal);
  const { data: verticalData } = useGetVertical();
  const roleOptions =
    data?.data?.return_data?.map((item) => ({
      label: item.name,
      value: item.id,
    })) || [];

  const verticalList =
    verticalData?.data?.return_data?.map((item) => ({
      value: item?.id,
      label: item?.vertical_name,
    })) || [];

  useEffect(() => {
    if (modalTitle === "Edit" && rowData) {
      setValue("role_name", rowData?.name);
      setValue("reporting_to", {
        label: rowData?.reporting_to_name,
        value: rowData?.reporting_to,
      });
      setValue("vertical", {
        label: rowData?.vertical_name,
        value: rowData?.vertical_id,
      });
    }
  }, [rowData]);

  const onSubmit = (data) => {
    if (modalTitle === "Edit") {
      const payload = {
        role_name: data?.role_name,
        reporting_to: data?.reporting_to?.value,
        vertical_id: data?.vertical?.value,
      };
      updateRole({ payload, id: rowData?.id });
    } else {
      createRole({
        role_name: data?.role_name,
        reporting_to: data?.reporting_to?.value,
        vertical_id: data?.vertical?.value,
      });
    }
  };
  return (
    <StyledModal>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div className="grid grid-cols-3 gap-4 md:grid-cols-1">
          <div>
            <Dropdown
              control={control}
              name="vertical"
              label="Select Vertical"
              isRequired={true}
              options={verticalList}
              placeholder="Select Vertical"
            />
          </div>
          <div>
            <Input
              name="role_name"
              label="Role Name"
              isRequired={true}
              placeholder="Enter Role Name"
              inputRef={register("role_name")}
            />
          </div>
          <div>
            <Dropdown
              name="reporting_to"
              label="Reporting To"
              control={control}
              options={roleOptions}
              //   watch={watch}
              placeholder="Select Reporting To"
            />
          </div>
        </div>
        <div className="flex items-center justify-end">
          <Button variant="contained" type="submit" width={"auto"}>
            Submit
          </Button>
        </div>
      </form>
    </StyledModal>
  );
};

export default CreateRole;
