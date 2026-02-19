import { httpClient } from "@/api/httpClient";
import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { queryClientGlobal } from "@/lib/tanstack-query/query.config";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

const useAllForm = () => {
  const { subRoute, navigate, navigateTo } = useGlobalRoutesHandler();

  const [isOTPModalOpen, toggleIsOTPModalOpen] = useState(false);
  const [isOTPVerified, setIsOTPVerified] = useState(false);

  const getAllAgentService = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", `${URLs.GET_ENDORSEMENT_REGISTER_REQUEST}`, {
        endorsement_type_id: data?.id,
      });
    },
    onSuccess: (response) => {
      if (response?.status === 200) {
        return;
      } else {
        Swal.fire("Error", response?.data?.message, "error");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  const getSingleAgentService = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", `${URLs.GET_ENDORSEMENT_REGISTER_REQUEST}`, {
        endorsement_type_id: data?.endorsementTypeId,
        agent_id: data?.agentId,
      });
    },
    onSuccess: (response) => {
      if (response?.status === 200 || response?.status === 201) {
        // setRequestAgent(response?.reportee_agents);
        return;
      } else {
        Swal.fire("Error", response?.data?.message, "error");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  const postOtpGenerateMutation = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", `${URLs.ENDORSEMENT_OTP_GENERATE}`, data);
    },
    onSuccess: (response) => {
      if (response.status == 200 || response.status == 201) {
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  const postOtpVerifyMutation = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", `${URLs.ENDORSEMENT_OTP_VERIFY}`, data);
    },
    onSuccess: (response) => {
      if (response.status == 200 || response.status == 201) {
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  const postUserEndorsementAgentTypeMutation = useMutation({
    mutationFn: (data) => {
      return httpClient(
        "POST",
        `${URLs.STORE_ENDORSEMENT_ENDORSEMENT_REGISTER_REQUEST}`,
        data,
        "formData"
      );
    },
    onSuccess: (response) => {
      if (response?.status === 200 || response?.status === 201) {
        toast.success(
          response?.data?.message || "Endorsement Register successfully"
        );
            queryClientGlobal.invalidateQueries([CACHE_KEYS.ENDORSEMENT_UPDATE]);
        navigateTo({ url: "/servicing-module/status-tracking" });
      } else {
        toast.error(response?.data?.message || "Something Went Wrong");
      }
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    },
  });

  return {
    services: { getAllAgentService, getSingleAgentService },
    mutations: {
      postOtpGenerateMutation,
      postOtpVerifyMutation,
      postUserEndorsementAgentTypeMutation,
    },
    routing: { subRoute, navigate, navigateTo },
    states: {
      isOTPModalOpen,
      toggleIsOTPModalOpen,
      isOTPVerified,
      setIsOTPVerified,
    },
  };
};

export default useAllForm;
