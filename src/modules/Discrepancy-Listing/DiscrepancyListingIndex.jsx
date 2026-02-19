import { useState } from "react";
import { ActionContainer, StyledModal } from "@/UI-Components/GlobalStyles";
import MasterTable from "@/Components/MasterTable";
import { Grid2, Tooltip } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import ButtonWrapper from "@/UI-Components/ButtonWrapper";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import Button from "@/UI-Components/Button";
import Input from "@/UI-Components/Input";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import { LuClipboardList } from "react-icons/lu";
import Dropdown from "@/UI-Components/Dropdown";
import { useDiscrepancyActions } from "./service";
import { HiCheck } from "react-icons/hi2";
import { HiClipboardList, HiOutlineX } from "react-icons/hi";
import RaiseDiscrepancy from "../OnboardingDetails/Components/RaiseDiscrepancy";
import FilePicker from "@/UI-Components/FilePicker";
import { DiscrepancyCells } from "./components/DiscrepancyCells";
import ActionConfirmationModal from "@/UI-Components/Modals/ActionConfirmModal";
import { useDocumentFinalApproval } from "../OnboardingDetails/service";
import UiFileInput from "@/UI-Components/Input/UiFileInput";
import { useDiscrepancyListing } from "./hooks/useDescrepancyListing";
import UploadDiscrepancyForm from "./components/UploadDiscrepancyForm";

const DiscrepancyListingIndex = () => {
  const [openUploadModal, setOpenUploadModal] = useState({
    open: false,
    data: {},
  });
  const { clearErrors, handleSubmit, register, watch, setValue, control } =
    useForm({
      mode: "onChange",
      reValidateMode: "onChange",
      defaultValues: {
        discrepancy_status: { label: "Open", value: "Open" },
      },
    });
  const [searchData, setSearchData] = useState({});
  const [openRaiseDiscrepancyModal, setOpenRaiseDiscrepancyModal] = useState({
    open: false,
    data: {},
  });
  const [isApproveModalOpen, setIsApproveModalOpen] = useState({
    open: false,
    data: {},
  });

  const { mutate: documentFinalApproval, isPending } =
    useDocumentFinalApproval();

  // const { mutate, mutateAsync } = useDiscrepancyActions(
  //   setOpenUploadModal,
  //   setOpenRaiseDiscrepancyModal
  // );
  const {
    mutations: { discrepancyActionMutation },
  } = useDiscrepancyListing(setOpenUploadModal, setOpenRaiseDiscrepancyModal);
  const onSubmit = (data) => {
    setSearchData({
      ...data,
      discrepancy_status: data?.discrepancy_status?.value,
    });
  };

  // const onFileUpload = (data) => {
  //   discrepancyActionMutation.mutate({
  //     type: "upload",
  //     id: openUploadModal?.data?.user_id,
  //     master_desc_id: openUploadModal?.data?.master_desc_id,
  //     file: data?.attachment[0],
  //   });
  //   setValue("attachment", null);
  // };

  return (
    <MainContainer Icon={LuClipboardList} title="Discrepancy Listing">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid2 container spacing={2}>
          <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }} gap={2}>
            <Dropdown
              name="discrepancy_status"
              control={control}
              placeholder="Select Status"
              label="Select Status"
              options={[
                { label: "Open", value: "Open" },
                { label: "Closed", value: "Closed" },
                { label: "Archived", value: "Archived" },
              ]}
            />
          </Grid2>
          <Grid2 item size={{ lg: 3, md: 6, sm: 12, xs: 12 }} gap={2}>
            <Input
              name="search_value"
              label="Search by First Name / Email / Mobile"
              placeholder={"Search"}
              inputRef={register("search_value")}
            />
          </Grid2>
          <ButtonWrapper>
            <Button width={"auto"} type="submit">
              Search
            </Button>
          </ButtonWrapper>
        </Grid2>
      </form>
      <MasterTable
        api="listDiscrepancy"
        methods={"POST"}
        isActions={true}
        payload={searchData}
        customCellRenderers={DiscrepancyCells}
        customActions={({ row }) => (
          <>
            <ActionContainer>
              <Tooltip title="Upload" placement="top" arrow>
                <div
                  onClick={() => {
                    setOpenUploadModal({
                      open: true,
                      data: row?.original,
                    });
                  }}>
                  <HiClipboardList />
                </div>
              </Tooltip>

              {[3].includes(+row?.original?.discrepancy_status) &&
                [1, 2].includes(+localStorage.getItem("vertical_id")) && (
                  <>
                    {/* Approve Action with Tooltip */}
                    <Tooltip title="Approve" placement="top" arrow>
                      <div
                        onClick={() => {
                          discrepancyActionMutation
                            .mutateAsync({
                              type: "approve",
                              id: row?.original?.user_id,
                              master_desc_id: row?.original?.master_desc_id,
                            })
                            .then((res) => {
                              if (res?.data?.is_approval_popup === true) {
                                setIsApproveModalOpen({
                                  open: true,
                                  data: row.original,
                                });
                              }
                            });
                        }}>
                        <HiCheck />
                      </div>
                    </Tooltip>

                    {/* Reject Action with Tooltip */}
                    <Tooltip title="Reject" placement="top" arrow>
                      <div
                        onClick={() => {
                          setOpenRaiseDiscrepancyModal({
                            open: true,
                            type: "reject",
                            data: row?.original,
                            text: row?.original?.discrepancy_type,
                            key: row?.original?.master_desc_id,
                          });
                        }}>
                        <HiOutlineX />
                      </div>
                    </Tooltip>
                  </>
                )}
            </ActionContainer>
          </>
        )}
      />
      <GlobalModal
        open={openUploadModal.open}
        title="Upload Discrepancy"
        onClose={() => setOpenUploadModal({ open: false, data: {} })}
        width={500}>
        <UploadDiscrepancyForm
          discrepancyActionMutation={discrepancyActionMutation}
          rowData={openUploadModal?.data}
        />
      </GlobalModal>
      <GlobalModal
        open={openRaiseDiscrepancyModal.open}
        onClose={() =>
          setOpenRaiseDiscrepancyModal({ open: false, data: null })
        }
        width={"200"}
        title={`Raise Discrepancy`}>
        <RaiseDiscrepancy
          modalData={openRaiseDiscrepancyModal}
          setModalData={setOpenRaiseDiscrepancyModal}
          id={openRaiseDiscrepancyModal?.data?.user_id}
          mutate={discrepancyActionMutation}
        />
      </GlobalModal>
      <ActionConfirmationModal
        open={isApproveModalOpen.open}
        onClose={() => setIsApproveModalOpen({ open: false, data: null })}
        onConfirm={() => {
          documentFinalApproval({ id: isApproveModalOpen?.data?.user_id });
          setIsApproveModalOpen({ open: false, data: null });
        }}
        actionType={"Approve"}
        title={"Approve Agent"}
        message={"Do you want to approve this agent ?"}
        isLoading={isPending}
      />
    </MainContainer>
  );
};

export default DiscrepancyListingIndex;
