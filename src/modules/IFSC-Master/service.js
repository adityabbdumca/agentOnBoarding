import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import Swal from "sweetalert2";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { toast } from "react-toastify";

export const useIfscUploadExcel = (setOpenExcelModal) => {
  const { data, mutate, isPending } = useMutation({
    mutationFn: (payload) => {
      return httpClient("POST", URLs.IFSC_DATA_UPLOAD, payload, "formData");
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        setOpenExcelModal({
          open: false,
          data: null,
          title: "",
        });
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate, isPending };
};

export const useAddAndUpdateIFSC = (setModal) => {
  const queryClient = useQueryClient();
  const { data, mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.ADD_UPDATE_IFSC_DETAILS, data);
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

export const useDeleteIFSC = (setModal) => {
  const queryClient = useQueryClient();
  const { data, mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.DELETE_IFSC_DETAILS, data);
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

export const useGetIFSCExport = () => {
  const { data, mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.EXPORT_IFSC_LISTING, data);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        Swal.fire({
          title: "Success",
          text: response?.data?.message,
          icon: "success",
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

  return { data, mutate, isPending };
};

export const useDownloadSampleIfscExcel = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: () => {
      return httpClient("POST", URLs.SAMPLE_IFSC_EXCEL);
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
