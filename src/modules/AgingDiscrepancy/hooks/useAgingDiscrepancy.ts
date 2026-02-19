import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import { useAgingDiscrepancyServices } from "@/services/hooks/agingDiscrepancy/useAgingDiscrepancyService";
import { DateTime } from "luxon";

const useAgingDiscrepancy = () => {
  const { urlQueries } = useGlobalRoutesHandler();
  const page = urlQueries?.page || "1";
  const per_page = urlQueries?.per_page || "10";
  const from =
    urlQueries?.["from"] ||
    DateTime.now().startOf("month").toFormat("yyyy-MM-dd");
  const to =
    urlQueries?.["to"] || DateTime.now().endOf("month").toFormat("yyyy-MM-dd");

    const {
    services: { getAllAgingDiscrepancyServices },
    states: { agingDiscrepancySearchQuery, SetAgingDiscrepancySearchQuery },
  } = useAgingDiscrepancyServices({
    page,
    per_page,
    filters: { startDate: from, endDate: to },
    enableQuery: !!from && !!to,
  });
  return {
    services: { getAllAgingDiscrepancyServices },
    states: { agingDiscrepancySearchQuery, SetAgingDiscrepancySearchQuery },
  };
};

export default useAgingDiscrepancy;
