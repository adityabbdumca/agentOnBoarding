import { URLs } from "@/lib/ApiService/constants/URLS";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { httpClient } from "@/api/httpClient";
export const useExamExportExcel = () => {
  const { mutate } = useMutation({
    mutationFn: (payload) => {
      return httpClient("POST", URLs.EXPORT_EXAM_EXPORT_EXCEL, payload);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200 && response?.data?.file_url) {
        toast.success(response?.data?.message);
        window.open(response.data.file_url, "_blank");
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
