import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import Swal from "sweetalert2";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { toast } from "react-toastify";

export const useGetDemoExcel = () => {
  const { data, isPending } = useQuery({
    queryKey: [CACHE_KEYS.PAYMENT_UPLOAD_SAMPLE],
    queryFn: () => httpClient("POST", URLs.GET_DEMO_PAYMENT_EXCEL),
  });
  return { data, isPending };
};

export const useUploadExcel = (setOpenModal) => {
  const queryClient = useQueryClient();
  const { data, mutate, isPending } = useMutation({
    mutationFn: (payload) =>
      httpClient("POST", URLs.UPLOAD_PAYMENT_EXCEL, payload, "formData"),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        Swal.fire("Success", response?.data?.message, "success");
        setOpenModal(false);
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
      } else {
        Swal.fire("Error", response?.data?.message, "error");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate, isPending };
};
