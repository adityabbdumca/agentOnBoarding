import { httpClient } from "@/api/httpClient";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { queryClientGlobal } from "@/lib/tanstack-query/query.config";
import { QUERY_KEYS } from "@/services/KEYS/QUERY_KEYS";
import { CORE_URLS } from "@/services/URLS/CORE_URLS";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useAddEditQuestionsDrawer = () => {
  const addSingleExamQuestionMutation = useMutation({
    mutationFn: (data: any) => {
      return httpClient("POST", CORE_URLS.ADD_QUESTION_SET, data);
    },
    onSuccess: (res: any) => {
      if (res?.status === 200) {
        toast.success(res?.data?.message);
        queryClientGlobal.invalidateQueries({
          queryKey: [QUERY_KEYS.EXAM_QUESTIONS_LISTING],
        });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  const updateSingleExamQuestionMutation = useMutation({
    mutationFn: (data: any) => {
      return httpClient("POST", CORE_URLS.UPDATE_QUESTION_SET, data);
    },
    onSuccess: (res: any) => {
      if (res?.status === 200) {
        toast.success(res?.data?.message);
        queryClientGlobal.invalidateQueries({
          queryKey: [QUERY_KEYS.EXAM_QUESTIONS_LISTING],
        });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  const deleteSingleExamQuestionMutation = useMutation({
    mutationFn: (data: any) => {
      return httpClient("POST", CORE_URLS.DELETE_QUESTION_SET, data);
    },
    onSuccess: (res: any) => {
      if (res?.status === 200) {
        toast.success(res?.data?.message);
        queryClientGlobal.invalidateQueries({
          queryKey: [QUERY_KEYS.EXAM_QUESTIONS_LISTING],
        });
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  const bulkUploadExamQuestionMutation = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.UPLOAD_EXAM_QUESTIONS, data, "formData");
    },
    onSuccess: (res: any) => {
      if (res?.data?.status === 200) {
        toast.success(res?.data?.message);
        queryClientGlobal.invalidateQueries({
          queryKey: [QUERY_KEYS.EXAM_QUESTIONS_LISTING],
        });
      } else {
        toast.error(res?.data?.message);
      }
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  return {
    mutations: {
      addSingleExamQuestionMutation,
      updateSingleExamQuestionMutation,
      deleteSingleExamQuestionMutation,
      bulkUploadExamQuestionMutation,
    },
  };
};

export default useAddEditQuestionsDrawer;
