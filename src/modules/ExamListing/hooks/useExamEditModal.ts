import { QUERY_KEYS } from "@/services/KEYS/QUERY_KEYS";
import { CORE_URLS } from "@/services/URLS/CORE_URLS";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { queryClientGlobal } from "@/lib/tanstack-query/query.config";
import { httpClient } from "@/api/httpClient";

const useExamEditModal = () => {
  const addEditExamConfigMutation = useMutation({
    mutationFn: (data:any) => {
      return httpClient("POST", CORE_URLS.ADD_UPDATE_EXAM_CONFIG, data);
    },
    onSuccess: (res) => {
      if (res?.status === 200) {
        toast.success(res?.data?.message);
        queryClientGlobal.invalidateQueries({
          queryKey: [QUERY_KEYS.LIST_EXAM_CONFIG],
        });
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  const deleteExamConfigMutation = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", CORE_URLS.DELETE_EXAM_CONFIG, data);
    },
    onSuccess: (res) => {
      if (res?.status === 200) {
        toast.success(res?.data?.message);
        queryClientGlobal.invalidateQueries({
          queryKey: [QUERY_KEYS.LIST_EXAM_CONFIG],
        });
      } else {
        toast.error(res?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return {
    mutations: { addEditExamConfigMutation, deleteExamConfigMutation },
  };
};

export default useExamEditModal;
