import { useMutation } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { toast } from "react-toastify";
import { URLs } from "@/lib/ApiService/constants/URLS";

export const useExamExcel = (setModal) => {
  const { data, mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient(
        "POST",
        URLs.EXPORT_EXAM_RESULT_EXCEL,
        data,
        "formData"
      );
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        setModal(false);
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate, isPending };
};

export const useExamExcelDownload = () => {
  const { data, mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.EXPORT_EXAM_RESULT_SAMPLE, data);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate, isPending };
};
