import { httpClient } from "@/api/httpClient";
import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import { QUERY_KEYS } from "@/services/KEYS/QUERY_KEYS";
import { CORE_URLS } from "@/services/URLS/CORE_URLS";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

interface IExamCenterSubmitSchema {
  state: string;
}

export interface IAddUpdateExamDetailSubmitSchema {
  id: number;
  details: {
    preferred_exam_date: string | null;
    preferred_language: string | undefined;
    state: string | null;
    exam_center: string | null;
    center_address: string;
  }[];
}

const useApproveRescheduleExamDetails = () => {
  const { navigate, route, navigateTo } = useGlobalRoutesHandler();

  const userId = route["id"];

  const getExamRaiseDetails = useQuery({
    queryKey: [...QUERY_KEYS.EXAM_DETAILS_RAISE, userId],
    queryFn: () => httpClient("GET", `${CORE_URLS.EXAM_RAISE_USER}/${userId}`),
  });

  const getExamCenterDetailsMutations = useMutation({
    mutationFn: (data: IExamCenterSubmitSchema) =>
      httpClient("POST", CORE_URLS.GET_EXAM_CENTER, data),
    onError: (error: AxiosError) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  const approveExamDetailsMutations = useMutation({
    mutationFn: (data: IAddUpdateExamDetailSubmitSchema) =>
      httpClient("POST", CORE_URLS.ADD_UPDATE_EXAM_DETAILS, data),
    onError: (error: AxiosError) => {
      toast.error(error?.response?.data?.message);
    },
  });

  return {
    services: {
      getExamRaiseDetails,
    },
    mutations: { getExamCenterDetailsMutations, approveExamDetailsMutations },
    routing: { navigate, userId, navigateTo },
  };
};

export default useApproveRescheduleExamDetails;
