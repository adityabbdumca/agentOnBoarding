import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import Swal from "sweetalert2";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { toast } from "react-toastify";

export const useExportIRDAI = () => {
  const { data, mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.EXPORT_IRDAI_LISTING, data);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        Swal.fire("Success", response?.data?.message, "success");
        window.open(response?.data?.file_url, "_blank");
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

export const useDeactivateAgent = (openModal) => {
  const queryClient = useQueryClient();
  const { data, mutate, isPending } = useMutation({
    mutationFn: (payload) => {
      return httpClient("POST", URLs.DEACTIVATE_AGENT, payload, "formData");
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        Swal.fire("Success", response?.data?.message, "success");
        openModal({ open: false, rowData: {} });
        queryClient.invalidateQueries(CACHE_KEYS.MASTER_TABLE);
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
