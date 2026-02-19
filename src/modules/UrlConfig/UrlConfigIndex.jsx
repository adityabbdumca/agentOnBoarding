import { Tooltip } from "@mui/material";
import { useState } from "react";
import {
  HiGlobeAlt,
  HiOutlinePencilAlt,
  HiOutlineRefresh,
  HiOutlineTrash,
} from "react-icons/hi";
import MasterTable from "@/Components/MasterTable";
import { URLs } from "@/lib/ApiService/constants/URLS";
import Button from "@/UI-Components/Button";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import { ActionContainer } from "@/UI-Components/GlobalStyles";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import AddURLForm from "./Components/AddURLForm";
import { useDeleteUrlConfig, useFLSSyncUrlConfig } from "./Service";

const UrlConfigIndex = () => {
  const [openModal, setOpenModal] = useState(false);
  const [rowData, setRowData] = useState({
    title: "Add",
    data: {},
  });
  const { mutate } = useDeleteUrlConfig();
  const { mutate: syncURLs } = useFLSSyncUrlConfig();
  return (
    <MainContainer
      title="URL Configurator"
      heading="URL Configurator"
      subHeading="Configure the URLs for all modules"
      pageActions={
        <div className="flex gap-2">
          <Button
            variant={"outlined"}
            type="button"
            width={"auto"}
            startIcon={<HiGlobeAlt />}
            onClick={() => setOpenModal(true)}
          >
            Add URL
          </Button>
          <Button
            variant={"outlined"}
            type="button"
            width={"auto"}
            startIcon={<HiOutlineRefresh />}
            onClick={() => syncURLs()}
          >
            Sync FLS
          </Button>
        </div>
      }
    >
      <MasterTable
        api={URLs.URL_CONFIG}
        method="GET"
        customActions={({ row }) => {
          return (
            <ActionContainer>
              <Tooltip title="Update" placement="top" arrow>
                <div
                  onClick={() => {
                    setOpenModal(true);
                    setRowData({ title: "Edit", data: row?.original });
                  }}
                >
                  <HiOutlinePencilAlt />
                </div>
              </Tooltip>
              <Tooltip title="Delete" placement="top" arrow>
                <div onClick={() => mutate(row?.original?.credential_id)}>
                  <HiOutlineTrash />
                </div>
              </Tooltip>
            </ActionContainer>
          );
        }}
      />
      <GlobalModal
        title={`${rowData?.title} URL`}
        width={400}
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setRowData({});
        }}
      >
        <AddURLForm
          openModal={openModal}
          setOpenModal={setOpenModal}
          rowData={rowData}
        />
      </GlobalModal>
    </MainContainer>
  );
};

export default UrlConfigIndex;
