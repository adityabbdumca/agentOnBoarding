import generateDynamicColumnSchema from "@/shared/function/generateDynamicColumnSchema";
import UiTable from "@/UI-Components/Tables/UiTable";
import useAgingDiscrepancy from "./hooks/useAgingDiscrepancy";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
const PaymentReceiptPage = () => {
  const {
    services: { getAllAgingDiscrepancyServices },
    states: { agingDiscrepancySearchQuery, SetAgingDiscrepancySearchQuery },
  } = useAgingDiscrepancy();
  const attributes =
    getAllAgingDiscrepancyServices?.data?.data?.column_head || [];
  const baseColumnSchema = generateDynamicColumnSchema(attributes);
  const columnSchema = [...baseColumnSchema];
  
  return (
    <MainContainer
      heading={"Aging Discrepancy"}
      subHeading={
        "Master to keep track of all the non responded discrepancy list"
      }>
      <UiTable
        showDateRangeFilter={false}
        dataSet={getAllAgingDiscrepancyServices || []}
        columnsSchema={columnSchema || []}
        maxHeightClassName="max-h-[calc(100vh-240px)] "
        query={agingDiscrepancySearchQuery}
        setQuery={SetAgingDiscrepancySearchQuery}
      />
    </MainContainer>
  );
};

export default PaymentReceiptPage;
