import { httpClient } from "@/api/httpClient";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { queryClientGlobal } from "@/lib/tanstack-query/query.config";
import { CORE_URLS } from "@/services/URLS/CORE_URLS";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const useConsent = ({ handleClose, agentId}) => {
  const getConsentTermAndCondition = useQuery({
    queryKey: ["get-tnc", agentId],
    queryFn: () =>{
      return httpClient("get", `get-tnc?id=${agentId}`)
    }, 

  });
  const agreeTermAndConditionMutation = useMutation({
    mutationFn: (data) => {
      return httpClient("post", CORE_URLS.USER_TRANSCRIPT_TERMS, data);
    },
    onSuccess: (res) => {
      (toast.success(
        res?.message || "Agree the Terms And Condition Successfully"
      ),
        queryClientGlobal.invalidateQueries([CACHE_KEYS.USER_DETAILS]),
        handleClose());
    },
    onError: (err) => {
      toast.error(err?.message || err?.status?.message);
    },
  });
  return {
    mutations: { agreeTermAndConditionMutation },
    function: { getConsentTermAndCondition },
  };
};

export default useConsent;
