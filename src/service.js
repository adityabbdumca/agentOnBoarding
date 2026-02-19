import { useQuery } from "@tanstack/react-query";
import { httpClient } from "./api/httpClient";
import { CACHE_KEYS } from "./lib/ApiService/constants/CACHE_KEYS";
import { URLs } from "./lib/ApiService/constants/URLS";

export const useGetTheme = (timerState) => {
  const { data, isPending, refetch } = useQuery({
    queryKey: [CACHE_KEYS.GET_THEME],
    queryFn: () => httpClient("POST", URLs.GET_THEME),
    enabled: !timerState,
  });

  return { data, isPending, refetch };
};
