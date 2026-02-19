import { useState } from "react";
import { ActionContainer } from "@/UI-Components/GlobalStyles";
import { PiBankDuotone, PiMicrosoftExcelLogoFill } from "react-icons/pi";
import MasterTable from "@/Components/MasterTable";
import { Tooltip } from "@mui/material";
import Input from "@/UI-Components/Input";
import { useForm } from "react-hook-form";
import Button from "@/UI-Components/Button";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import AddIFSC from "./AddIFSC";
import Swal from "sweetalert2";
import { useDeleteIFSC, useGetIFSCExport } from "./service";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import { debounce } from "lodash";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import ExcelUpload from "./ExcelUpload";

const IFSCMasterIndex = () => {
  const { register, handleSubmit } = useForm();
  const [openModal, setOpenModal] = useState({
    open: false,
    data: null,
    title: "",
  });
  const [openExcelModel, setOpenExcelModal] = useState({
    open: false,
    data: null,
    title: "",
  });

  const [payload, setPayload] = useState({});

  const { mutate } = useDeleteIFSC(setOpenModal);
  const { mutate: exportMutate } = useGetIFSCExport();
  const onSubmit = (data) => {
    setPayload(data);
  };
  return (
    <MainContainer
      heading={"IFSC Master"}
      subHeading={"Master to keep track of all the IFSC"}
      pageActions={
        <>
          <div className="m-2">
            <Button
              variant="outlined"
              width={"auto"}
              startIcon={<PiMicrosoftExcelLogoFill />}
              onClick={() => {
                setOpenExcelModal({
                  open: true,
                  data: null,
                  title: "Upload Excel",
                });
              }}
            >
              Upload Excel
            </Button>
          </div>{" "}
          <Button
            variant="outlined"
            width={"auto"}
            startIcon={<PiBankDuotone />}
            onClick={() => {
              setOpenModal({
                open: true,
                data: null,
                title: "Add IFSC",
              });
            }}
          >
            Add IFSC
          </Button>
        </>
      }
    >
      <MasterTable
        api={"getIFSCList"}
        methods={"POST"}
        isPagination={true}
        payload={payload}
        isActions={true}
        renderTopToolbarCustomActions={() => {
          return (
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outlined"
                width={"auto"}
                startIcon={<PiMicrosoftExcelLogoFill />}
                onClick={() => {
                  exportMutate(payload);
                }}
              >
                Export
              </Button>
              <Input
                name="search_value"
                placeholder={"IFSC Code / Bank Name"}
                inputRef={register("search_value")}
                onChange={debounce(
                  (e) => setPayload({ search_value: e.target.value }),
                  300
                )}
              />
            </div>
          );
        }}
        customActions={({ row }) => {
          return (
            <ActionContainer>
              <Tooltip title="Edit" arrow>
                <div
                  onClick={() => {
                    setOpenModal({
                      open: true,
                      data: row?.original,
                      title: "Edit IFSC",
                    });
                  }}
                >
                  <HiOutlinePencilAlt />
                </div>
              </Tooltip>
              <Tooltip title="Delete" arrow placement="top">
                <div>
                  <HiOutlineTrash
                    onClick={() => {
                      Swal.fire({
                        title: "Are you sure?",
                        // confirmButtonColor: theme.primaryColor,
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          mutate({ bank_id: row?.original?.bank_id });
                        }
                      });
                    }}
                  />
                </div>
              </Tooltip>
            </ActionContainer>
          );
        }}
      />
      {/* UploadExcel Global */}
      <GlobalModal
        open={openExcelModel.open}
        onClose={() =>
          setOpenExcelModal({
            open: false,
            data: null,
            title: "",
          })
        }
        title={openExcelModel.title}
        width={450}
      >
        <ExcelUpload
          setOpenExcelModal={setOpenExcelModal}
          data={openExcelModel?.data}
          title={openExcelModel?.title}
        />
      </GlobalModal>

      <GlobalModal
        open={openModal.open}
        onClose={() =>
          setOpenModal({
            open: false,
            data: null,
            title: "",
          })
        }
        title={openModal.title}
        width={800}
      >
        <AddIFSC
          setOpenModal={setOpenModal}
          data={openModal?.data}
          title={openModal?.title}
        />
      </GlobalModal>
    </MainContainer>
  );
};

export default IFSCMasterIndex;
