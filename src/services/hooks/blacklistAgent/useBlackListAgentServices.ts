import { httpClient } from "@/api/httpClient";
import useGlobalDebounceHandler from "@/hooks/useGlobalDebounce";
import { IGetServicePropsSchema } from "@/services/global_services.types";
import { QUERY_KEYS } from "@/services/KEYS/QUERY_KEYS";
import { CORE_URLS } from "@/services/URLS/CORE_URLS";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  IBlackListAgentServiceSchema,
  ISingleBlackListAgentServiceSchema,
} from "./blackListAgent.types";

export const useCheckBlackListAgentServices = ({
  panNumber,
  enableQuery,
}: {
  panNumber: string | null;
  enableQuery: boolean;
}) => {
  const getCheckBlackListAgentServices = useQuery({
    queryKey: [QUERY_KEYS.BLACKLISTED_CHECK, panNumber],
    queryFn: (): Promise<{ data: { is_blacklisted: boolean } }> =>
      httpClient("GET", CORE_URLS.BLACKLISTED_CHECK, null, null, false, {
        pan_number: panNumber
      }),
    enabled: enableQuery,
  });

  return {
    services: { getCheckBlackListAgentServices },
  };
};

export const useSingleBlackListAgentServices = ({
  agentId,
  enableQuery = true,
}: {
  agentId: string;
  enableQuery: boolean;
}) => {
  const getSingleBlackListAgentService = useQuery({
    queryKey: [...QUERY_KEYS.BLACK_LIST_AGENTS, agentId],
    queryFn: (): Promise<{ data: ISingleBlackListAgentServiceSchema }> =>
      httpClient("GET", `${CORE_URLS.BLACK_LIST_AGENTS}/${agentId}`),
    enabled: enableQuery,
  });

  return {
    services: { getSingleBlackListAgentService },
  };
};

export const useBlackListAgentServices = ({
  page = "1",
  per_page = "10",
  enableQuery = true,
  filters,
  cacheKeys = [],
}: IGetServicePropsSchema) => {
  const [blackListSearchQuery, SetBlackListSearchQuery] = useState("");
  const { debouncedQuery } = useGlobalDebounceHandler(blackListSearchQuery);

  const getAllBlackListAgentServices = useQuery({
    queryKey: [
      QUERY_KEYS.BLACK_LIST_AGENTS,
      page,
      per_page,
      ...cacheKeys,
      debouncedQuery,
    ],
    queryFn: (): Promise<{ data: IBlackListAgentServiceSchema }> =>
      httpClient("GET", CORE_URLS.BLACK_LIST_AGENTS, null, null, false, {
        search_value: debouncedQuery,
        ...filters,
        per_page,
        page,
      }),
    enabled: enableQuery,
  });

  return {
    services: { getAllBlackListAgentServices },
    states: {
      blackListSearchQuery,
      SetBlackListSearchQuery,
    },
  };
};
