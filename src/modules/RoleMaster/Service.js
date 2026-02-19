import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import Swal from "sweetalert2";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { toast } from "react-toastify";

export const useGetRoleMaster = () => {
  const { data, isPending } = useQuery({
    queryKey: [CACHE_KEYS.ROLE_MASTER],
    queryFn: () => httpClient("POST", URLs.VIEW_REPORTING_TO_ROLES),
  });
  return { data, isPending };
};

export const useCreateRole = (setOpenModal) => {
  const queryClient = useQueryClient();
  const { data, mutate, isPending } = useMutation({
    mutationKey: ["createRoleMaster"],
    mutationFn: (payload) => httpClient("POST", URLs.CREATE_ROLE, payload),
    onSuccess: (response) => {
      if (response?.status === 200) {
        Swal.fire({
          title: "Added!",
          text: response?.data?.message,
          icon: "success",
        });
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
        setOpenModal(false);
      } else {
        Swal.fire({
          title: "Error!",
          text: response?.data?.message,
          icon: "error",
        });
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate, isPending };
};

export const useUpdateRole = (setOpenModal) => {
  const queryClient = useQueryClient();
  const { data, mutate, isPending } = useMutation({
    mutationKey: ["updateRoleMaster"],
    mutationFn: ({ payload, id }) => {
      return httpClient("PUT", `${URLs.UPDATE_ROLE}/${id}`, payload);
    },
    onSuccess: (response) => {
      if (response?.status === 200) {
        Swal.fire({
          title: "Added!",
          text: response?.data?.message,
          icon: "success",
        });
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
        setOpenModal(false);
      } else {
        Swal.fire({
          title: "Error!",
          text: response?.data?.message,
          icon: "error",
        });
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate, isPending };
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  const { data, mutate, isPending } = useMutation({
    mutationKey: ["deleteRoleMaster"],
    mutationFn: (id) => httpClient("POST", `${URLs.DELETE_ROLE}/${id}`),
    onSuccess: (response) => {
      if (response?.status === 200) {
        Swal.fire({
          title: "Deleted!",
          text: response?.data?.message,
          icon: "success",
        });
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
      } else {
        Swal.fire({
          title: "Error!",
          // text: response?.data?.message,
          icon: "error",
        });
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate, isPending };
};

export const useGetVertical = () => {
  const { data, isPending } = useQuery({
    queryKey: [CACHE_KEYS.VERTICAL],
    queryFn: () => httpClient("POST", URLs.GET_VERTICAL_LIST),
  });
  return { data, isPending };
};
