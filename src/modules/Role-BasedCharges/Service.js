import { URLs } from "@/lib/ApiService/constants/URLS";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { httpClient } from "@/api/httpClient";
import { toast } from "react-toastify";

export const useUpdateRoleCharges = (setRoleOpen) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (payload) =>
      httpClient("POST", URLs.UPDATE_ROLE_CHARGES, payload),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        setRoleOpen(false);
        queryClient.invalidateQueries(CACHE_KEYS.MASTER_TABLE);
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { mutate, isPending };
};
