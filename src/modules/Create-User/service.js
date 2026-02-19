import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";

export const useGetReportingList = () => {
  const { data, mutate } = useMutation({
    mutationFn: (payload) =>
      httpClient("POST", URLs.GET_REPORTING_TO_LIST, payload),
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate };
};

export const useGetReportingUserList = (id) => {
  const { data } = useQuery({
    queryKey: [CACHE_KEYS.REPORTING_USER_LIST],
    queryFn: () =>
      httpClient("POST", URLs.GET_REPORTING_USER_LIST, { vertical_id: 3 }),
    enabled: !!id,
  });
  return { data };
};

export const useGetCategoriesList = () => {
  const { data } = useQuery({
    queryKey: [CACHE_KEYS.CATEGORIES_LIST],
    queryFn: () => httpClient("GET", URLs.GET_CATEGORIES, { vertical_id: 3 }),
  });
  return { data: data?.data?.data };
};

export const useCreateUser = (setIsDrawerOpen) => {
  const queryClient = useQueryClient();
  const { data, mutate } = useMutation({
    mutationFn: (payload) => httpClient("POST", URLs.CREATE_USER, payload),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        window.parent.postMessage(
          {
            type: "USER_CREATED",
            url: window.location.href,
          },
          "*"
        );
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
        setIsDrawerOpen(false);
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

export const useGetUserExport = () => {
  const { data, mutate } = useMutation({
    mutationFn: (payload) =>
      httpClient("POST", URLs.EXPORT_USER_LISTING, payload),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        Swal.fire({
          title: "Success",
          text: response?.data?.message,
          icon: "success",
          confirmButtonText: "Download",
          confirmButtonColor: "#3085d6",
        }).then(() => {
          window.open(response?.data?.file_url, "_blank");
        });
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate };
};

export const useGetNewRole = (payload) => {
  const { data } = useQuery({
    queryKey: [CACHE_KEYS.NEW_ROLE, payload],
    queryFn: () =>
      httpClient("POST", URLs.GET_ROLE_WITH_VERTICAL, { vertical_id: payload }),
    enabled: !!payload,
  });
  return { data };
};

export const useGetNewBranch = (payload) => {
  const { data } = useQuery({
    queryKey: [CACHE_KEYS.NEW_BRANCH, payload],
    queryFn: () =>
      httpClient("POST", URLs.GET_BRANCH_LIST, {
        organisation_name_id: payload?.bankOrBrokerName,
        vertical: payload?.vertical,
        channel: payload?.channel,
      }),
    enabled:
      !!payload?.vertical && !!payload?.channel && !!payload?.bankOrBrokerName,
  });
  return { data };
};

export const useSetActiveUser = () => {
  const { mutate } = useMutation({
    mutationFn: (data) => httpClient("POST", URLs.SET_ACTIVE_USER, data),
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
  return {
    mutate,
  };
};
