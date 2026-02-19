import { httpClient } from "@/api/httpClient";
import useGlobalDebounceHandler from "@/hooks/useGlobalDebounce";
import { IGetServicePropsSchema } from "@/services/global_services.types";
import { QUERY_KEYS } from "@/services/KEYS/QUERY_KEYS";
import { CORE_URLS } from "@/services/URLS/CORE_URLS";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const usePaymentReceiptServices = ({
  page = "1",
  per_page = "10",
  enableQuery = true,
  filters,
  cacheKeys = [],
}: IGetServicePropsSchema) => {
  const [paymentReceiptSearchQuery, SetPaymentReceiptSearchQuery] = useState("");
  const { debouncedQuery } = useGlobalDebounceHandler(paymentReceiptSearchQuery);

  const getAllPaymentReceiptServices = useQuery({
    queryKey: [
      QUERY_KEYS.PAYMENT_RECEIPT_VIEW,
      page,
      per_page,
      ...cacheKeys,
      {...filters},
      debouncedQuery,
    ],
    queryFn: (): Promise<{ data: any }> =>
      httpClient("GET", CORE_URLS.PAYMENT_RECEIPT_VIEW,null, null, false, {
        search_value: debouncedQuery,
        ...filters,
        per_page,
        page,
      }),
    enabled: enableQuery,
  });

  return {
    services: { getAllPaymentReceiptServices },
    states: {
      paymentReceiptSearchQuery,
      SetPaymentReceiptSearchQuery,
    },
  };
};


