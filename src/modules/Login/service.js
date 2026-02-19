import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";

export const useRegisterUser = (setOpenModal) => {
  const { navigate } = useGlobalRoutesHandler();
  const { data, mutate, isPending } = useMutation({
    mutationFn: (data) => httpClient("POST", URLs.REGISTER_USER, data),
    onSuccess: (response) => {
      // Handle successful API response (status 200)
      if (response?.data?.status === 200) {
        setOpenModal && setOpenModal(true);
        toast.success(response?.data?.message);
        if (response?.data?.token) {
          localStorage.setItem("token", response?.data?.token);
          localStorage.setItem(
            "application_no",
            response?.data?.application_number
          );
          localStorage.setItem(
            "user",
            JSON.stringify({
              name: response?.data?.name,
              mobile: response?.data?.mobile,
            })
          );
          localStorage.setItem("vertical_id", response?.data?.vertical_id);
          localStorage.setItem(
            "isAdmin",
            response?.data?.type.toLowerCase() === "agent" ? "0" : "1"
          );
          const type = response?.data?.type?.toLowerCase();
          navigate(type === "agent" ? "/agent" : "/agent-master");
        }
        // });
      }
      // Handle API-level errors (non-200 status from your API)
      else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate, isPending };
};

export const useLoginUser = () => {
  const { navigate } = useGlobalRoutesHandler();
  const { data, mutate, mutateAsync } = useMutation({
    mutationFn: (data) => httpClient("POST", URLs.LOGIN_USER, data),
    onSuccess: (response) => {
      if (response?.data?.status === 500) {
        toast.error(response?.data?.message);
      } else if (response?.status === 200) {
        toast.success(response?.data?.message);
        if (response?.data?.token) {
          localStorage.setItem("token", response?.data?.token);
          localStorage.setItem(
            "application_no",
            response?.data?.application_number
          );
          localStorage.setItem("vertical_id", response?.data?.vertical_id);
          localStorage.setItem(
            "user",
            JSON.stringify({
              name: response?.data?.name,
              mobile: response?.data?.mobile,
            })
          );
          localStorage.setItem("has_license", response?.data?.has_license);
          localStorage.setItem(
            "agentType",
            JSON.stringify({
              value: response?.data?.user_type_id,
              label:
                response?.data?.user_type == "fresh"
                  ? "New Agent"
                  : response?.data?.user_type,
            })
          );
          localStorage.setItem(
            "isAdmin",
            response?.data?.type.toLowerCase() === "agent" ? "0" : "1"
          );
          localStorage.setItem("last_login_date", response?.data?.last_login);
          const type = response?.data?.type?.toLowerCase();
          navigate(type === "agent" ? "/agent" : "/agent-master");
        }
        // });
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate, mutateAsync };
};

export const useRegisterUserLead = (setOpenModal, setOpen) => {
  const queryClient = useQueryClient();
  const { data, mutate, isPending } = useMutation({
    mutationFn: (data) => httpClient("POST", URLs.REGISTER_LEAD, data),
    onSuccess: (response) => {
      // Handle successful API response (status 200)
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        setOpen(true);
        response.data.token && [setOpen(false), setOpenModal(false)];
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
      }
      // Handle API-level errors (non-200 status from your API)
      else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate, isPending };
};

export const useForgotPassword = () => {
  const { data, mutate } = useMutation({
    mutationFn: (data) => httpClient("POST", URLs.FORGOT_PASSWORD, data),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate };
};
