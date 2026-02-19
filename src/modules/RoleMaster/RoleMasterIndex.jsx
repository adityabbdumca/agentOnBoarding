import { useState } from "react";
import { ActionContainer } from "@/UI-Components/GlobalStyles";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import CreateRole from "./CreateRole";
import MasterTable from "@/Components/MasterTable";
import { useNavigate } from "react-router";
import { RiSettings4Fill } from "react-icons/ri";
import { Tooltip } from "@mui/material";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { useDeleteRole } from "./Service";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import { HiOutlinePencilAlt, HiOutlineTrash, HiUserAdd } from "react-icons/hi";
import DropdownMenuButton from "@/Components/DropdownMenuButton/DropdownMenuButton";

const RoleMasterIndex = () => {
  const { theme } = useSelector((state) => state.theme);
  const [openModal, setOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("Add");
  const [rowData, setRowData] = useState(null);
  const { mutate: deleteRole } = useDeleteRole();

  const navigate = useNavigate();
  return (
    <>
      <MainContainer
        heading={"Role Master"}
        subHeading={"View and manage the list of roles"}
        pageActions={
          <>
            <DropdownMenuButton
              isStatic
              dropdownList={[
                {
                  label: "Add Role",
                  icon: <HiUserAdd className="size-4" />,
                  onClick: () => {
                    setOpenModal(true);
                    setModalTitle("Add");
                  },
                },
                {
                  label: "Add Permissions",
                  icon: <RiSettings4Fill className="size-4" />,
                  onClick: () => navigate("/access-control"),
                },
              ]}
            />
          </>
        }
      >
        <GlobalModal
          open={openModal}
          onClose={() => {
            setOpenModal(false);
            setRowData(null);
          }}
          title={`${modalTitle} Role`}
          width={400}
          overflowVisible={true}
        >
          <CreateRole
            modalTitle={modalTitle}
            rowData={rowData}
            setOpenModal={setOpenModal}
          />
        </GlobalModal>
        <MasterTable
          api={"getRoleMaster"}
          methods={"POST"}
          customActions={({ row }) => (
            <ActionContainer>
              <Tooltip title="Edit" arrow placement="top">
                <div>
                  <HiOutlinePencilAlt
                    onClick={() => {
                      setOpenModal(true);
                      setModalTitle("Edit");
                      setRowData(row?.original);
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
                        confirmButtonColor: theme.primaryColor,
                        text: "You won't be able to revert this!",
                        icon: "warning",
                        showCancelButton: true,
                      }).then((result) => {
                        if (result.isConfirmed) {
                          deleteRole(row?.original?.id);
                        }
                      });
                    }}
                  />
                </div>
              </Tooltip>
            </ActionContainer>
          )}
          isActions={true}
        />
      </MainContainer>
    </>
  );
};

export default RoleMasterIndex;
