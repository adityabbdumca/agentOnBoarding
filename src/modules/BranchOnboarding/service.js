import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { httpClient } from "@/api/httpClient";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { toast } from "react-toastify";

export const useAddAndUpdateBranch = (setModal) => {
  const queryClient = useQueryClient();
  const { data, mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.ADD_UPDATE_BRANCH, data);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        Swal.fire("Success", response?.data?.message, "success");
        window.parent.postMessage(
          {
            type: "BRANCH_CREATED",
            url: window.location.href,
          },
          "*"
        );
        setModal({
          open: false,
          data: null,
          title: "",
        });
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
      } else {
        Swal.fire("Error", response?.data?.message, "error");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  return { data, mutate };
};

export const useUploadFile = (setModal) => {
  const queryClient = useQueryClient();
  const { data, mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.UPLOAD_BRANCH_EXCEL, data, "formData");
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        Swal.fire("Success", response?.data?.message, "success");
        setModal(false);
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
      } else {
        Swal.fire("Error", response?.data?.message, "error");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  return { data, mutate };
};

export const useSampleFile = () => {
  const { data } = useQuery({
    queryKey: [CACHE_KEYS.BRANCH_SAMPLE_FILE],
    queryFn: () => {
      return httpClient("POST", URLs.BRANCH_ONBOARDING_DEMO_EXCEL);
    },
  });
  return { data };
};

export const useGetBranchName = (type) => {
  const { data } = useQuery({
    queryKey: [CACHE_KEYS.ORGANISATION_NAME, type],
    queryFn: () => {
      return httpClient("POST", URLs.GET_BRANCH_NAME, { type: type });
    },
    enabled: !!type,
  });
  return { data };
};
