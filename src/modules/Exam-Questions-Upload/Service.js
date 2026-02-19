import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { toast } from "react-toastify";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";

export const useAddExamQuestions = (setDrawerObj) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.UPLOAD_EXAM_QUESTIONS, data);
    },
    onSuccess: (res) => {
      if (res?.status === 200) {
        setDrawerObj({ open: false, data: null, title: "" });
        toast.success(res?.data?.message);
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return {
    mutate,
  };
};

export const useGetSampleQuestionExcel = (drawerObj) => {
  const { data } = useQuery({
    queryKey: [CACHE_KEYS.EXAM_QUESTIONS_SAMPLE_EXCEL],
    queryFn: () => httpClient("POST", URLs.EXAM_QUESTIONS_SAMPLE_EXCEL),
    enabled: drawerObj.open,
  });
  return {
    data: data?.data,
  };
};

export const useAddBulkExamQuestions = (setDrawerObj) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.UPLOAD_EXAM_QUESTIONS, data, "formData");
    },
    onSuccess: (res) => {
      if (res?.data?.status === 200) {
        setDrawerObj({ open: false, data: null, title: "" });
        toast.success(res?.data?.message);
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
      } else {
        toast.error(res?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return {
    mutate,
  };
};
