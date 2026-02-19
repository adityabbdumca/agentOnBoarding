import UiButton from "@/UI-Components/Buttons/UiButton";
import UiTable from "@/UI-Components/Tables/UiTable";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import AddEditExamQuestionDrawer from "./components/AddEditExamQuestionDrawer";
import useExamQuestions from "./hooks/useExamQuestions";
import ActionConfirmationModal from "@/UI-Components/Modals/ActionConfirmModal";

const ExamQuestionPage = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const {
    states: {
      examQuestionSearchQuery,
      setExamQuestionSearchQuery,
      rowData,
      setRowData,
    },
    service: { getAllExamQuestionService },
    mutations: {
      addSingleExamQuestionMutation,
      updateSingleExamQuestionMutation,
      deleteSingleExamQuestionMutation,
    },
  } = useExamQuestions();

  const columnSchema = [
    { header: "Question", accessorKey: "question" },

    // ...optionColumns,
    {
      header: "Option 1",
      cell: (cell: any) => {
        const optionValue = cell?.row?.original?.options;
        return (
          <p className="text-sm text-body">{optionValue[0]?.value ?? "--"}</p>
        );
      },
    },
    {
      header: "Option 2",
      cell: (cell: any) => {
        const optionValue = cell?.row?.original?.options;
        return (
          <p className="text-sm text-body">{optionValue[1]?.value ?? "--"}</p>
        );
      },
    },
    {
      header: "Option 3",
      cell: (cell: any) => {
        const optionValue = cell?.row?.original?.options;
        return (
          <p className="text-sm text-body">{optionValue[2]?.value ?? "--"}</p>
        );
      },
    },
    {
      header: "Option 4",
      cell: (cell: any) => {
        const optionValue = cell?.row?.original?.options;
        return (
          <p className="text-sm text-body">{optionValue[3]?.value ?? "--"}</p>
        );
      },
    },
    {
      header: "Correct Answer",
      cell: ({ row }: any) => {
        const correct = row.original.correct?.value ?? "--";
        return <p className="text-sm text-body">{correct}</p>;
      },
    },
    { header: "Set", accessorKey: "set" },
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
                setRowData({ title: "Edit", data: rowData });
                setIsOpenModal(true);
              }}
              isLoading={false}
              text={<></>}
            />

            <UiButton
              buttonType="tertiary"
              className=" w-8 h-6 bg-extraLightGray border border-lightGray rounded-lg hover:ring-1 hover:ring-primary/40 hover:scale-105"
              icon={<Trash2 className="size-3 hover:text-primary" />}
              onClick={() => {
                setRowData({ title: "Delete", data: rowData });
                setIsDeleteModal(true);
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
      heading={"Exam Questions"}
      subHeading={"Master to keep track of all agent exam questions"}>
      <UiTable
        dataSet={getAllExamQuestionService || []}
        columnsSchema={columnSchema || []}
        actionButtonComponent={
          <>
            <UiButton
              text="Add Exam Questions"
              buttonType="primary"
              icon={<PlusCircle className="size-4" />}
              className="flex flex-row-reverse w-44"
              onClick={() => {
                setIsOpenModal(true);
                setRowData({ title: "Add", data: null });
              }}
              isLoading={false}
            />
          </>
        }
        maxHeightClassName="max-h-[calc(100vh-240px)]"
        query={examQuestionSearchQuery}
        setQuery={setExamQuestionSearchQuery}
      />
      {isOpenModal && (
        <AddEditExamQuestionDrawer
          isOpen={isOpenModal}
          handleClose={() => setIsOpenModal(false)}
          addEditExamQuestionMutation={
            rowData?.title === "Add"
              ? addSingleExamQuestionMutation
              : updateSingleExamQuestionMutation
          }
          rowData={rowData}
        />
      )}
      {isDeleteModal && (
        <ActionConfirmationModal
          open={isDeleteModal}
          onClose={() => setIsDeleteModal(false)}
          onConfirm={() =>
            deleteSingleExamQuestionMutation
              .mutateAsync({
                question_id: rowData?.data?.question_id,
              })
              .then(() => setIsDeleteModal(false))
          }
          actionType="delete"
          title="Delete Exam Question"
        />
      )}
    </MainContainer>
  );
};

export default ExamQuestionPage;
