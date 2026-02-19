import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { toast } from "react-toastify";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";

export const useDiscrepancyActions = (setModal, setModalReject) => {
  const queryClient = useQueryClient();
  const { data, mutate, isPending, mutateAsync } = useMutation({
    mutationFn: (payload) => {
      return httpClient("POST", URLs.DISCREPANCY_ACTIONS, payload, "formData");
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        setModal({
          data: {},
          open: false,
        });
        setModalReject({
          data: {},
          open: false,
        });
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
      } else {
        toast.error(response?.data?.error);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate, isPending, mutateAsync };
};
