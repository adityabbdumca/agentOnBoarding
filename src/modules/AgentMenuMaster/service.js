import { useMutation } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { toast } from "react-toastify";

export const useAgentMenuReorder = () => {
  const { data, mutate } = useMutation({
    mutationFn: (payload) => httpClient("POST", "menusReorder", payload),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        return;
      }
      toast.error(response?.data?.message);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate };
};
