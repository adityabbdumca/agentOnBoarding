import { httpClient } from "@/api/httpClient";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { queryClientGlobal } from "@/lib/tanstack-query/query.config";
import { QUERY_KEYS } from "@/services/KEYS/QUERY_KEYS";
import { CORE_URLS } from "@/services/URLS/CORE_URLS";
import { useMutation, useQuery } from "@tanstack/react-query";

const useViewServicingModal = ({ modalData, userId }) => {
  const raiseDiscrepancyMutation = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.ADD_DISCREPANCY, data, "formData");
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        // dispatch(setDiscrepancy(+response.data.return_data.master_desc_id));
        queryClientGlobal.invalidateQueries([CACHE_KEYS.USER_DOCUMENT]);
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  const getAllDiscrepancyList = useQuery({
    queryKey: [
      QUERY_KEYS.GET_ENDORSEMENT_DISCREPANCY_LIST,
      modalData?.key,
      userId,
    ],
    queryFn: () =>
      httpClient(
        "GET",
        `${CORE_URLS.GET_ENDORSEMENT_DISCREPANCY_LIST}?request_no=${modalData?.key}`
      ),
    enabled: !!modalData?.key,

    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success("Success", response?.data?.message, "success");
      } else {
        toast.error("Error", response?.data?.message, "error");
      }
    },
  });
  return {
    mutations: { raiseDiscrepancyMutation },
    services: { getAllDiscrepancyList },
  };
};

export default useViewServicingModal;
