import { httpClient } from "@/api/httpClient";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const useStatusTracking = () => {
  const queryClient = useQueryClient();
  const [viewModal, setViewModal] = useState({
    open: false,
    data: null,
    endorsement_id: null,
  });
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    action: null,
    row: null,
  });
  const [respondModalOpen, setIsRespondModalOpen] = useState({
    open: false,
    action: null,
    endorsement_id: null,
    endorsement_status_id: null,
  });
  const [historyModalOpen, setIsHistoryModalOpen] = useState({
    open: false,
    action: null,
    endorsement_id: null,
  });
  const historyEndorsementMutation = useMutation({
    mutationFn: () => {
      return httpClient("POST", `${URLs.ENDORSEMENT_HISTORY}`, {
        endorsement_id: historyModalOpen?.endorsement_id,
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  const updateEndorsementStatusMutation = useMutation({
    mutationFn: (data) => {
      // const { endorsement_id, ...payload } = data;
      return httpClient(
        "POST",
        `${URLs.UPDATE_ENDORSEMENT_DATA}`,
        data,
        "formData"
      );
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  const viewEndorsementMutation = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", `${URLs.ENDORSEMENT_VIEW}`, {
        endorsement_id: data?.endorsement_id,
      });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  const exportMutation = useMutation({
    mutationFn: (payload) =>
      httpClient("POST", URLs.ENDORSEMENT_EXPORT, payload),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);

        if (response?.data?.file_url) {
          window.open(response?.data?.file_url, "_blank");
        }
      } else {
        toast.error(response?.data?.message || "Export failed!");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  const handleActionSubmit = (data) => {
    updateEndorsementStatusMutation.mutate(
      {
        endorsement_status_id: data.button_id,
        endorsement_id: data.endorsement_id,
      },
      {
        onSuccess: (response) => {
          if (response?.status === 200) {
            toast.success(
              response?.data?.message || "Status Updated Successfully"
            );
            setConfirmModal({ open: false, action: null, row: null });
            queryClient.invalidateQueries([CACHE_KEYS.ENDORSEMENT_UPDATE]);
          } else {
            Swal.fire("Error", response.data.message, "error");
          }
        },
        onError: (error) => {
          // Optional: override or extend global onError
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong.";
          Swal.fire("Error", message, "error");
        },
      }
    );
  };
  const handleRespondSubmit = (data) => {
    updateEndorsementStatusMutation.mutate(
      {
        ...data,
        respond: data.respond,
        endorsement_id: data.endorsement_id,
      },
      {
        onSuccess: (response) => {
          if (response?.status === 200) {
            toast.success(
              response?.data?.message || "Status Updated Successfully"
            );

            setIsRespondModalOpen({
              open: false,
              action: null,
              endorsement_id: null,
              endorsement_status_id: null,
            });
            setViewModal({ open: false, data: null });
            queryClient.invalidateQueries([CACHE_KEYS.ENDORSEMENT_UPDATE]);
          } else {
            Swal.fire("Error", response.data.message, "error");
          }
        },
        onError: (error) => {
          // Optional: override or extend global onError
          const message =
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong.";
          Swal.fire("Error", message, "error");
        },
      }
    );
  };
  const handleHistorySubmit = (data) => {
    historyEndorsementMutation.mutate(data);
  };

  useEffect(() => {
    if (historyModalOpen.open && historyModalOpen.endorsement_id) {
      historyEndorsementMutation.mutate({
        endorsement_id: historyModalOpen.endorsement_id,
      });
    }
  }, [historyModalOpen.open, historyModalOpen.endorsement_id]);
  return {
    states: {
      respondModalOpen,
      setIsRespondModalOpen,
      historyModalOpen,
      setIsHistoryModalOpen,
      confirmModal,
      setConfirmModal,
      viewModal,
      setViewModal,
    },
    service: {
      updateEndorsementStatusMutation,
      historyEndorsementMutation,
      viewEndorsementMutation,
      exportMutation,
    },
    functions: { handleActionSubmit, handleRespondSubmit, handleHistorySubmit },
  };
};

export default useStatusTracking;
