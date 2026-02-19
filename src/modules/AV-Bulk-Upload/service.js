import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { toast } from "react-toastify";

export const useAVCreateAndUpdate = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", "createAVDetails", data, "formData");
    },
    onSuccess: () => {
      queryClient.invalidateQueries(CACHE_KEYS.MASTER_TABLE);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  return { mutate };
};
