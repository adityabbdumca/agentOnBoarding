import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import Swal from "sweetalert2";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { toast } from "react-toastify";

export const useGetDemoAgentExcel = () => {
  const { data, mutate } = useQuery({
    queryFn: () => {
      return httpClient("POST", URLs.GET_DEMO_LEAD_AGENT_EXCEL);
    },
  });
  return { data, mutate };
};

export const useUploadAgentLeadExcel = (setOpenExcel) => {
  const queryClient = useQueryClient();
  const { data, mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.UPLOAD_LEAD_AGENT_EXCEL, data, "formData");
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        Swal.fire("Success", response?.data?.message, "success");
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
        setOpenExcel(false);
      } else {
        Swal.fire("Error", response?.data?.message, "error");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate };
};
