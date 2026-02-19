import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import { useRescheduleExamServices } from "@/services/hooks/rescheduleExam/useRescheduleExamServices";

const useRescheduleApproveListing = () => {
  const { urlQueries, navigateTo, navigate } = useGlobalRoutesHandler();
  const page = urlQueries?.page || "1";
  const per_page = urlQueries?.per_page || "10";

  const {
    services: { getAllRescheduleExamServices },
    states: { rescheduleExamSearchQuery, setRescheduleExamSearchQuery },
  } = useRescheduleExamServices({ page, per_page });

  return {
    services: { getAllRescheduleExamServices },
    states: { rescheduleExamSearchQuery, setRescheduleExamSearchQuery },
    routing: { navigateTo, navigate },
  };
};

export default useRescheduleApproveListing;
