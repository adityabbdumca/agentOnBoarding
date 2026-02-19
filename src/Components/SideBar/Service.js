import { useMutation, useQuery } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { toast } from "react-toastify";

export const useLogOutUser = () => {
  const { data, mutate,isPending } = useMutation({
    mutationFn: (payload) => {
      return httpClient("POST", URLs.LOGOUT, payload);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        localStorage.clear();
        window.location.reload();
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate,isPending };
};

export const useGetAgentMenu = (id, payload) => {
  const { data } = useQuery({
    queryKey: [CACHE_KEYS.AGENT_MENU],
    queryFn: () => {
      return httpClient("POST", URLs.AGENT_MENU, {
        id,
        ...payload,
      });
    },
  });
  return { data };
};
