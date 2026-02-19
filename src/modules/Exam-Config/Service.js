import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { toast } from "react-toastify";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";

export const useAddExamConfig = (setDrawerObj, setEdit) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.ADD_UPDATE_EXAM_CONFIG, data);
    },
    onSuccess: (res) => {
      if (res?.status === 200) {
        toast.success(res?.data?.message);
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
        setDrawerObj({ open: false, data: null, title: "" });
        setEdit({ open: false, data: {}, modalTitle: "Edit" });
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
export const useDeleteExamConfig = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.DELETE_EXAM_CONFIG, data);
    },
    onSuccess: (res) => {
      if (res?.status === 200) {
        toast.success(res?.data?.message);
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
      } else {
        toast.error(res?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { mutate };
};
