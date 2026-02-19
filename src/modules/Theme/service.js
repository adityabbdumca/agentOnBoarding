import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { toast } from "react-toastify";

export const useCreateAndUpdateTheme = (setOpen) => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (data) => httpClient("POST", "create/UpdateTheme", data),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        queryClient.invalidateQueries(["theme"]);
        setOpen({ open: false, data: null, modalTitle: "Add" });
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  return { mutate };
};

export const useGetTheme = () => {
  const { data } = useQuery({
    queryKey: [CACHE_KEYS.THEMES_LIST],
    queryFn: () => httpClient("POST", "getThemeList"),
  });
  return { data };
};

export const useSetTheme = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (data) => httpClient("POST", "setTheme", data),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        queryClient.invalidateQueries(["theme", "settheme"]);
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  return { mutate };
};

export const useDeleteTheme = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (data) => httpClient("POST", "deleteTheme", data),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        queryClient.invalidateQueries(["theme"]);
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  return { mutate };
};
