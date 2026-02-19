import { IGetServicePropsSchema } from "@/services/global_services.types";
import { QUERY_KEYS } from "@/services/KEYS/QUERY_KEYS";
import { useQuery } from "@tanstack/react-query";
import { IRescheduleExamResponseSchema } from "./rescheduleExam.types";
import { httpClient } from "@/api/httpClient";
import { CORE_URLS } from "@/services/URLS/CORE_URLS";
import { useState } from "react";
import useGlobalDebounceHandler from "@/hooks/useGlobalDebounce";

export const useRescheduleExamServices = ({
  page = "1",
  per_page = "10",
  enableQuery = true,
  filters,
  cacheKeys = [],
}: IGetServicePropsSchema) => {
  const [rescheduleExamSearchQuery, setRescheduleExamSearchQuery] =
    useState("");
  const { debouncedQuery } = useGlobalDebounceHandler(
    rescheduleExamSearchQuery
  );

  const getAllRescheduleExamServices = useQuery({
    queryKey: [
      QUERY_KEYS.RESCHEDULE_USER,
      page,
      per_page,
      ...cacheKeys,
      debouncedQuery,
    ],
    queryFn: (): Promise<{ data: IRescheduleExamResponseSchema }> =>
      httpClient("GET", CORE_URLS.RESCHEDULE_USER, null, null, false, {
        search_value: debouncedQuery,
        ...filters,
        per_page,
        page,
      }),
    enabled: enableQuery,
  });

  return {
    services: { getAllRescheduleExamServices },
    states: {
      rescheduleExamSearchQuery,
      setRescheduleExamSearchQuery,
    },
  };
};
