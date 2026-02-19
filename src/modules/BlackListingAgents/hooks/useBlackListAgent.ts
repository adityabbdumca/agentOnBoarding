import { httpClient } from "@/api/httpClient";
import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import { queryClientGlobal } from "@/lib/tanstack-query/query.config";
import { useBlackListAgentServices } from "@/services/hooks/blacklistAgent/useBlackListAgentServices";
import { QUERY_KEYS } from "@/services/KEYS/QUERY_KEYS";
import { CORE_URLS } from "@/services/URLS/CORE_URLS";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";

const useBlackListAgent = () => {
  const { urlQueries, navigateTo, navigate } = useGlobalRoutesHandler();
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [deletedId, setDeletedId] = useState(null);
  const page = urlQueries?.page || "1";
  const per_page = urlQueries?.per_page || "10";

  const {
    services: { getAllBlackListAgentServices },
    states: { blackListSearchQuery, SetBlackListSearchQuery },
  } = useBlackListAgentServices({ page, per_page });

  const uploadBlackListAgentMutations = useMutation({
    mutationFn: (payload: any) => {
      return httpClient(
        "POST",
        `${CORE_URLS.BLACK_LIST_AGENTS}/bulk-upload`,
        payload,
        "formData"
      );
    },
    onSuccess:(response)=>{
      toast.success(response?.data?.message)
      setIsUploadModalOpen(false)
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  const deleteBlackListMutations = useMutation({
    mutationFn: (id: number) =>
      httpClient("DELETE", `${CORE_URLS.BLACK_LIST_AGENTS}/${id}`),
    onSuccess: (response) => {
      toast.success(response?.data?.message);
      queryClientGlobal.invalidateQueries({
        queryKey: [QUERY_KEYS.BLACK_LIST_AGENTS],
      });
      
      setIsDeleteModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message);
    },
  });
  const handleDeleteBlackListAgent = (id: number) => {
    deleteBlackListMutations.mutate(id);
  };
  const handleUploadBlackListAgent = (data: any) => {
    const payload = {
      file: data?.file,
    };
    uploadBlackListAgentMutations.mutate(payload);
  };

  return {
    services: {
      getAllBlackListAgentServices,
    },
    mutations: {
      uploadBlackListAgentMutations,
      deleteBlackListMutations,
    },
    function: {
      handleUploadBlackListAgent,
      handleDeleteBlackListAgent,
    },
    routing: { navigateTo, navigate },
    states: {
      isUploadModalOpen,
      setIsUploadModalOpen,
      deletedId,
      setDeletedId,
      isDeleteModalOpen,
      isAddEditModalOpen,
      setIsAddEditModalOpen,
      setIsDeleteModalOpen,
      blackListSearchQuery,
      SetBlackListSearchQuery,
    },
  };
};

export default useBlackListAgent;
