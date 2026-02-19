import { IGetServicePropsSchema } from "@/services/global_services.types";
import { QUERY_KEYS } from "@/services/KEYS/QUERY_KEYS";
import { useQuery } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { CORE_URLS } from "@/services/URLS/CORE_URLS";
import { useState } from "react";
import useGlobalDebounceHandler from "@/hooks/useGlobalDebounce";
import { IRescheduleRaiseResponseSchema } from "./rescheduleRaise.types";

export const useRescheduleRaiseServices = ({
  page = "1",
  per_page = "10",
  enableQuery = true,
  filters,
  cacheKeys = [],
}: IGetServicePropsSchema) => {
  const [rescheduleRaiseSearchQuery, setRescheduleRaiseSearchQuery] =
    useState("");
  const { debouncedQuery } = useGlobalDebounceHandler(
    rescheduleRaiseSearchQuery
  );

  const getAllRescheduleRaiseServices = useQuery({
    queryKey: [
      QUERY_KEYS.RESCHEDULE_RAISE,
      page,
      per_page,
      ...cacheKeys,
      debouncedQuery,
    ],
    queryFn: (): Promise<{ data: IRescheduleRaiseResponseSchema }> =>
      httpClient("GET", CORE_URLS.RESCHEDULE_RAISE, null, null, false, {
        search_value: debouncedQuery,
        ...filters,
        per_page,
        page,
      }),
    enabled: enableQuery,
  });

  return {
    services: { getAllRescheduleRaiseServices },
    states: {
      rescheduleRaiseSearchQuery,
      setRescheduleRaiseSearchQuery,
    },
  };
};
