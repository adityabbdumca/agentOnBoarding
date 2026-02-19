import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import Swal from "sweetalert2";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { toast } from "react-toastify";

export const useCreateOnboardingData = (setModal, reset) => {
  const queryClient = useQueryClient();
  const { data, mutate } = useMutation({
    mutationFn: (payload) => {
      return httpClient("POST", URLs.CREATE_ONBOARDING, payload, "formData");
    },
    onSuccess: (response) => {
      if (response?.data?.status) {
        Swal.fire("Success", response?.data?.message, "success");
        const type = new URLSearchParams(window.location.search).get("type");
        window.parent.postMessage(
          {
            type: `${type.toUpperCase()}_CREATED`,
            url: window.location.href,
          },
          "*"
        );
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
        reset();
        setModal({
          open: false,
          data: null,
        });
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

export const useGetDemoOnboardingExcel = (open) => {
  const { data, mutate } = useQuery({
    queryKey: [CACHE_KEYS.DEMO_ONBOARDING_EXCEL],
    queryFn: () => {
      return httpClient("POST", URLs.GET_DEMO_ADD_ONBOARDING_EXCEL);
    },
    enabled: !!open,
  });

  return { data, mutate };
};

export const useExportOnboarding = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.EXPORT_ONBOARDING_LISTING, data);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        Swal.fire({
          title: "Success",
          text: response?.data?.message,
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Download",
        }).then(() => {
          window.open(response?.data?.file_url, "_blank");
        });
      } else {
        Swal.fire("Error", response?.data?.message, "error");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { mutate, isPending };
};
