import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import Swal from "sweetalert2";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { toast } from "react-toastify";

export const useGetStates = () => {
  const { data, isPending } = useQuery({
    queryKey: [CACHE_KEYS.STATES],
    queryFn: () => {
      return httpClient("POST", URLs.GET_STATE_LIST, {});
    },
  });

  return { data, isPending };
};

export const useGetCity = (id) => {
  const { data, isPending } = useQuery({
    queryKey: [CACHE_KEYS.CITIES, id],
    queryFn: () => {
      return httpClient("POST", URLs.GET_CITY_LIST, { state_id: id });
    },
    enabled: !!id,
  });

  return { data, isPending };
};

export const useAddAndUpdatePincode = (setModal) => {
  const queryClient = useQueryClient();
  const { data, mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.ADD_UDPATE_PINCODE_DETAILS, data);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        Swal.fire("Success", response?.data?.message, "success");
        setModal({
          open: false,
          data: null,
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

  return { data, mutate, isPending };
};

export const useDeletePincode = (setModal) => {
  const queryClient = useQueryClient();
  const { data, mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.DELETE_PINCODE_DETAILS, data);
    },

    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        Swal.fire("Success", response?.data?.message, "success");
        setModal({
          open: false,
          data: null,
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

  return { data, mutate, isPending };
};

export const useExportPincode = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.EXPORT_PINCODE_LISTING, data);
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

export const usePinCodeUploadExcel = (setOpenPincodeExcel) => {
  const { data, mutate, isPending } = useMutation({
    mutationFn: (payload) => {
      return httpClient("POST", URLs.UPLOAD_PINCODE_EXCEL, payload, "formData");
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        setOpenPincodeExcel({
          open: false,
          data: null,
          title: "",
        });
      } else {
        toast.error(response?.data?.message || "Something went wrong");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate, isPending };
};
export const useDownloadSamplePincodeExcel = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      return httpClient("POST", URLs.SAMPLE_PINCODE_EXCEL);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        window.open(response?.data?.file_url, "_blank");
        toast.success(
          response?.data?.message || "Excel file downloaded successfully"
        );
      } else {
        toast.error(response?.data?.message || "Something went wrong");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  return { mutate, isPending };
};
