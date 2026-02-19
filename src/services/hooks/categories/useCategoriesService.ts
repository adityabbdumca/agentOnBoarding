import { httpClient } from "@/api/httpClient";
import useGlobalDebounceHandler from "@/hooks/useGlobalDebounce";
import { IGetServicePropsSchema } from "@/services/global_services.types";
import { QUERY_KEYS } from "@/services/KEYS/QUERY_KEYS";
import { CORE_URLS } from "@/services/URLS/CORE_URLS";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ICategoriesServiceSchema } from "./categories.type";

export const useCategoriesServices = ({
  page = "1",
  per_page = "10",
  enableQuery = true,
  filters,
  cacheKeys = [],
}: IGetServicePropsSchema) => {
  const [categoriesSearchQuery, SetCategoriesSearchQuery] = useState("");
  const { debouncedQuery } = useGlobalDebounceHandler(categoriesSearchQuery);

  const getAllCategoriesServices = useQuery({
    queryKey: [
      QUERY_KEYS.CATEGORIES,
      page,
      per_page,
      ...cacheKeys,
      debouncedQuery,
    ],
    queryFn: (): Promise<{ data: ICategoriesServiceSchema }> =>
      httpClient("GET", CORE_URLS.CATEGORIES, null, null, false, {
        search_value: debouncedQuery,
        ...filters,
        per_page,
        page,
      }),
    enabled: enableQuery,
  });

  return {
    services: { getAllCategoriesServices },
    states: {
      categoriesSearchQuery,
      SetCategoriesSearchQuery,
    },
  };
};