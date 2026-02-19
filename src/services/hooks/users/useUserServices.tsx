import { httpClient } from "@/api/httpClient";
import { QUERY_KEYS } from "@/services/KEYS/QUERY_KEYS";
import { CORE_URLS } from "@/services/URLS/CORE_URLS";
import { useQuery } from "@tanstack/react-query";
import { IUserResponseSchema } from "./user.types";

export const useSingleUserService = () => {
  const getSingleUserService = useQuery({
    queryKey: [...QUERY_KEYS.USER],
    queryFn: (): Promise<{ data: IUserResponseSchema }> =>
      httpClient("GET", CORE_URLS.USER),
  });

  return {
    services: { getSingleUserService },
  };
};
