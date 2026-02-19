import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import { useRescheduleListingServices } from "@/services/hooks/rescheduleListing/useRescheduleListingService";

const useRescheduleRaise = () => {
  const { urlQueries, navigateTo, navigate } = useGlobalRoutesHandler();
  const page = urlQueries?.page || "1";
  const per_page = urlQueries?.per_page || "10";

  const {
    services: { getAllRescheduleListingServices },
    states: { rescheduleListingSearchQuery, setRescheduleListingSearchQuery },
  } = useRescheduleListingServices({ page, per_page });

  return {
    services: { getAllRescheduleListingServices },
    states: { rescheduleListingSearchQuery, setRescheduleListingSearchQuery },
    routing: { navigateTo, navigate },
  };
};

export default useRescheduleRaise;
