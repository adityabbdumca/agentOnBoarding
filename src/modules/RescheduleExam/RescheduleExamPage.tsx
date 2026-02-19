import generateDynamicColumnSchema from "@/shared/function/generateDynamicColumnSchema";
import UiButton from "@/UI-Components/Buttons/UiButton";
import UiTable from "@/UI-Components/Tables/UiTable";
import { Pencil } from "lucide-react";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import useRescheduleExam from "./hooks/useRescheduleExam";

const RescheduleExamPage = () => {
  const {
    services: { getAllRescheduleExamServices },
    mutations: { exportRescheduleUserMutations },
    function: { handleExportRescheduleUser },
    states: { rescheduleExamSearchQuery, setRescheduleExamSearchQuery },
    routing: { navigateTo },
  } = useRescheduleExam();

  const attributes =
    getAllRescheduleExamServices?.data?.data?.column_head || [];

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
              className=" w-6 h-6 border border-lightGray hover:ring-2 hover:scale-110 hover:ring-primary/40"
              icon={<Pencil className="size-4" />}
              onClick={() => {
                navigateTo({
                  url: `/reschedule-exam/${rowData?.id}`,
                });
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <MainContainer
      heading={"Reschedule Agent Exam"}
      subHeading={"Master to keep track of all the Agent Exam"}>
      <UiTable
        dataSet={getAllRescheduleExamServices || []}
        columnsSchema={columnSchema}
        actionButtonComponent={
          <UiButton
            text={"Export"}
            className="px-4 !h-8 w-24"
            icon={<></>}
            onClick={() => handleExportRescheduleUser()}
            isLoading={exportRescheduleUserMutations.isPending}
          />
        }
        maxHeightClassName="max-h-[calc(100vh-240px)] "
        query={rescheduleExamSearchQuery}
        setQuery={setRescheduleExamSearchQuery}
      />
    </MainContainer>
  );
};

export default RescheduleExamPage;
