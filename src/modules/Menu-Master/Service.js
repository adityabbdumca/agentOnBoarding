import { useMutation } from "@tanstack/react-query";
import { httpClient } from "@/api/httpClient";
import Swal from "sweetalert2";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { toast } from "react-toastify";

export const useAddMenu = () => {
  const { mutate } = useMutation({
    mutationFn: async (data) => httpClient("POST", URLs.ADD_MENU, data),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        Swal.fire("Success", response?.data?.message, "success");
      } else {
        Swal.fire("Error", response?.data?.message, "error");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { mutate };
};
