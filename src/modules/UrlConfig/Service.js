import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { toast } from "react-toastify";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";

export const useAddUrlConfig = (setOpenModal) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => httpClient("POST", URLs.URL_CONFIG, payload),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        queryClient.invalidateQueries(CACHE_KEYS.MASTER_TABLE);

        setOpenModal(false);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { mutate, isPending };
};

export const useUpdateUrlConfig = (setOpenModal) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (payload) =>
      httpClient(
        "PUT",
        `${URLs.URL_CONFIG}/${payload?.credential_id}`,
        payload
      ),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        queryClient.invalidateQueries(CACHE_KEYS.MASTER_TABLE);

        setOpenModal(false);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { mutate, isPending };
};

export const useDeleteUrlConfig = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: (payload) =>
      httpClient("DELETE", `${URLs.URL_CONFIG}/${payload}`),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        queryClient.invalidateQueries(CACHE_KEYS.MASTER_TABLE);

        toast.success(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { mutate, isPending };
};
export const useFLSSyncUrlConfig = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      httpClient("GET", `${URLs.SYNC_URL_CONFIG}?channel_id=1&level_id=26`),
    onSuccess: (response) => {
      if (response?.status === 200) {
        toast.success(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { mutate, isPending };
};
