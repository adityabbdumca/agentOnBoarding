import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import { usePaymentReceiptServices } from "@/services/hooks/paymentReceipt/usePaymentReceiptServices";

const usePaymentReceipt = () => {
  const { urlQueries } = useGlobalRoutesHandler();
  const page = urlQueries?.page || "1";
  const per_page = urlQueries?.per_page || "10";
  const {
    services: { getAllPaymentReceiptServices },
    states: { paymentReceiptSearchQuery, SetPaymentReceiptSearchQuery },
  } = usePaymentReceiptServices({ page, per_page });
  return {
    services: { getAllPaymentReceiptServices },
    states: { paymentReceiptSearchQuery, SetPaymentReceiptSearchQuery },
  };
};

export default usePaymentReceipt;
