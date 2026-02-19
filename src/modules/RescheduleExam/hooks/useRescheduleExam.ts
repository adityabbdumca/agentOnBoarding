import { httpClient } from "@/api/httpClient";
import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import { useRescheduleExamServices } from "@/services/hooks/rescheduleExam/useRescheduleExamServices";
import { CORE_URLS } from "@/services/URLS/CORE_URLS";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

const useRescheduleExam = () => {
  const { urlQueries, navigateTo, navigate } = useGlobalRoutesHandler();
  const page = urlQueries?.page || "1";
  const per_page = urlQueries?.per_page || "10";

  const {
    services: { getAllRescheduleExamServices },
    states: { rescheduleExamSearchQuery, setRescheduleExamSearchQuery },
  } = useRescheduleExamServices({ page, per_page });

  const exportRescheduleUserMutations = useMutation({
    mutationFn: () => {
      return httpClient("POST", CORE_URLS.EXPORT_RESCHEDULE_USER);
    },
    onError: (error: AxiosError) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  const handleExportRescheduleUser = () => {
    exportRescheduleUserMutations.mutateAsync().then((res) => {
      window.open(res?.data?.file_url);
      toast.success(res?.data?.message);
    });
  };

  return {
    services: {
      getAllRescheduleExamServices,
    },
    mutations: {
      exportRescheduleUserMutations,
    },
    function: {
      handleExportRescheduleUser,
    },
    routing: { navigateTo, navigate },
    states: { rescheduleExamSearchQuery, setRescheduleExamSearchQuery },
  };
};

export default useRescheduleExam;
