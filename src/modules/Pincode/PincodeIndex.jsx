import { useState } from "react";
import { ActionContainer } from "@/UI-Components/GlobalStyles";
import { Box, Modal, Tooltip } from "@mui/material";
import Input from "@/UI-Components/Input";
import Button from "@/UI-Components/Button";
import MasterTable from "@/Components/MasterTable";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import PincodeForm from "./Components/PincodeForm";
import Swal from "sweetalert2";
import { useDeletePincode, useExportPincode } from "./service";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import InlineLoader from "@/Components/Loader/InlineLoader";
import styled from "styled-components";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import { HiMapPin } from "react-icons/hi2";
import { debounce } from "lodash";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import PincodeExportExcel from "./Components/PincodeExportExcel";
const PincodeIndex = () => {
  const [isOpen, setIsOpen] = useState({
    open: false,
    data: null,
    title: "",
  });
  const [openPincodeExcel, setOpenPincodeExcel] = useState({
    open: false,
    data: null,
    title: "",
  });

  const [payload, setPayload] = useState({});

  const { mutate } = useDeletePincode(setIsOpen);
  const { mutate: exportPincode, isPending } = useExportPincode();

  return (
    <MainContainer
      heading={"Pincode Master"}
      subHeading={"Master to keep track of all the pincode"}
      pageActions={
        <>
          <div className="m-2">
            <Button
              variant={"outlined"}
              startIcon={<PiMicrosoftExcelLogoFill />}
              onClick={() =>
                setOpenPincodeExcel({
                  open: true,
                  data: null,
                  title: " Upload Excel",
                })
              }
            >
              Upload Excel
            </Button>
          </div>
          <Button
            variant={"outlined"}
            startIcon={<HiMapPin />}
            onClick={() =>
              setIsOpen({ open: true, data: null, title: "Add Pincode" })
            }
          >
            Add Pincode
          </Button>
        </>
      }
    >
      <MasterTable
        api={"getPincode"}
        methods={"POST"}
        payload={payload}
        isActions={true}
        isPagination={true}
        renderTopToolbarCustomActions={() => {
          return (
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outlined"
                startIcon={<PiMicrosoftExcelLogoFill />}
                onClick={() => exportPincode()}
              >
                Export
              </Button>
              <Input
                name="search_value"
                placeholder={"Search Table"}
                onChange={debounce(
                  (e) => setPayload({ search_value: e.target.value }),
                  300
                )}
              />
            </div>
          );
        }}
        customActions={({ row }) => (
          <ActionContainer>
            <Tooltip title="Edit" arrow placement="top">
              <div>
                <HiOutlinePencilAlt
                  onClick={() => {
                    setIsOpen({
                      open: true,
                      data: row?.original,
                      title: "Edit Pincode",
                    });
                  }}
                />
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
                        mutate({ pincode_id: row?.original?.pincode_id });
                      }
                    });
                  }}
                />
              </div>
            </Tooltip>
          </ActionContainer>
        )}
      />

      {/* export excel Globle Model */}
      <GlobalModal
        open={openPincodeExcel.open}
        onClose={() => setOpenPincodeExcel({ open: false })}
        title={openPincodeExcel.title}
        width={500}
      >
        <PincodeExportExcel setOpenPincodeExcel={setOpenPincodeExcel} />
      </GlobalModal>

      <GlobalModal
        open={isOpen.open}
        onClose={() => setIsOpen({ open: false })}
        title={isOpen.title}
        width={800}
      >
        <PincodeForm data={isOpen.data} setModal={setIsOpen} />
      </GlobalModal>
      {isPending && (
        <Modal open={isPending} onClose={!isPending}>
          <StyledBox>
            <InlineLoader />
            <span>Creating Export</span>
          </StyledBox>
        </Modal>
      )}
    </MainContainer>
  );
};

export default PincodeIndex;
export const StyledBox = styled(Box)`
  font-family: ${({ theme }) => theme?.fontFamily};
  font-weight: 600;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0px 11px 15px -7px rgba(0, 0, 0, 0.2),
    0px 24px 38px 3px rgba(0, 0, 0, 0.14), 0px 9px 46px 8px rgba(0, 0, 0, 0.12);
  padding: 32px;
`;
