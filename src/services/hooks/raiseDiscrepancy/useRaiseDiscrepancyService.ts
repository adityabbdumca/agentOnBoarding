import { httpClient } from "@/api/httpClient";
import useGlobalDebounceHandler from "@/hooks/useGlobalDebounce";
import { IGetServicePropsSchema } from "@/services/global_services.types";
import { QUERY_KEYS } from "@/services/KEYS/QUERY_KEYS";
import { CORE_URLS } from "@/services/URLS/CORE_URLS";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export const useRaiseDiscrepancyServices = ({
  page = "1",
  per_page = "10",
  enableQuery = true,
  filters,
  cacheKeys = [],
}: IGetServicePropsSchema) => {
  const [raiseDiscrepancySearchQuery, SetRaiseDiscrepancySearchQuery] = useState("");
  const { debouncedQuery } = useGlobalDebounceHandler(raiseDiscrepancySearchQuery);

  const getAllRaiseDiscrepancyServices = useQuery({
    queryKey: [
      QUERY_KEYS.GET_ENDORSEMENT_DISCREPANCY_LIST,
      page,
      per_page,
      ...cacheKeys,
      debouncedQuery,
    ],
    queryFn: (): Promise<{ data: any }> =>
      httpClient("GET", CORE_URLS.GET_ENDORSEMENT_DISCREPANCY_LIST,null, null, false, {
        search_value: debouncedQuery,
        ...filters,
        per_page,
        page,
      }),
    enabled: enableQuery,
  });

  const { data } = useQuery({
      queryKey: [CACHE_KEYS.DISCREPANCY, id],
      queryFn: () => {
        return httpClient("POST", URLs.GET_DISCREPANCY_LISTING, {
          master_desc_id: id,
        });
      },
      // onSuccess: (response) => {
      //   if (response?.data?.status === 200) {
      //     Swal.fire("Success", response?.data?.message, "success");
      //   } else {
      //     Swal.fire("Error", response?.data?.message, "error");
      //   }
      // },
    });

  return {
    services: { getAllRaiseDiscrepancyServices },
    states: {
      raiseDiscrepancySearchQuery,
      SetRaiseDiscrepancySearchQuery,
    },
  };
};


