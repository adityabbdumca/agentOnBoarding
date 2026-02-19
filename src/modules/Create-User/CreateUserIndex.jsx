import { ActionContainer } from "@/UI-Components/GlobalStyles";
import { Tooltip } from "@mui/material";
import MasterTable from "@/Components/MasterTable";
import Button from "@/UI-Components/Button";
import Drawer from "@/UI-Components/Drawer";
import CreateUser from "./CreateUser";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { useGetUserExport, useSetActiveUser } from "./service";
import Input from "@/UI-Components/Input";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import { HiOutlinePencilAlt, HiUserAdd } from "react-icons/hi";
import { useState } from "react";
import { debounce } from "lodash";
import CustomSwitch from "@/UI-Components/CustomSwitch";
import { useForm } from "react-hook-form";

const CreateUserIndex = () => {
  const [searchData, setSearchData] = useState({});
  const { control } = useForm();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [rowData, setRowData] = useState(null);
  const { mutate: exportExcel } = useGetUserExport();
  const { mutate } = useSetActiveUser();
  return (
    <MainContainer
      heading={"Create User"}
      subHeading={
        "Provide detailed agent information below to successfully register a new Insurance Agent and maintain accurate operational and compliance records."
      }
      pageActions={
        <Button
          variant="outlined"
          width={"auto"}
          onClick={() => setIsDrawerOpen(true)}
          startIcon={<HiUserAdd />}
        >
          Create User
        </Button>
      }
    >
      <MasterTable
        api={"getUserList"}
        isActions={true}
        payload={searchData}
        customCellRenderers={{
          status_label: ({ row }) => {
            const val =
              row.getValue("status_label") === "Active" ? true : false;
            return (
              <span className="capitalize">
                <CustomSwitch
                  control={control}
                  name={`status_${row?.id}`}
                  defaultValue={val}
                  onChange={(e) => {
                    mutate({
                      user_id: row?.original?.user_id,
                      status: e.target.checked ? "Active" : "Inactive",
                    });
                  }}
                />
              </span>
            );
          },
        }}
        renderTopToolbarCustomActions={() => {
          return (
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outlined"
                width={"auto"}
                startIcon={<PiMicrosoftExcelLogoFill />}
                sx={{ fontSize: "12px !important" }}
                onClick={() => {
                  exportExcel();
                }}
              >
                Export
              </Button>
              <Input
                name="search_value"
                placeholder={"Search Table"}
                onChange={debounce(
                  (e) => setSearchData({ search_value: e.target.value }),
                  300
                )}
              />
            </div>
          );
        }}
        customActions={({ row }) => (
          <ActionContainer style={{ justifyContent: "start" }}>
            <Tooltip title="Edit" arrow placement="top">
              <div
                onClick={() => {
                  setIsDrawerOpen(true), setRowData(row?.original);
                }}
              >
                <HiOutlinePencilAlt />
              </div>
            </Tooltip>
          </ActionContainer>
        )}
      />
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <CreateUser setIsDrawerOpen={setIsDrawerOpen} rowData={rowData} />
      </Drawer>
    </MainContainer>
  );
};

export default CreateUserIndex;
