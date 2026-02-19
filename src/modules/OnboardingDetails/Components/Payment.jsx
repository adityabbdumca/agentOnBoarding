import { httpClient } from "@/api/httpClient";
import InlineLoader from "@/Components/Loader/InlineLoader";
import { CACHE_KEYS } from "@/lib/ApiService/constants/CACHE_KEYS";
import { URLs } from "@/lib/ApiService/constants/URLS";
import Button from "@/UI-Components/Button"; // Your custom Button component
import UiButton from "@/UI-Components/Buttons/UiButton";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Download, X } from "lucide-react";
import moment from "moment";
import { useCallback, useState } from "react";
import { HiMiniCheckBadge } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { incrementAgent, setAgentName } from "../agent.slice";
import { useSendPaymentPayload, useSendPaymentResponse } from "../service";
import OfflinePayment from "./OfflinePayment";
import { toast } from "react-toastify";
import { DateTime } from "luxon";

const Payment = ({ handleSubmit, watch, setValue, id, userData }) => {
  const [isPaymentSuccessModalOpen, toggleIsPaymentSuccessModal] =
    useState(false);
  const [isPollingOpen, toggleIsPollingOpen] = useState(false);
  const transactionDate = userData?.payment?.transaction_date;
  const receiptNo = userData?.payment?.reference_number;
  const transactionId = userData?.payment?.transaction_no;

  const isPaymentCompleted = watch("payment_status");
  const [paymentMode, setPaymentMode] = useState("offline");
  const [openOfflinePaymentModal, setOpenOfflinePaymentModal] = useState(false);
  const {
    data,
    mutate: verifyPayment,
    mutateAsync,
    variables,
    isPending,
  } = useSendPaymentResponse(setPaymentMode, toggleIsPaymentSuccessModal);

  const initiatedPaymentResponseData = data?.data;
  const paymentGatewayOrderId =
    initiatedPaymentResponseData?.data?.paymentGatewayOrderId;

  const dispatch = useDispatch();
  const handleCloseModal = useCallback(() => {
    setOpenOfflinePaymentModal(false);
  }, []);
  const { data: offlinePaymentData, mutate: offlinePaymentMutate } =
    useSendPaymentPayload(handleCloseModal, toggleIsPaymentSuccessModal);

  const verticalId = localStorage.getItem("vertical_id");

  const { data: paymentStatusData } = useQuery({
    queryKey: [CACHE_KEYS?.PAYMENT_STATUS, paymentGatewayOrderId],
    queryFn: () => {
      return httpClient(
        "GET",
        `${URLs.PAYMENT_STATUS}/${paymentGatewayOrderId}`
      );
    },
    enabled: isPollingOpen && !!paymentGatewayOrderId,
    refetchInterval: (data) => {
      const paymentStatus = data?.state?.data?.data?.data?.payment_status;
      if (paymentStatus === "paid" || paymentStatus === "failed") {
        toggleIsPollingOpen(false);
        toggleIsPaymentSuccessModal(true);
        return false;
      }
      return 3000;
    },
    staleTime: 0,
    cacheTime: 0,
  });

  const paymentReceiptMutations = useMutation({
    mutationFn: (data) => httpClient("POST", URLs.PAYMENT_RECEIPT,data),
    onError: (error) => {
      toast.error(error?.response?.data?.message || error.message);
    },
  });

  const onSubmit = () => {
    verifyPayment({
      ...(id && { id }),
      source: "online",
    });
  };

  const handlePaymentShareLink = () => {
    mutateAsync({
      ...(id && { id }),
      source: "share",
    }).then((res) => {
      if (res?.data?.success) {
        toggleIsPollingOpen(true);
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative max-w-[380px] bg-white rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] p-6 my-5 mx-auto after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-4 after:bg-[length:80px_16px] after:bg-repeat-x after:content-[''] after:bg-[linear-gradient(-45deg,_white_12px,_transparent_0,_transparent_20px,_white_0,_white_32px,_transparent_0,_transparent_40px,_white_0,_white_52px,_transparent_0,_transparent_60px,_white_0,_white_72px,_transparent_0,_transparent_80px,_white_0)]">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            {!isPaymentCompleted ? (
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 10H23"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <HiMiniCheckBadge size={40} color="white" />
            )}
          </div>

          <h1 className="text-xl font-semibold text-center text-gray-800">
            {!isPaymentCompleted ? "Payment Confirmation" : "Payment Completed"}
          </h1>
          <p className="text-sm text-center text-gray-500 mt-2 mb-6">
            {!isPaymentCompleted
              ? "Please confirm the following transaction"
              : "Thank You for your Payment"}
          </p>
          <hr className="border-t border-gray-200 my-4" />

          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-800 font-semibold">Summary</p>
            {isPaymentCompleted && (
              <UiButton
                buttonType="tertiary"
                type="button"
                text="Payment Receipt"
                className="bg-green-600 p-2 text-sm text-white font-bold rounded-lg hover:scale-102"
                onClick={() => {
                  paymentReceiptMutations.mutateAsync({id:id}).then((res) => {
                    toast.success(res?.data?.message);
                    window.open(res?.data?.pdf_url);
                  });
                }}
                icon={<Download className="size-4" />}
                isLoading={paymentReceiptMutations.isPending}
              />
            )}
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-[13px] text-gray-600">Date:</span>
            <span className="text-xs font-medium text-gray-900">
              {transactionDate ||
                DateTime.now().toFormat("yyyy-MM-dd HH:mm:ss")}
            </span>
          </div>
          {isPaymentCompleted && (
            <>
              <div className="flex justify-between mb-1">
                <span className="text-[13px] text-gray-600">Receipt No:</span>
                <span className="text-xs font-medium text-gray-900">
                  {receiptNo || "N/A"}
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-[13px] text-gray-600">
                  Transaction Id:
                </span>
                <span className="text-xs font-medium text-gray-900">
                  {transactionId || "N/A"}
                </span>
              </div>
            </>
          )}

          <div className="flex justify-between mb-1">
            <span className="text-[13px] text-gray-600">Amount</span>
            <span className="text-xs font-medium text-gray-900">
              {/* data?.data?.amount / 100 || */}
              500
            </span>
          </div>

          <hr className="border-t border-gray-200 my-4" />

          <div className="flex justify-between mb-3">
            <span className="text-sm text-gray-600 font-bold">Total</span>
            <span className="text-sm font-medium text-primary">
              {/* data?.data?.amount / 100 || */}
              500
            </span>
          </div>

          <div className="bg-red-50 rounded-lg p-3 my-5 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
            <p className="text-xs text-gray-800 m-0">
              Refunds will not be issued once the payment is processed.
            </p>
          </div>

          {!isPaymentCompleted && (
            <div className="flex gap-4 justify-center">
              <UiButton
                text={"Make Payment"}
                type="submit"
                className="px-4 w-36"
                isLoading={isPending && variables?.source === "online"}
              />
              {["3"].includes(verticalId) && (
                <UiButton
                  text={"Share Payment Link"}
                  buttonType="secondary"
                  className="px-4 !w-44"
                  onClick={handlePaymentShareLink}
                  isLoading={isPending && variables?.source === "share"}
                />
              )}
            </div>
          )}
        </div>
        {!isPaymentCompleted && (
          <span className="text-sm text-slate-500 text-center block mt-4">
            Want to make an Offline Payment?
            <button
              type="button"
              className="ml-1 cursor-pointer underline underline-offset-4 font-semibold hover:scale-[1.05] text-primary hover:text-primary/80 transition-all duration-200"
              onClick={() => setOpenOfflinePaymentModal(true)}
            >
              Click Here
            </button>
          </span>
        )}
      </form>
      {isPaymentSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiMiniCheckBadge size={40} color="white" />
            </div>

            <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
              Thank You for Your Payment{" "}
              {paymentMode === "offline" ? "Request" : ""}!
            </h2>

            {paymentMode === "offline" ? (
              <>
                <p className="text-gray-600 mb-4 text-center">
                  Your payment request has been successfully submitted. Our team
                  will verify it shortly.
                </p>

                <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700 mb-4">
                  <span className="font-medium">Payment Mode:</span>
                  <span className="text-end capitalize">{paymentMode}</span>

                  <span className="font-medium">Amount:</span>
                  <span className="text-end">
                    {offlinePaymentData?.data?.data?.amount} Rs
                  </span>

                  <span className="font-medium">Date:</span>
                  <span className="text-end">
                    {moment(offlinePaymentData?.data?.data?.updated_at).format(
                      "DD-MM-YYYY HH:mm"
                    ) || "N/A"}
                  </span>
                </div>

                <span className="text-slate-600 w-full text-sm">
                  (You will receive a confirmation once verified.)
                </span>
              </>
            ) : (
              <>
                <p className="text-gray-600 mb-4 text-center">
                  Your payment has been successfully processed.
                </p>

                <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700 mb-4">
                  <span className="font-medium">Payment Mode:</span>
                  <span className="text-end capitalize">{paymentMode}</span>

                  <span className="font-medium">Amount:</span>
                  <span className="text-end">
                    {offlinePaymentData?.data?.data?.amount || "N/A"} Rs
                  </span>

                  <span className="font-medium">Transaction ID:</span>
                  <span className="text-end">
                    {offlinePaymentData?.data?.data?.transaction_id || "N/A"}
                  </span>

                  <span className="font-medium">Date:</span>
                  <span className="text-end">
                    {moment(offlinePaymentData?.data?.data?.updated_at).format(
                      "DD-MM-YYYY HH:mm"
                    ) || "N/A"}
                  </span>
                </div>
              </>
            )}

            <div className="mt-6 w-full">
              <Button
                type="button"
                width={"100%"}
                onClick={() => {
                  dispatch(incrementAgent());
                  if (
                    paymentMode === "online" &&
                    initiatedPaymentResponseData?.user_stage_name
                  ) {
                    dispatch(
                      setAgentName(initiatedPaymentResponseData.user_stage_name)
                    );
                  }
                  setValue("payment_status", true);
                  setOpenModal(false);

                  toggleIsPaymentSuccessModal(false);
                }}
              >
                Proceed
              </Button>
            </div>
          </div>
        </div>
      )}

      <GlobalModal
        open={openOfflinePaymentModal}
        onClose={() => setOpenOfflinePaymentModal(false)}
        title={"Offline Payment Details"}
        width={600}
        maxHeight={700}
      >
        <OfflinePayment offlinePaymentMutate={offlinePaymentMutate} id={id} />
      </GlobalModal>

      {isPollingOpen && (
        <div className="fixed inset-x-0 bottom-0 left-[45%] z-50 bg-lightGray h-44 rounded-t-sm shadow-2xl w-96  flex flex-col p-2 ">
          <UiButton
            icon={<X className="size-4" />}
            className="w-6 absolute right-2"
            buttonType="tertiary"
            onClick={() => {
              toggleIsPollingOpen(false);
            }}
          />
          <InlineLoader />

          <div className="flex flex-col items-center justify-center p-2 gap-4">
            <h3 className="text-sm font-medium text-center mb-2 text-wrap">
              We are confirming your payment from the bank..
            </h3>
            <span className="text-sm">Please Wait...</span>
            <span>(Do not Press Back Button)</span>
          </div>
        </div>
      )}
    </>
  );
};

export default Payment;
