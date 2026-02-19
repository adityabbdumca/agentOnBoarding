import generateDynamicColumnSchema from "@/shared/function/generateDynamicColumnSchema";
import UiTable from "@/UI-Components/Tables/UiTable";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import useRescheduleApproveListing from "./hooks/useRescheduleApproveListing";

const RescheduleApproveListingPage = () => {
  const {
    services: { getAllRescheduleExamServices },
    states: { rescheduleExamSearchQuery, setRescheduleExamSearchQuery },
    // routing: { navigateTo },
  } = useRescheduleApproveListing();

  const attributes =
    getAllRescheduleExamServices?.data?.data?.column_head || [];

  const baseColumnSchema = generateDynamicColumnSchema(attributes);

  const columnSchema = [
    ...baseColumnSchema,
    // {
    //   header: "Actions",
    //   cell: (cell: any) => {
    //     const rowData = cell.row.original;
    //     return (
    //       <div className="flex items-center gap-2">
    //         <UiButton
    //           buttonType="tertiary"
    //           className=" w-6 h-6 border border-lightGray hover:border-primary/40"
    //           icon={<Eye className="size-4" />}
    //           onClick={() => {}}
    //           isLoading={false}
    //           text={<></>}
    //         />
    //       </div>
    //     );
    //   },
    // },
  ];

  return (
    <MainContainer
      heading={"Reschedule Agent Exam Approve Listing"}
      subHeading={
        "Master to keep track of all the agent reschedule agent exam listing"
      }>
      <UiTable
        dataSet={getAllRescheduleExamServices || []}
        columnsSchema={columnSchema}
        actionButtonComponent={<></>}
        maxHeightClassName="max-h-[calc(100vh-240px)]"
        query={rescheduleExamSearchQuery}
        setQuery={setRescheduleExamSearchQuery}
      />
    </MainContainer>
  );
};

export default RescheduleApproveListingPage;
