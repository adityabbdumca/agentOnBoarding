import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
export const useHookMasterTable = (
  api,
  methods,
  payload,
  pagination,
  sorting,
  fullUrl = "",
  isFullUrl,
  isFormData = null
) => {
  const URL = isFullUrl ? fullUrl : api;

  const customPayload = {
    ...payload,
    page: pagination.pageIndex || 1,
    size: pagination.pageSize || 10,
  };

  const { data, isError, isRefetching, isPending, refetch } = useQuery({
    queryKey: [
      CACHE_KEYS.MASTER_TABLE,
      api,
      // URL,
      JSON.stringify(customPayload),
      sorting, // refetch when sorting changes
    ],

    queryFn: async () => {
      const { data } = await httpClient(
        methods,
        URL,
        customPayload,
        isFormData,
        isFullUrl
      );
      return data;
    }, // don't go to 0 rows when refetching or paginating to next page
    placeholderData: keepPreviousData,
  });
  return {
    tableData: data?.return_data || [],
    tableColumns: data?.column_head || [],
    tablePagination: data?.pagination || [],
    isError,
    isRefetching,
    isPending,
    refetch,
  };
};
