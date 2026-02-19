import { httpClient } from "@/api/httpClient";
import useGlobalDebounceHandler from "@/hooks/useGlobalDebounce";
import { IGetServicePropsSchema } from "@/services/global_services.types";
import { QUERY_KEYS } from "@/services/KEYS/QUERY_KEYS";
import { CORE_URLS } from "@/services/URLS/CORE_URLS";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { IExamListingServiceSchema } from "./examListing.type";

export const useExamListingService = ({
  page = "1",
  per_page = "10",
  enableQuery = true,
  filters,
  cacheKeys = [],
}: IGetServicePropsSchema) => {
  const [examListingSearchQuery, setExamSearchQuery] = useState("");
  const { debouncedQuery } = useGlobalDebounceHandler(examListingSearchQuery);

  const getAllExamListingService = useQuery({
    queryKey: [QUERY_KEYS.LIST_EXAM_CONFIG, page, per_page, ...cacheKeys, debouncedQuery],
    queryFn: (): Promise<{ data: IExamListingServiceSchema }> => {
      return httpClient("GET", CORE_URLS.LIST_EXAM_CONFIG, null, null,false, {
        page,
        per_page,
        ...filters,
        search_value: debouncedQuery,
      });
    },
    enabled: enableQuery,
  });

  return {
    services: { getAllExamListingService },
    states: { examListingSearchQuery, setExamSearchQuery },
  };
};
