import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import { useExamListingService } from "@/services/hooks/examListing/useExamListingService";
import { useState } from "react";
import { QUERY_KEYS } from "@/services/KEYS/QUERY_KEYS";
import { CORE_URLS } from "@/services/URLS/CORE_URLS";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { queryClientGlobal } from "@/lib/tanstack-query/query.config";
import { httpClient } from "@/api/httpClient";

const useExamListing = () => {
  const [examData, setExamData] = useState({ title: "", data: null });
  const { urlQueries, navigateTo, navigate } = useGlobalRoutesHandler();
  const page = urlQueries?.page || "1";
  const per_page = urlQueries?.per_page || "10";

  const {
    services: { getAllExamListingService },
    states: { examListingSearchQuery, setExamSearchQuery },
  } = useExamListingService({ page, per_page });
  const addEditExamConfigMutation = useMutation({
    mutationFn: (data: any) => {
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
    mutationFn: (data:any) => {
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
    states: {
      examData,
      setExamData,
      examListingSearchQuery,
      setExamSearchQuery,
      navigateTo,
      navigate,
    },
    mutations: { addEditExamConfigMutation, deleteExamConfigMutation },
    services: { getAllExamListingService },
  };
};

export default useExamListing;
