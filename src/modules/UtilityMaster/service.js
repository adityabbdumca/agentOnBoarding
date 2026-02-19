import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { toast } from "react-toastify";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";

export const useUpdateUtility = (setOpenModal) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (data) => httpClient("POST", URLs.UPDATE_UTILITY_MASTER, data),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        setOpenModal({
          open: false,
          data: {},
        });
        toast.success(response?.data?.message);
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  return {
    mutate,
  };
};
