import { httpClient } from "@/api/httpClient";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useTraining = ({agentId}) => {

  const getApplicationStatusTracker = useQuery({
    queryKey: [agentId],
    queryFn: () => {
      return httpClient("get", `${URLs.GET_STATUS_TRACKING}?id=${agentId}`);
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message || res?.message);
    },
    onError: (error) => {
      toast.error(error?.data?.message || error?.message);
    },
  });
  const postDownloadFresherMutation = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", "form1A", data);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  const postDownloadCompositeMutation = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", "form1B", data);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  const generateTrainingPdfMutation = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", "generate-training-pdf", data);
    },
    onSuccess: (res) => {
      if (res?.status === 200) {
        window.open(res?.data?.data?.pdf_url, "_blank");
      }
      toast.success(res?.data?.message || res?.message);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return {
    mutations: {
      postDownloadFresherMutation,
      postDownloadCompositeMutation,
      generateTrainingPdfMutation,
    },
    functions: { getApplicationStatusTracker },
  };
};

export default useTraining;
