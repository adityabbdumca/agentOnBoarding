import { httpClient } from "@/api/httpClient";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";

const useRegisterRequest = () => {
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

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
  const postUserEndorsementAgentTypeMutation = useMutation({
    mutationFn: (data) => {
      return httpClient(
        "POST",
        `${URLs.STORE_ENDORSEMENT_ENDORSEMENT_REGISTER_REQUEST}`,
        data,
        "formData"
      );
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      Swal.fire("Error", message, "error");
    },
  });
  const postOtpGenerateMutation = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", `${URLs.ENDORSEMENT_OTP_GENERATE}`, data);
    },
    // onSuccess:(response)=>{
    //   if(response.status==200 || response.status==201){
    //     toast.success("otp gene")
    //   }
    // },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      Swal.fire("Error", message, "error");
    },
  });
  const postOtpVerifyMutation = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", `${URLs.ENDORSEMENT_OTP_VERIFY}`, data);
    },
    onError: (error) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong. Please try again.";
      Swal.fire("Error", message, "error");
    },
  });
  const handleOtpGenerate = (data) => {};
  const handleOtpVerify = (data) => {};
  return {
    states: { isOtpModalOpen, setIsOtpModalOpen },
    services: {
      postUserEndorsementAgentTypeMutation,
      postOtpGenerateMutation,
      postOtpVerifyMutation,
      getAllAgentService,
    },
    functions: { handleOtpGenerate, handleOtpVerify },
  };
};

export default useRegisterRequest;
