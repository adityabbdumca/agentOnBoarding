import { httpClient } from "@/api/httpClient";
import { QUERY_KEYS } from "@/services/KEYS/QUERY_KEYS";
import { CORE_URLS } from "@/services/URLS/CORE_URLS";
import { useQuery } from "@tanstack/react-query";

export const useUserGetDetailsService = ({
  agentId="",
  enableQuery = true,
  cacheKeys = [],
}: {
  agentId: string;
  enableQuery: boolean;
  cacheKeys: string[];
}) => {
  const getUserGetDetails = useQuery({
    queryKey: [QUERY_KEYS.GET_USER_DETAILS, ...cacheKeys],
    queryFn: (): Promise<{ data: any }> =>
      httpClient("POST", CORE_URLS.GET_USER_DETAILS, {id:agentId}, null, false,),
    enabled: enableQuery,
  });

  return {
    services: { getUserGetDetails },
  };
};
