import generateDynamicColumnSchema from "@/shared/function/generateDynamicColumnSchema";
import UiButton from "@/UI-Components/Buttons/UiButton";
import UiTable from "@/UI-Components/Tables/UiTable";
import { Pencil } from "lucide-react";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import useRescheduleRaise from "./hooks/useRescheduleRaise";

const RescheduleRaisePage = () => {
  const {
    services: { getAllRescheduleListingServices },
    states: { rescheduleListingSearchQuery, setRescheduleListingSearchQuery },
    routing: { navigateTo },
  } = useRescheduleRaise();

  const attributes =
    getAllRescheduleListingServices?.data?.data?.column_head || [];

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
              className=" w-6 h-6 border border-lightGray hover:border-primary/40"
              icon={<Pencil className="size-4" />}
              onClick={() => {
                navigateTo({
                  url: `/reschedule-raise/${rowData?.id}`,
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
          heading={"Reschedule Raise"}
          subHeading={
            "Show all agent reschedule exam listing for actions"
          }>

      <UiTable
        dataSet={getAllRescheduleListingServices || []}
        columnsSchema={columnSchema}
        actionButtonComponent={<></>}
        maxHeightClassName="max-h-[calc(100vh-240px)]"
        query={rescheduleListingSearchQuery}
        setQuery={setRescheduleListingSearchQuery}
      />
    </MainContainer>
  );
};

export default RescheduleRaisePage;
