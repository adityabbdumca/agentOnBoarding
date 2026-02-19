import { httpClient } from "@/api/httpClient";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { URLs } from "@/lib/ApiService/constants/URLS";
import { queryClientGlobal } from "@/lib/tanstack-query/query.config";
import {
  useMutation,
  useQuery,
  useQueryClient
} from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { incrementAgent, setApproved, setDiscrepancy } from "./agent.slice";

export const useProfileDetails = () => {
  const dispatch = useDispatch();
  useSelector((state) => state.theme);
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.ADD_UPDATE_PROFILE, data);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);

        dispatch(incrementAgent());
        queryClientGlobal.invalidateQueries([CACHE_KEYS.USER_DETAILS]);
        const isAdmin = localStorage.getItem("isAdmin") === "1";
        if (!isAdmin) {
          localStorage.removeItem("user");
          localStorage.setItem(
            "user",
            JSON.stringify({
              name: response?.data?.data?.first_name || "",
              mobile: response?.data?.data?.mobile || "",
            })
          );
        }
      } else {
        const errors = response?.data?.message;
        if (Array.isArray(errors)) {
          errors.forEach((each) => toast.error(each));
        } else {
          toast.error(errors);
        }
      }
    },
    onError: (error) => {
      const message = error?.response?.data?.message;

      if (Array.isArray(message)) {
        toast.error(message[0]);
      } else {
        toast.error(message || error?.message);
      }
    },
  });

  return { mutate, isPending };
};

export const useOccupationList = () => {
  const { data } = useQuery({
    queryKey: [CACHE_KEYS.OCCUPATIONS_LIST],
    queryFn: () => {
      return httpClient("GET", URLs.OCCUPATIONS_LIST);
    },
  });
  return { data };
};

export const useLifeInsuranceCompanyList = () => {
  const { data } = useQuery({
    queryKey: [CACHE_KEYS.LIFE_INSURANCE_COMPANY_LIST],
    queryFn: () => {
      return httpClient("POST", URLs.LIFEINSURANCECOMPANYLIST);
    },
  });
  return { data };
};
export const useGeneralInsuranceCompanyList = () => {
  const { data } = useQuery({
    queryKey: [CACHE_KEYS.GENERAL_INSURANCE_COMPANY_LIST],
    queryFn: () => {
      return httpClient("POST", URLs.GENERAL_INSURANCE_COMPANY_LIST);
    },
  });
  return { data };
};
export const useBankDetails = () => {
  const dispatch = useDispatch();
  useSelector((state) => state.theme);
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.ADD_UPDATE_BANK_DETAILS, data);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        queryClientGlobal.invalidateQueries([CACHE_KEYS.USER_DETAILS]);
        dispatch(incrementAgent());
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  return { mutate, isPending };
};

export const useNomineeDetails = () => {
  const dispatch = useDispatch();
  useSelector((state) => state.theme);
  const vertical_id = localStorage.getItem("vertical_id");
  const isAgent = vertical_id === "1" || vertical_id === "2";
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.ADD_UPDATE_NOMINEE, data);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        queryClientGlobal.invalidateQueries([CACHE_KEYS.USER_DETAILS]);
        if (!isAgent) {
          dispatch(incrementAgent());
        }
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  return { mutate, isPending };
};
export const useExamDetails = () => {
  const dispatch = useDispatch();
  useSelector((state) => state.theme);
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.ADD_UPDATE_EXAM_DETAILS, data);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        queryClientGlobal.invalidateQueries([CACHE_KEYS.USER_DETAILS]);
        dispatch(incrementAgent());
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

export const useConsentForm = () => {
  const dispatch = useDispatch();
  useSelector((state) => state.theme);
  const { mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.GENERATE_DECLARATION_FORM, data);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        dispatch(incrementAgent());
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

export const useDocuments = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.ADD_UDPATE_DOCUMENTS, data, "formData");
    },
    onSuccess: (response) => {
      if (response?.data?.status) {
        toast.success(response?.data?.message);
        dispatch(incrementAgent());
        queryClient.invalidateQueries({
          queryKey: [CACHE_KEYS.USER_DETAILS, CACHE_KEYS.USER_DOCUMENT],
          refetchType: "active",
        });
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  return { mutate, isPending };
};

export const useHereidatry = (id) => {
  const { data } = useQuery({
    queryKey: [CACHE_KEYS.HEREIDATRY_DOCUMENT],
    queryFn: () => {
      return httpClient("POST", URLs.HEREIDATRY_DOCUMENT, { id: id });
    },
  });

  return { data: data?.data?.pdf_url };
};

export const useRazorPay = () => {
  const { data } = useQuery({
    queryKey: [CACHE_KEYS.RAZORPAY],
    queryFn: () => {
      return httpClient("POST", URLs.HANDLE_PAYMENT);
    },
  });

  return { data };
};

export const useGetData = (id) => {
  const { data, isPending, isFetching, refetch } = useQuery({
    queryKey: [CACHE_KEYS.USER_DETAILS, id],
    queryFn: () => {
      const payload = {
        ...(id ? { id: id } : {}),
      };
      return httpClient("POST", URLs.GET_USER_DATA, payload);
    },
    onError: (err) => {
      toast.error(err.message || err?.data?.message);
    },
  });

  return { data, isPending, isFetching, refetch };
};

export const useGetTrainingDocs = ({id}) => {
  const { data, isPending } = useQuery({
    queryKey: [CACHE_KEYS.TRAINING_DOCS],
    queryFn: () => {
       const payload = {
        ...(id ? { id: id } : {}),
      };
      return httpClient("POST", URLs.TRAINING_DOCS,payload);
    },
  });

  return { data: data?.data, isPending };
};

export const useStartTraining = ({ agentId, isFls, agentType }) => {
  const { data, isPending } = useQuery({
    queryKey: [CACHE_KEYS.START_TRAINING, agentId, isFls], // Add dependencies
    queryFn: () => {
      const payload = isFls ? { id: agentId } : {};
      return httpClient("POST", URLs.START_TRAINING, payload);
    },
    enabled: ["composite", "transfer"].includes(agentType) ? false : true,
  });

  return { data: data?.data, isPending };
};

export const useGetStateCity = () => {
  const { data, mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.GET_CITY_STATE, data);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate };
};

export const useGetIFSCCode = () => {
  const { data, mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.GET_IFSC_DETAILS, data);
    },
    // onSuccess:(res)=>{

    // },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate };
};

export const useGetExamCenter = () => {
  const { data, mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.GET_EXAM_CENTER_DETAILS, data);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate };
};

export const useCreateCkyc = () => {
  const dispatch = useDispatch();
  useSelector((state) => state.theme);

  const { data, mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.CREATE_CKYC, data);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        dispatch(incrementAgent());
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate };
};

export const useAgentType = () => {
  const queryClient = useQueryClient();
  const updateAgentTypeMutation = useMutation({
    mutationFn: (data) => httpClient("POST", URLs.SET_AGENT_TYPE, data),
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);

        queryClient.invalidateQueries({
          queryKey: [CACHE_KEYS.AGENT_MENU],
          refetchType: "active",
        });
        queryClient.invalidateQueries({
          queryKey: [CACHE_KEYS.USER_DETAILS],
          refetchType: "active",
        });
      } else {
        toast.error(response?.data?.message);
      }
    },
  });
  return { updateAgentTypeMutation };
};

export const useDeclareOTP = () => {
  const { data, mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.VERIFY_OTP, data);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
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

export const useGetDiscrepancyList = (id) => {
  const { data } = useQuery({
    queryKey: [CACHE_KEYS.DISCREPANCY, id],
    queryFn: () => {
      return httpClient("POST", URLs.GET_DISCREPANCY_LISTING, {
        master_desc_id: id,
      });
    },
    // onSuccess: (response) => {
    //   if (response?.data?.status === 200) {
    //     Swal.fire("Success", response?.data?.message, "success");
    //   } else {
    //     Swal.fire("Error", response?.data?.message, "error");
    //   }
    // },
  });
  return { data };
};

export const useDeclarePDF = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { data, mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.GENERATE_DECLARATION_PDF, data);
    },
    onSuccess: (response) => {
      if (response?.data?.pdf_url) {
        dispatch(incrementAgent());
        toast.success(response?.data?.message);
        queryClient.invalidateQueries({
          queryKey: [CACHE_KEYS.USER_DETAILS],
          refetchType: "active",
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

export const useCreateDiscrepancy = (setModalData) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { data, mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.ADD_DISCREPANCY, data, "formData");
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        dispatch(setDiscrepancy(+response.data.return_data.master_desc_id));
        queryClient.invalidateQueries([CACHE_KEYS.USER_DOCUMENT]);

        setModalData({
          open: false,
          key: null,
          text: null,
        });
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate };
};

export const useCreateApproved = (setModalData) => {
  const dispatch = useDispatch();
  const { data, mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.APPROVE_AGENT_DOCUMENT, data);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        Swal.fire("Success", response?.data?.message, "success");
        dispatch(setApproved(+response.data.master_desc_id));

        setModalData(false);
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate };
};

export const useCreateNOC = () => {
  const dispatch = useDispatch();
  const { data, mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.CREATE_NOC, data);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        // dispatch(incrementAgent());
        dispatch(setApproved(+response.data.master_desc_id));
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate };
};

export const useUpdateDiscrepancy = (setOpenModal) => {
  const queryClient = useQueryClient();
  const { data, mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient(
        "POST",
        URLs.UPDATE_DISCREPANCY_DETAILS,
        data,
        "formData"
      );
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        queryClient.invalidateQueries([CACHE_KEYS.MASTER_TABLE]);
        setOpenModal(false);
      } else {
        toast.error(response?.data?.message);
      }
    },
  });
  return { data, mutate };
};

export const useSendPaymentResponse = (
  setPaymentMode,
  toggleIsPaymentSuccessModal
) => {
  const { data, mutate, isPending, variables, isSuccess, mutateAsync } =
    useMutation({
      mutationFn: (data) => {
        return httpClient("POST", URLs.VERIFY_PAYMENT, data);
      },
      onSuccess: (response, variables) => {
        if (variables?.source === "share") {
          toast.success(response?.data?.message);
          setPaymentMode("share");
          return;
        }
        if (response?.data?.status === 200) {
          toast.success(response?.data?.message);
          const isPaymentRedirection =
            response?.data?.data?.isPaymentRedirection;
          if (isPaymentRedirection) {
            window.location.replace(response?.data?.data?.paymentUrl);
            setPaymentMode("online");
          } else {
            toggleIsPaymentSuccessModal(true);
          }
        } else {
          toast.error(response?.data?.message);
        }
      },
      onError: (error) => {
        toast.error(error?.response?.data?.message || error.message);
      },
    });
  return { data, mutate, mutateAsync, isPending, variables, isSuccess };
};

export const useSendPaymentPayload = (
  handleCloseModal,
  toggleIsPaymentSuccessModal
) => {
  const { data, mutate } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.VERIFY_PAYMENT, data);
    },
    onSuccess: (res) => {
      if (res?.data?.status === 200) {
        toast.success(res?.data?.message);
        handleCloseModal();
        toggleIsPaymentSuccessModal(true);
      } else {
        toast.error(res?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  return { data, mutate };
};

export const useApproveExamDate = () => {
  const navigate = useNavigate();
  const { data, mutate, mutateAsync, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.APPROVE_EXAM_DATE, data, "formData");
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        navigate("/agent-master");
        // dispatch(incrementAgent());
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error?.message);
    },
  });
  return { data, mutate, mutateAsync, isPending };
};

export const useDocumentFinalApproval = (userType = null) => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { data, mutate, mutateAsync, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.AGENT_FINAL_APPROVAL, data, "formData");
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
        queryClient.invalidateQueries([CACHE_KEYS.USER_DETAILS]);
        if (
          userType === "fresh" &&
          response?.data?.approval_status === "Approve"
        ) {
          dispatch(incrementAgent());
        }
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate, mutateAsync, isPending };
};

export const useGetExistingHealthInsuranceList = (isAgentTypeTransfer) => {
  const { data } = useQuery({
    queryKey: [
      isAgentTypeTransfer
        ? CACHE_KEYS.HEALTH_IC_LIST
        : CACHE_KEYS.COMPOSITE_IC_LIST,
    ],
    queryFn: () => {
      return isAgentTypeTransfer
        ? httpClient("POST", URLs.GET_HEALTH_IC_LIST)
        : httpClient("POST", URLs.COMPOSITE_IC_LIST);
    },
  });

  return { data };
};

export const useGetGeneralList = (open) => {
  const { data } = useQuery({
    queryKey: [CACHE_KEYS.GENERAL_IC_LIST],
    queryFn: () => {
      return httpClient("POST", URLs.GET_GENERAL_IC_LIST);
    },
    enabled: open,
  });
  return { data };
};

export const useGetLifeList = (open) => {
  const { data } = useQuery({
    queryKey: [CACHE_KEYS.LIFE_IC_LIST],
    queryFn: () => {
      return httpClient("POST", URLs.GET_LIFE_IC_LIST);
    },
    enabled: open,
  });
  return { data };
};

export const usePrefillOCRData = () => {
  const { data, mutate, isPending } = useMutation({
    mutationFn: (payload) => {
      return httpClient("POST", URLs.PREFILL_OCR_DATA, payload, "formData");
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success("Data Fetched Successfully");
      } else {
        toast.error(response?.data?.error);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate, isPending };
};

export const useCkycData = (toggleIsDrawerOpen) => {
  const queryClient = useQueryClient();
  const { data, mutate, isPending, mutateAsync } = useMutation({
    mutationFn: (payload) => {
      return httpClient("POST", URLs.CKYC_DATA, payload, "formData");
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success("Data Fetched Successfully");
        queryClient.invalidateQueries([CACHE_KEYS.USER_DETAILS]);
        toggleIsDrawerOpen(false);
      } else {
        const errors = response?.data?.error || response?.data?.message;
        if (Array.isArray(errors)) {
          errors.forEach((each) => toast.error(each));
        } else {
          toast.error(errors);
        }
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data, mutate, isPending, mutateAsync };
};

export const useGetUserDocuments = (id) => {
  const { data, isPending } = useQuery({
    queryKey: [CACHE_KEYS.USER_DOCUMENT, id],
    queryFn: () => {
      return httpClient("GET", URLs.GET_USER_DOCUMENT + `?id=${id}`);
    },
    enabled: id ? true : false,
  });
  return { data: data?.data?.data, isPending };
};

export const useGetUserCertificate = (id) => {
  const { data, isPending } = useQuery({
    queryKey: [CACHE_KEYS.USER_CERTIFICATE],
    queryFn: () => {
      return httpClient("POST", URLs.GET_USER_CERTIFICATE, { id });
    },
  });
  return { data: data?.data, isPending };
};

export const usePOSExamQuestion = () => {
  const { data, mutate, isPending } = useMutation({
    mutationFn: (payload) => {
      return httpClient("POST", URLs.POS_EXAM_QUESTIONS, payload);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { data: data?.data?.return_data, mutate, isPending };
};

export const usePosExamSubmit = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: (payload) => {
      return httpClient("POST", URLs.POS_EXAM_SUBMIT, payload);
    },
    onSuccess: (response) => {
      if (response?.data?.status === 200) {
        toast.success(response?.data?.message);
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { mutate, isPending };
};

export const useGetBoardORUniversity = () => {
  const { mutate, data, isPending } = useMutation({
    mutationFn: (payload) => {
      return httpClient("POST", URLs.LIST_OF_BOARD_OR_UNIVERSITY, payload);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });
  return { mutate, data, isPending };
};

export const useBankDocumentUpload = ({ handleClose }) => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.UPLOAD_DOCUMENT, data, "formData");
    },
    onSuccess: (response) => {
      if (response?.data?.status) {
        toast.success(response?.data?.message);
        queryClient.invalidateQueries({
          queryKey: [CACHE_KEYS.USER_DETAILS],
          refetchType: "active",
        });
        handleClose?.();
      } else {
        toast.error(response?.data?.message);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  return { mutate, isPending };
};
export const useGenerateApplicationFormPDF = () => {
  const { mutate: generateApplication, isPending: generatePdfPending } =
    useMutation({
      mutationFn: (data) =>
        httpClient("POST", URLs.GENERATE_APPLICATION_FORM_PDF, {
          id: data?.id,
        }),
      onSuccess: (response) => {
        const { message, pdf_url } = response?.data || {};
        if (pdf_url) {
          window.open(pdf_url, "_blank");
          toast.success(message || "Application generated successfully");
        } else {
          toast.error(message || "Something went wrong");
        }
      },
      onError: (error) => {
        toast.error(error?.data?.message || error.message);
      },
    });
  return { generateApplication, generatePdfPending };
};

export const useFileUpload = () => {
  const fileUploadMutations = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.UPLOAD_DOCUMENT, data, "formData");
      
    },
    onSuccess: (response) => {
      if (response?.data?.status) {
        queryClientGlobal.invalidateQueries({
        queryKey:[CACHE_KEYS.USER_DOCUMENT],
         refetchType: "active",
      })
        toast.success(response?.data?.message);

      } else {
        toast.error(response?.data?.message);
      }
    },
  });

  return { fileUploadMutations };
};

export const useUpdateTaxPayerStatus = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: (data) => {
      return httpClient("POST", URLs.UPDATE_TAX_PAYER_STATUS, data, "formData");
    },
  });
  return { mutate, isPending };
};
