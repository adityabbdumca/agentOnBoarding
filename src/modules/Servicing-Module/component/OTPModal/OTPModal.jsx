import { allowOnlyNumbers } from "@/HelperFunctions/helperFunctions";
import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import { Button, GlobalModal, Input } from "@/UI-Components";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { showMobileAndEmailOtp } from "../../helper/FormHelper";

const OTPModal = ({
  isOpen,
  handleClose,
  postOtpVerifyMutation,
  agentId,
  setIsOTPVerified,
  handleOtpGenerate,
}) => {
  const { register, watch, setFocus, reset, handleSubmit } = useForm({
    defaultValues: {
      mobile_otp_code: "",
      email_otp_code: "",
    },
  });

  const { subRoute } = useGlobalRoutesHandler();

  const [timer, setTimer] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const showBothOtpOption = showMobileAndEmailOtp(subRoute);
  // Timer effect
  useEffect(() => {
    let timerOTP;
    let countdownInterval;

    if (timer && isOpen) {
      setCountdown(10);

      countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setTimer(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      timerOTP = setTimeout(() => {
        setTimer(false);
      }, 10000);
    }

    return () => {
      clearTimeout(timerOTP);
      clearInterval(countdownInterval);
    };
  }, [timer, isOpen]);

  // Focus management based on field type
  useEffect(() => {
    if (isOpen) {
      const focusTimer = setTimeout(() => {
        setFocus("mobile_otp_code");
      }, 100);
      return () => clearTimeout(focusTimer);
    }
  }, [isOpen, setFocus]);

  const handleOTPSubmit = (data) => {
    const payload = {
      agent_id: agentId?.id,
      endorsement_type_id: subRoute,
      mobile_otp: data?.mobile_otp_code,
      ...(showBothOtpOption && { email_otp: data?.email_otp_code }),
    };

    postOtpVerifyMutation.mutateAsync(payload).then((res) => {
      if (res?.data?.is_otp_verified_true) {
        setIsOTPVerified(res?.data?.is_otp_verified_true);
        reset();
        setTimer(true);
        setCountdown(10);
        handleClose();
      }
    });
  };

  const handleResendOTP = () => {
    handleOtpGenerate();
    setTimer(true);
    reset();
    setFocus("mobile_otp_code");
  };

  const mobileOtp = watch("mobile_otp_code") || "";
  const emailOtp = watch("email_otp_code") || "";

  const isOTPComplete = showBothOtpOption
    ? mobileOtp.length === 6 && emailOtp.length === 6
    : mobileOtp.length === 6;

  return (
    <GlobalModal
      open={isOpen}
      title={showBothOtpOption ? "Enter OTPs" : "Enter OTP"}
      onClose={() => {
        reset();
        handleClose?.();
      }}
      width="400">
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Verify OTP
          </h2>
          <p className="text-gray-600 text-sm">
            Enter the 6-digit codes sent to your mobile number and email address
          </p>
        </div>

        <form
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(handleOTPSubmit)}>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                Mobile OTP
              </label>
            </div>

            <Input
              inputRef={register("mobile_otp_code")}
              name="mobile_otp_code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              onChange={(e) => allowOnlyNumbers(e)}
              className="text-center w-full h-12 text-lg tracking-[0.3em] font-semibold border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              placeholder="000000"
              autoComplete="off"
            />
          </div>
          {showBothOtpOption && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  Email OTP
                </label>
              </div>

              <Input
                inputRef={register("email_otp_code")}
                name="email_otp_code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                onChange={(e) => allowOnlyNumbers(e)}
                className="text-center w-full h-12 text-lg tracking-[0.3em] font-semibold border-2 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="000000"
                autoComplete="off"
              />
            </div>
          )}
          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 pt-2">
            <Button
              type="submit"
              width="100%"
              disabled={!isOTPComplete || postOtpVerifyMutation.isPending}
              loading={postOtpVerifyMutation.isPending}
              className="h-12 text-base font-medium bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300">
              {postOtpVerifyMutation.isPending
                ? "Verifying..."
                : "Verify & Continue"}
            </Button>

            <div className="flex items-center justify-center space-x-4">
              <span className="text-sm text-gray-500">
                Did not receive OTP?
              </span>
              <Button
                type="button"
                variant="outlined"
                disabled={timer}
                onClick={handleResendOTP}
                className="text-sm px-4 py-2 border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-600 disabled:opacity-50">
                {timer ? `Resend in ${countdown}s` : "Resend OTP"}
              </Button>
            </div>
          </div>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              {showBothOtpOption ? "Both" : ""} OTP codes must be entered to
              proceed
            </p>
          </div>
        </form>
      </div>
    </GlobalModal>
  );
};

export default OTPModal;
