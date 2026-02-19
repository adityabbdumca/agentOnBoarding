import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { toast } from "react-toastify";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";

export const useAccessControl = () => {
  const queryClient = useQueryClient();
  const { data, mutate } = useMutation({
    mutationFn: (payload) => httpClient("POST", URLs.ACCESS_CONTROL, payload),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        queryClient.invalidateQueries(CACHE_KEYS.MASTER_TABLE);
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate };
};

export const useGetAdminMenu = () => {
  const { data } = useQuery({
    queryKey: [CACHE_KEYS.ADMIN_MENU],
    queryFn: () => httpClient("GET", URLs.ADMIN_MENU),
  });
  return { data };
};
