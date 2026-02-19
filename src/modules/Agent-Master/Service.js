import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { toast } from "react-toastify";

export const useGetMasterCount = (startDate, endDate) => {
  const { data, isPending,refetch } = useQuery({
    queryKey: [CACHE_KEYS.MASTER_COUNT],
    queryFn: () =>
      httpClient("POST", URLs.STAGE_COUNT, {
      //  stage_id: isSelected,
        startDate,
        endDate,
      }),
    enabled: !!endDate ,
  });
  return { data: data?.data, isPending, refetch };
};

export const useUpdateExamResult = (setOpenTableModal) => {
  const queryClient = useQueryClient();
  const { data, mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.UPDATE_EXAM_RESULT, data, "formData");
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        Swal.fire("Success", response?.data?.message, "success");
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
        setOpenTableModal(false);
      } else {
        Swal.fire("Error", response?.data?.message, "error");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate, isPending };
};

export const useExportAgentMaster = () => {
  const { theme } = useSelector((state) => state.theme);
  const { data, mutate, isPending } = useMutation({
    mutationFn: (payload) =>
      httpClient("POST", URLs.EXPORT_AGENT_MASTER, payload),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        Swal.fire({
          title: "Success",
          text: response?.data?.message,
          icon: "success",
          confirmButtonText: "Download",
          confirmButtonColor: theme.primaryColor,
        }).then(() => {
          window.open(response?.data?.file_url, "_blank");
        });
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate, isPending };
};

export const useApproveCertificate = () => {
  const queryClient = useQueryClient();
  const { data, mutate, isPending, mutateAsync } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.APPROVE_CERTIFICATE, data);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success("Success", response?.data?.message, "success");
        queryClient.invalidateQueries([
          CACHE_KEYS.MASTER_TABLE,
          "get-master-count",
        ]);
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate, isPending, mutateAsync };
};

export const useSHAREJOURNEY = () => {
  const { mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.SHARE_JOURNEY, data);
    },
    onSuccess: (response) => {
      if (response?.data?.status == 200) {
        window.open(response?.data?.return_data, "_blank");
        toast.success("Success", response?.data?.message, "success");
      } else {
        toast.error("Error", response?.data?.message, "error");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { mutate };
};
