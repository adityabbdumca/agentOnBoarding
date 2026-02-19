import generateDynamicColumnSchema from "@/shared/function/generateDynamicColumnSchema";
import UiButton from "@/UI-Components/Buttons/UiButton";
import UiConfirmationModal from "@/UI-Components/ConfirmationModal/UiConfirmationModal";
import UiTable from "@/UI-Components/Tables/UiTable";
import { Pencil, PlusCircle, Trash2, Upload } from "lucide-react";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import AddEditBlackListAgentFormModal from "./components/AddEditBlackListAgentFormModal";
import UploadBlackListAgentModal from "./components/UploadBlackListAgentModal";
import useBlackListAgent from "./hooks/useBlackListAgent";

const BlackListingAgentPage = () => {
  const {
    services: { getAllBlackListAgentServices },
    states: {
      isUploadModalOpen,
      setIsUploadModalOpen,
      deletedId,
      setDeletedId,
      isAddEditModalOpen,
      setIsAddEditModalOpen,
      isDeleteModalOpen,
      setIsDeleteModalOpen,
      blackListSearchQuery,
      SetBlackListSearchQuery,
    },
    mutations: { deleteBlackListMutations, uploadBlackListAgentMutations },
    function: { handleDeleteBlackListAgent, handleUploadBlackListAgent },
    routing: { navigateTo },
  } = useBlackListAgent();
  const attributes =
    getAllBlackListAgentServices?.data?.data?.column_head || [];

  const baseColumnSchema = generateDynamicColumnSchema(attributes);
  const columnSchema = [
    ...baseColumnSchema,
    {
      header: "Actions",
      cell: (cell: any) => {
        const rowData = cell.row.original;
        return (
          <div className="flex items-center gap-2">
            <UiButton
              buttonType="tertiary"
              type="button"
              className=" w-6 h-6 border border-lightGray hover:border-primary/40"
              icon={<Pencil className="size-4" />}
              onClick={() => {
                navigateTo({ to: { "edit-id": rowData?.id } });
                setIsAddEditModalOpen(true);
              }}
            />
            <UiButton
              buttonType="tertiary"
              className="w-6 h-6 border border-lightGray hover:border-primary/40  text-error"
              icon={<Trash2 className="size-4" />}
              onClick={() => {
                setDeletedId(rowData?.id);
                setIsDeleteModalOpen(true);
              }}
            />
          </div>
        );
      },
    },
  ];
  return (
    <MainContainer
      heading={"BlackListed Agents"}
      subHeading={
        "Master to keep track of all the BlackListed Agents"
      }>
      <UiTable
        dataSet={getAllBlackListAgentServices || []}
        columnsSchema={columnSchema || []}
        actionButtonComponent={
          <>
            <UiButton
              text={"Upload"}
              className="px-4 !h-8 w-24 flex-row-reverse"
              icon={<Upload className="size-4" />}
              onClick={() => {
                setIsUploadModalOpen(true);
              }}
              isLoading={false}
            />
            <UiButton
              buttonType="primary"
              text={"Add"}
              className="px-4 !h-8 w-24 flex-row-reverse"
              icon={<PlusCircle className="size-4" />}
              onClick={() => {
                setIsAddEditModalOpen(true);
              }}
              isLoading={false}
            />
          </>
        }
        maxHeightClassName="max-h-[calc(100vh-240px)] "
        query={blackListSearchQuery}
        setQuery={SetBlackListSearchQuery}
      />
      {isAddEditModalOpen && (
        <AddEditBlackListAgentFormModal
          isOpen={isAddEditModalOpen}
          handleClose={() => {
            setIsAddEditModalOpen(false);
            navigateTo({ remove: ["edit-id"] });
          }}
        />
      )}

      <UiConfirmationModal
        isOpen={isDeleteModalOpen}
        headSection={"Are you sure you want to delete?"}
        handleClose={() => {
          setIsDeleteModalOpen(false);
        }}
        subHeading={
          "Confirm delete to remove the data from the table.This action cannot be undone"
        }
        actionButtonText={"Delete"}
        onActionButtonClick={() => handleDeleteBlackListAgent(deletedId!)}
        isLoading={deleteBlackListMutations?.isPending}
        icon={<Trash2 className="size-4" />}
      />
      <UploadBlackListAgentModal
        isOpen={isUploadModalOpen}
        handleClose={() => {
          setIsUploadModalOpen(false);
        }}
        onSubmit={handleUploadBlackListAgent}
        isLoading={uploadBlackListAgentMutations?.isPending}
      />
    </MainContainer>
  );
};

export default BlackListingAgentPage;
