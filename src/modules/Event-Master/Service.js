import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { httpClient } from "@/api/httpClient";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { toast } from "react-toastify";

export const useAddEvent = (setOpen) => {
  const QueryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (payload) => {
      return httpClient("POST", URLs.CREATE_EVENT, payload);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        Swal.fire("Success", response?.data?.message, "success");
        QueryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
        setOpen(false);
      } else {
        Swal.fire("Error", response?.data?.message, "error");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { mutate };
};
