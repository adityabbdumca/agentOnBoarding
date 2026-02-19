import { IGetServicePropsSchema } from "@/services/global_services.types";
import { QUERY_KEYS } from "@/services/KEYS/QUERY_KEYS";
import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { CORE_URLS } from "@/services/URLS/CORE_URLS";
import { useState } from "react";
import useGlobalDebounceHandler from "@/hooks/useGlobalDebounce";
import { IRescheduleListingResponseSchema } from "./rescheduleListing.types";

export const useRescheduleListingServices = ({
  page = "1",
  per_page = "10",
  enableQuery = true,
  filters,
  cacheKeys = [],
}: IGetServicePropsSchema) => {
  const [rescheduleListingSearchQuery, setRescheduleListingSearchQuery] =
    useState("");
  const { debouncedQuery } = useGlobalDebounceHandler(
    rescheduleListingSearchQuery
  );

  const getAllRescheduleListingServices = useQuery({
    queryKey: [
      QUERY_KEYS.RESCHEDULE_LIST,
      page,
      per_page,
      ...cacheKeys,
      debouncedQuery,
    ],
    queryFn: (): Promise<{ data: IRescheduleListingResponseSchema }> =>
      httpClient("GET", CORE_URLS.RESCHEDULE_LIST, null, null, false, {
        search_value: debouncedQuery,
        ...filters,
        per_page,
        page,
      }),
    enabled: enableQuery,
  });

  return {
    services: { getAllRescheduleListingServices },
    states: {
      rescheduleListingSearchQuery,
      setRescheduleListingSearchQuery,
    },
  };
};
