import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";

import { URLs } from "@/lib/ApiService/constants/URLS";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { toast } from "react-toastify";

export const useAddTrainingDocument = (setOpen) => {
  const queryClient = useQueryClient();
  const { data, mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.ADD_TRAINING_DOCUMENT, data, "formData");
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        setOpen({ open: false, data: {} });
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
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

export const useDeleteTrainingTime = (setModal) => {
  const queryClient = useQueryClient();
  const { data, mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", `${URLs.DELETE_TRAINING_TIME}`, { id: data });
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
        setModal({ open: false, data: {} });
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

export const useDeleteTrainingDoc = (setModal) => {
  const queryClient = useQueryClient();
  const { data, mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", `${URLs.DELETE_TRAINING_DOCUMENT}`, {
        id: data,
      });
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
        setModal({ open: false, data: {} });
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

export const useAddAndUpdateTrainingTime = (setOpen) => {
  const queryClient = useQueryClient();
  const { data, mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.ADD_TRAINING_TIME, data, "formData");
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        setOpen({ open: false, data: {} });
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
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
