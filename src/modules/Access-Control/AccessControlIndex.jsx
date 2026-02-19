import { useState } from "react";
import MasterTable from "@/Components/MasterTable";
import Dropdown from "@/UI-Components/Dropdown";
import { useForm } from "react-hook-form";
import { useGetRoleMaster } from "../RoleMaster/Service";
import { useAccessControl } from "./Service";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
const AccessControlIndex = () => {
  const { control, watch } = useForm();
  const { data } = useGetRoleMaster();
  const [searchData, setSearchData] = useState({
    id: "",
  });
  const { mutate: giveAccess } = useAccessControl();
  const roleOptions =
    data?.data?.return_data?.map((item) => ({
      label: item?.name,
      value: item?.id,
    })) || [];

  return (
    <MainContainer
      heading={"Access Control"}
      subHeading={
        "Permission settings and role assignments management interface"
      }
    >
      <MasterTable
        api={"getMenuPermissions"}
        payload={searchData}
        noDataText="Select a value from Dropdown to fetch data"
        renderTopToolbarCustomActions={() => {
          return (
            <form className="w-full flex items-center justify-end">
              <div className="w-1/4">
                <Dropdown
                  name="role"
                  control={control}
                  placeholder="Select Role"
                  options={roleOptions}
                  onChange={(e) => setSearchData({ id: e?.value })}
                />
              </div>
            </form>
          );
        }}
        watch={watch()}
        mutateObj={[giveAccess]}
      />
    </MainContainer>
  );
};

export default AccessControlIndex;
