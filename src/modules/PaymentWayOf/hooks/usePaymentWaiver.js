import { httpClient } from "@/api/httpClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { useState } from "react";
import { toast } from "react-toastify";

export const usePaymentWaiver = ({ setRoleOpen }) => {
  //STATES
  const [curentNumber, upDateNumber] = useState(1);
  const [searchApplnData, setSearchApplnData] = useState(null);
  const [edit, setEdit] = useState({
    open: false,
    data: {},
    modalTitle: "Edit",
  });
  const queryClient = useQueryClient();
  //Mutations
  const createPaymentWaiverMutation = useMutation({
    mutationKey: [CACHE_KEYS.PAYMENT_WAIVER],
    mutationFn: (payload) => httpClient("POST", URLs.CREATEPAYMENTOF, payload),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        setRoleOpen(false);
        queryClient.invalidateQueries([CACHE_KEYS.LISTPAYMENTWAYOF]);

        return;
      }
      toast.error(response?.data?.message);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  const { mutate: searchApplicationNoMutation } = useMutation({
    mutationKey: [CACHE_KEYS.SEARCH_APPLICATION_NO],
    mutationFn: (payload) =>
      httpClient("POST", URLs.SEARCH_APPLICATION_NO, payload),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.data?.re_attempt);
        setSearchApplnData(response?.data);
        return;
      } else {
        setSearchApplnData(null);
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  const { mutate: deletePaymentWayOfMutation } = useMutation({
    mutationKey: [CACHE_KEYS.DELETE_PAYMEENT_WAY_OF],
    mutationFn: (payload) =>
      httpClient("POST", URLs.DELETE_PAYMEENT_WAY_OF, payload),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        queryClient.invalidateQueries([CACHE_KEYS.LISTPAYMENTWAYOF]);
        return;
      }
      toast.error(response?.data?.message);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  const { mutate: updatePaymentWayOfMutation } = useMutation({
    mutationKey: [CACHE_KEYS.UPDATE_PAYMENT_WAY_OF],
    mutationFn: (payload) =>
      httpClient("POST", URLs.UPDATE_PAYMENT_WAY_OF, payload),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        queryClient.invalidateQueries([CACHE_KEYS.LISTPAYMENTWAYOF]);
        setEdit({ open: false, data: {}, modalTitle: "Edit" });
        return;
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  //handler
  const handlePaymentWaiverSubmit = (data) => {
    if (data.payment_waiver_status === "1") {
      const payload = {
        type: data?.type?.label,
        is_way_of: data?.is_way_of,
        re_attempt: curentNumber,
      };
      createPaymentWaiverMutation.mutate(payload);
    } else {
      if (searchApplnData?.return_data) {
        const payload = {
          type: "Individual",
          user_id: searchApplnData?.return_data?.id,
          application_number: searchApplnData?.return_data?.application_number,
          is_way_of: data?.is_way_of,
          re_attempt: curentNumber,
        };
        createPaymentWaiverMutation.mutate(payload);
      } else {
        const payload = {
          application_number: data?.search_value,
        };
        searchApplicationNoMutation(payload);
      }
    }
  };
  const clearSearchData = () => setSearchApplnData(null);

  return {
    states: { curentNumber, upDateNumber, edit, setEdit },
    mutations: {
      createPaymentWaiverMutation,
      deletePaymentWayOfMutation,
      updatePaymentWayOfMutation,
    },
    functions: { handlePaymentWaiverSubmit, clearSearchData },
    searchApplnData,
  };
};
