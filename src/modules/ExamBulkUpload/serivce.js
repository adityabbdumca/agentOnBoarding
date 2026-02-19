import { useMutation } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { toast } from "react-toastify";
import { URLs } from "@/lib/ApiService/constants/URLS";

export const useExamExcel = (setOpenModal) => {
  const { data, mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.EXPORT_EXAM_DATE_EXCEL, data, "formData");
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        setOpenModal(false);
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
      return httpClient("POST", URLs.EXPORT_EXAM_DATE_SAMPLE, data);
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
