import { useState } from "react";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import { Button, GlobalModal } from "@/UI-Components";

import MasterTable from "@/Components/MasterTable";
import { URLs } from "@/lib/ApiService/constants/URLS";
import AddEditPaymentWaiverModal from "./component/AddEditPaymentWaiverModal";
import { HiOutlinePencilAlt, HiOutlineTrash } from "react-icons/hi";
import { Tooltip } from "@mui/material";
import { ActionContainer } from "@/UI-Components/GlobalStyles";
import { usePaymentWaiver } from "./hooks/usePaymentWaiver";
import DeleteModal from "@/Components/DeleteModal/DeleteModal";
import EditTableDetails from "./component/EditTableDetails";

const PaymentWayOfPage = () => {
  const [roleOpen, setRoleOpen] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    data: {},
  });

  const {
    mutations: { deletePaymentWayOfMutation },
    states: { edit, setEdit },
  } = usePaymentWaiver({ setRoleOpen });
  return (
    <MainContainer
      heading={"Payment Waiver"}
      subHeading={"Choose how you would like to make the payment"}
      pageActions={
        <>
          <Button onClick={() => setRoleOpen(true)}>Add Payment Config</Button>
        </>
      }
    >
      <MasterTable
        api={URLs.LISTPAYMENTWAYOF}
        method={"POST"}
        customActions={({ row }) => (
          <ActionContainer>
            <Tooltip title="Edit" arrow placement="top">
              <div
                onClick={() => {
                  setEdit({
                    open: true,
                    data: row?.original,
                    modalTitle: "Edit",
                  });
                }}
              >
                <HiOutlinePencilAlt />
              </div>
            </Tooltip>
            <Tooltip title="Delete" arrow placement="top">
              <div
                onClick={() => {
                  setModal({
                    open: true,
                    data: row?.original,
                  });
                }}
              >
                <HiOutlineTrash />
              </div>
            </Tooltip>
          </ActionContainer>
        )}
      />
      {/* edit modal */}
      <GlobalModal
        open={edit.open}
        onClose={() => setEdit({ open: false, data: {}, modalTitle: "Edit" })}
        title={`${edit.modalTitle} Payment Waiver`}
        width={600}
      >
        <EditTableDetails row={edit.data} setEdit={setEdit} />
      </GlobalModal>
      <DeleteModal
        open={modal.open}
        text="Are you sure you want to delete?"
        onClose={() => setModal({ open: false, data: {} })}
        onClick={() => {
          deletePaymentWayOfMutation({
            id: modal?.data?.id,
          });
          setModal({ open: false, data: {} });
        }}
      />
      <GlobalModal
        open={roleOpen}
        onClose={() => setRoleOpen(false)}
        width={400}
        title={"Payment Waiver"}
      >
        <AddEditPaymentWaiverModal setRoleOpen={setRoleOpen} />
      </GlobalModal>
    </MainContainer>
  );
};
export default PaymentWayOfPage;
