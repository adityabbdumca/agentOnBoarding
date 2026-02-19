import {
  allowOnlyNumbers,
  handleKeyUp,
} from "@/HelperFunctions/helperFunctions";
import Button from "@/UI-Components/Button";
import { StyledModal } from "@/UI-Components/GlobalStyles";
import Input from "@/UI-Components/Input";
import { checkOtpComplete } from "@/utlities/array.utlity";
import { Grid2 } from "@mui/material";
import { useEffect, useState } from "react";

const OTPModal = ({ register, watch, registerMutate, setFocus, setValue, isLoading=false }) => {
  const [timer, setTimer] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const [otpComplete, setOtpComplete] = useState(false);

  useEffect(() => {
    let timerOTP;
    let countdownInterval;

    if (timer) {
      setCountdown(10); // Reset countdown to 10

      // Create countdown interval
      countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      // Create timer to enable resend
      timerOTP = setTimeout(() => {
        setTimer(false);
      }, 10000);
    }

    return () => {
      clearTimeout(timerOTP);
      clearInterval(countdownInterval);
    };
  }, [timer]);

  useEffect(() => {
    setFocus("otp_code[0]");
  }, [setFocus]);

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutate({
      ...watch(),
      name: watch("name"),
      mobile: watch("mobile"),
      otp: watch("otp_code").join(""),
    });
  };

  return (
    <StyledModal>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-center space-y-1">
          <div id="otp" className="flex gap-4">
            {[...Array(6)].map((_, index) => (
              <Input
                key={index}
                Width={"40"}
                inputRef={register(`otp_code[${index}]`)}
                name={`otp_code[${index}]`}
                type={"password"}
                maxLength={1}
                onChange={(e) => {
                  allowOnlyNumbers(e);
                }}
                className="text-center"
                onKeyUp={(e) => {
                  handleKeyUp(e, index);
                  const currentOtp = watch("otp_code");
                  setOtpComplete(checkOtpComplete(currentOtp));
                }}
              />
            ))}
          </div>
        </div>
        {/* <Input
          name="modalEmailOtp"
          label="Enter Email OTP"
          placeholder="Enter OTP"
          inputRef={register("modalEmailOtp")}
          onChange={(e) => allowOnlyNumbers(e)}
          maxLength={6}
        /> */}
        <Grid2 container spacing={2} mt={2}>
          <Grid2 item size={{ lg: 6, md: 12, sm: 12 }}>
            <Button
              width={"100%"}
              type="button"
              variant={"outlined"}
              disabled={timer}
              onClick={() => {
                registerMutate({
                  name: watch("name"),
                  mobile: watch("mobile"),
                  email: watch("email"),
                });
                setTimer(true);
                for (let i = 0; i < 6; i++) {
                  setValue(`otp_code[${i}]`, "");
                }
              }}>
              {timer ? `Resend OTP in ${countdown}s` : "Resend OTP"}
            </Button>
          </Grid2>
          <Grid2 item size={{ lg: 6, md: 12, sm: 12 }}>
            <Button type="submit" width={"100%"} disabled={!otpComplete} isLoading={isLoading}>
              Verify OTP
            </Button>
          </Grid2>
        </Grid2>
      </form>
    </StyledModal>
  );
};

export default OTPModal;
