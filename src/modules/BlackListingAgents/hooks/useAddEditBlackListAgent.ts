import { httpClient } from "@/api/httpClient";
import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import { queryClientGlobal } from "@/lib/tanstack-query/query.config";
import {
  useSingleBlackListAgentServices
} from "@/services/hooks/blacklistAgent/useBlackListAgentServices";
import { QUERY_KEYS } from "@/services/KEYS/QUERY_KEYS";
import { CORE_URLS } from "@/services/URLS/CORE_URLS";
import { useMutation } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { toast } from "react-toastify";

const useAddEditBlackListAgent = ({
  handleClose,
}: {
  handleClose: () => void;
}) => {

  const { navigate, subRoute, urlQueries } = useGlobalRoutesHandler();
  const editId = urlQueries?.["edit-id"];
  const {
    services: { getSingleBlackListAgentService },
  } = useSingleBlackListAgentServices({
    enableQuery: editId ? true : false,
    agentId: editId,
  });
  const addBlackListMutations = useMutation({
    mutationFn: (data: any) => {
      return httpClient("POST", CORE_URLS.BLACK_LIST_AGENTS, data);
    },
    onSuccess: (response) => {
      toast.success(
        response?.data?.message || "Created BlackList Agent Successfully"
      );
      queryClientGlobal.invalidateQueries({
        queryKey: [QUERY_KEYS.BLACK_LIST_AGENTS],
      });
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
  const updateBlackListMutations = useMutation({
    mutationFn: (data: any) =>
      httpClient("PATCH", `${CORE_URLS.BLACK_LIST_AGENTS}/${data?.id}`, data),
    onSuccess: (response) => {
      toast.success(
        response?.data?.message || "Updated BlackList Agent Successfully"
      );
      queryClientGlobal.invalidateQueries({
        queryKey: [QUERY_KEYS.BLACK_LIST_AGENTS],
      });
      handleClose();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });

  const handleAddEditBlackListAgent = (data: any) => {
    const blackListDate = data?.blacklisted_on
      ? DateTime.fromFormat(data.blacklisted_on, "dd-MM-yyyy").toFormat(
          "yyyy-MM-dd"
        )
      : "";
    const payload = {
      pan_number: data?.pan_number,
      ...(data?.name && { name: data?.name }),
      ...(data.blacklisted_on && { blacklisted_on: blackListDate }),
      ...(data?.agency_code && { agency_code: data?.agency_code }),
      ...(data?.reason && { reason: data?.reason }),
    };

    if (editId) {
      updateBlackListMutations.mutate({ ...payload, id: editId });
      return;
    }
    addBlackListMutations.mutate(payload);
  };

  return {
    services: { getSingleBlackListAgentService },
    functions: { handleAddEditBlackListAgent },
    mutations: { addBlackListMutations, updateBlackListMutations },
    routing: { navigate, subRoute, editId },
  };
};

export default useAddEditBlackListAgent;
