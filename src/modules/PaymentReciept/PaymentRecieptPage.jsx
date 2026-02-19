import generateDynamicColumnSchema from "@/shared/function/generateDynamicColumnSchema";
import UiTable from "@/UI-Components/Tables/UiTable";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import usePaymentReceipt from "./hooks/usePaymentReceipt";
const PaymentReceiptPage = () => {
  const {
    services: { getAllPaymentReceiptServices },
    states: { paymentReceiptSearchQuery, SetPaymentReceiptSearchQuery },
  } = usePaymentReceipt();
  const attributes = getAllPaymentReceiptServices?.data?.data?.column_head || [];
  const baseColumnSchema = generateDynamicColumnSchema(attributes);
  const columnSchema = [...baseColumnSchema];
  return (
    <MainContainer
      heading={"Payment Receipt"}
      subHeading={"Master to keep track of all the payment receipt"}>
      <UiTable
        dataSet={getAllPaymentReceiptServices || []}
        columnsSchema={columnSchema || []}
        maxHeightClassName="max-h-[calc(100vh-240px)] "
        query={paymentReceiptSearchQuery}
        setQuery={SetPaymentReceiptSearchQuery}
      />
    </MainContainer>
  );
};

export default PaymentReceiptPage;
