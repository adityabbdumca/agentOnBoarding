import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { toast } from "react-toastify";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";

export const usePOSCreateAndUpdate = (setIsDrawerOpen) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.ADD_UPDATE_POS, data, "formData");
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        window.parent.postMessage(
          {
            type: "USER_CREATED",
            url: window.location.href,
          },
          "*"
        );
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
        setIsDrawerOpen(false);
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  return { mutate };
};
