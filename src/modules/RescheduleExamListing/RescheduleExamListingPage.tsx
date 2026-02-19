import generateDynamicColumnSchema from "@/shared/function/generateDynamicColumnSchema";
import UiTable from "@/UI-Components/Tables/UiTable";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import useRescheduleExamListing from "./hooks/useRescheduleExamListing";
import UiButton from "@/UI-Components/Buttons/UiButton";
import { Eye } from "lucide-react";
import ViewRescheduleExamDetailsModal from "./component/ViewRescheduleExamDetails";
import { stringUtility } from "@/utlities/string.utlity";

const RescheduleExamListingPage = () => {
  const {
    services: { getAllRescheduleListingServices },
    states: {
      rescheduleListingSearchQuery,
      setRescheduleListingSearchQuery,
      isViewModalOpen,
      setIsViewModalOpen,
      viewData,
      setViewData,
    },
    // routing: { navigateTo },
  } = useRescheduleExamListing();

  const attributes =
    getAllRescheduleListingServices?.data?.data?.column_head || [];

  const baseColumnSchema = generateDynamicColumnSchema(attributes);

  const columnSchema = [
    ...baseColumnSchema.map((col: any) =>
      col.accessorKey === "name"
        ? {
            ...col,
            cell: ({ row }: any) => (
              <div>{stringUtility.addEllipsisAtEnd(row.original.name, 25)}</div>
            ),
          }
        : col
    ),
    {
      header: "Actions",
      cell: (cell: any) => {
        const rowData = cell.row.original;
        return (
          <div className="flex items-center gap-2">
            <UiButton
              buttonType="tertiary"
              className=" w-8 h-6 bg-extraLightGray border border-lightGray rounded-lg hover:ring-1 hover:ring-primary/40 hover:scale-105"
              icon={<Eye className="size-4 hover:text-primary" />}
              onClick={() => {
                setViewData(rowData);
                setIsViewModalOpen(true);
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
      heading={"Reschedule Agent Listing"}
      subHeading={
        "Master to keep track of all the agent reschedule agent exam listing"
      }
    >
      <UiTable
        dataSet={getAllRescheduleListingServices || []}
        columnsSchema={columnSchema}
        actionButtonComponent={<></>}
        maxHeightClassName="max-h-[calc(100vh-240px)]"
        query={rescheduleListingSearchQuery}
        setQuery={setRescheduleListingSearchQuery}
      />
      {isViewModalOpen && (
        <ViewRescheduleExamDetailsModal
          isOpen={isViewModalOpen}
          handleClose={() => setIsViewModalOpen(false)}
          isLoading={false}
          viewData={viewData}
        />
      )}
    </MainContainer>
  );
};

export default RescheduleExamListingPage;
