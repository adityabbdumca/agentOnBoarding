import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import Swal from "sweetalert2";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { toast } from "react-toastify";

export const useGetCertifiedAgentDemoExcel = (openModal) => {
  const { data } = useQuery({
    queryFn: () => {
      return httpClient("POST", URLs.GET_CERTIFIED_AGENT_DEMO_EXCEL);
    },
    enabled: !!openModal,
  });
  return { data };
};

export const useCreateAndUpdateAgentBulkUpload = (setOpenModal) => {
  const queryClient = useQueryClient();
  const { data, mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient(
        "POST",
        URLs.CREATE_AND_UPDATE_AGENT_BULK_UPLOAD,
        data,
        "formData"
      );
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        setOpenModal(false);
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate };
};

export const useUploadCertifiedAgent = (setOpenModal) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (payload) =>
      httpClient(
        "POST",
        URLs.UPLOAD_CERTIFIED_AGENT_EXCEL,
        payload,
        "formData"
      ),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        Swal.fire("Success", response?.data?.message, "success");
        setOpenModal(false);
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
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
