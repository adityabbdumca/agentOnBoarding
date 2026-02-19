import generateDynamicColumnSchema from "@/shared/function/generateDynamicColumnSchema";
import UiButton from "@/UI-Components/Buttons/UiButton";
import ActionConfirmationModal from "@/UI-Components/Modals/ActionConfirmModal";
import UiTable from "@/UI-Components/Tables/UiTable";
import { Eye, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import ExamConfigEditModal from "./components/ExamConfigEditModal";
import useExamListing from "./hooks/useExamListing";
import ViewExamConfigDetails from "./components/ViewExamConfigDetails";

const ExamListingPage = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isDeleteOpenModal, setIsDeleteOpenModal] = useState(false);
  const [isViewOpenModal, setIsViewOpenModal] = useState(false);
  const {
    services: { getAllExamListingService },
    mutations: { addEditExamConfigMutation, deleteExamConfigMutation },
    states: {
      examListingSearchQuery,
      setExamSearchQuery,
    //  navigateTo,
      examData,
      setExamData,
    },
  } = useExamListing();
  const getAllExamData = getAllExamListingService?.data?.data;
  const attributes = getAllExamData?.column_head || [];

  const baseColumnSchema = generateDynamicColumnSchema(attributes);
  const columnSchema = [
    ...baseColumnSchema,
    {
      header: "Actions",
      cell: (cell: any) => {
        const rowData = cell?.row?.original;
        return (
          <div className="flex items-center gap-2">
            <UiButton
              buttonType="tertiary"
              className=" w-8 h-6 bg-extraLightGray border border-lightGray rounded-lg hover:ring-1 hover:ring-primary/40 hover:scale-105"
              icon={<Pencil className="size-3 hover:text-primary" />}
              onClick={() => {
                // navigateTo({ to: { edit: rowData?.id } });
                setExamData({ title: "Edit Exam Config", data: rowData });
                setIsOpenModal(true);
              }}
              isLoading={false}
              text={<></>}
            />
            <UiButton
              buttonType="tertiary"
              className=" w-8 h-6 bg-extraLightGray border border-lightGray rounded-lg hover:ring-1 hover:ring-primary/40 hover:scale-105"
              icon={<Eye className="size-3 hover:text-primary" />}
              onClick={() => {
                setExamData({ title: "Exam Config Details", data: rowData });
                setIsViewOpenModal(true);
              }}
              isLoading={false}
              text={<></>}
            />
            <UiButton
              buttonType="tertiary"
              className=" w-8 h-6 bg-extraLightGray border border-lightGray rounded-lg hover:ring-1 hover:ring-primary/40 hover:scale-105"
              icon={<Trash2 className="size-3 hover:text-primary" />}
              onClick={() => {
                setExamData({ title: "", data: rowData });
                setIsDeleteOpenModal(true);
              }}
              isLoading={false}
              text={<></>}
            />
          </div>
        );
      },
    },
  ];
  return (
    <MainContainer
      heading={"Exam Config Listing"}
      subHeading={"Master to keep track of all agent exam listing"}>
      <UiTable
        dataSet={getAllExamListingService || []}
        columnsSchema={columnSchema || []}
        actionButtonComponent={
          <>
            <UiButton
              text="Add Exam Config"
              buttonType="primary"
              icon={<PlusCircle className="size-4" />}
              className="flex flex-row-reverse w-44"
              onClick={() => {
                setExamData({ title: "Add Exam Config", data: null });
                setIsOpenModal(true);
              }}
              disabled={
                getAllExamData?.data?.length && getAllExamData?.data?.length > 0
              }
              isLoading={false}
            />
          </>
        }
        maxHeightClassName="max-h-[calc(100vh-240px)]"
        query={examListingSearchQuery}
        setQuery={setExamSearchQuery}
      />
      {isOpenModal && (
        <ExamConfigEditModal
          isOpen={isOpenModal}
          examData={examData}
          setExamData={setExamData}
          handleCloseModal={() => setIsOpenModal(false)}
          mutation={addEditExamConfigMutation}
        />
      )}
      {isDeleteOpenModal && (
        <ActionConfirmationModal
          open={isDeleteOpenModal}
          onClose={() => setIsDeleteOpenModal(false)}
          onConfirm={() =>
            examData?.data?.id &&
            deleteExamConfigMutation
              ?.mutateAsync({ id: examData?.data?.id })
              .then(() => {
                setIsDeleteOpenModal(false);
              })
          }
          actionType={"delete"}
          title={"Delete Exam Config"}
          message={"Do you want to delete this exam config ?"}
          isLoading={deleteExamConfigMutation?.isPending}
        />
      )}
      {isViewOpenModal && (
        <ViewExamConfigDetails
          isOpen={isViewOpenModal}
          handleClose={() => {
            setIsViewOpenModal(false);
          }}
          viewData={examData}
        />
      )}
    </MainContainer>
  );
};

export default ExamListingPage;
