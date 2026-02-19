import { httpClient } from "@/api/httpClient";
import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { queryClientGlobal } from "@/lib/tanstack-query/query.config";
import { useExamQuestionsService } from "@/services/hooks/examQuestionListing/useExamQuestionsService";
import { QUERY_KEYS } from "@/services/KEYS/QUERY_KEYS";
import { CORE_URLS } from "@/services/URLS/CORE_URLS";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import { IRowData } from "../examQuestion.type";

const useExamQuestions = () => {
  const [rowData, setRowData] = useState<IRowData>({
    title: "",
    data: null,
  });
  const { urlQueries, navigateTo } = useGlobalRoutesHandler();
  const page = urlQueries?.page || "1";
  const per_page = urlQueries?.per_page || "10";
  const {
    services: { getAllExamQuestionService },
    states: { examQuestionSearchQuery, setExamQuestionSearchQuery },
  } = useExamQuestionsService({ page, per_page });

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
    mutationFn: (data: { question_id: number | undefined }) => {
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
    states: {
      rowData,
      setRowData,
      navigateTo,
      examQuestionSearchQuery,
      setExamQuestionSearchQuery,
    },
    service: { getAllExamQuestionService },
    mutations: {
      addSingleExamQuestionMutation,
      updateSingleExamQuestionMutation,
      deleteSingleExamQuestionMutation,
      bulkUploadExamQuestionMutation,
    },
  };
};

export default useExamQuestions;
