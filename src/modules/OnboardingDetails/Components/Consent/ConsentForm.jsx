import {
  allowOnlyNumbers,
  handleKeyUp,
} from "@/HelperFunctions/helperFunctions";
import Button from "@/UI-Components/Button";
import UiButton from "@/UI-Components/Buttons/UiButton";
import UiCapsule from "@/UI-Components/Capsules/UiCapsule";
import { StyledModal } from "@/UI-Components/GlobalStyles";
import Input from "@/UI-Components/Input";
import GlobalModal from "@/UI-Components/Modals/GlobalModal";
import { useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import {
  HiArrowNarrowLeft,
  HiArrowNarrowRight,
  HiOutlineRefresh,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { decrementAgent, incrementAgent } from "../../agent.slice";
import {
  useDeclareOTP,
  useDeclarePDF,
  useDocumentFinalApproval,
  useGenerateApplicationFormPDF,
} from "../../service";
import ShowAllSummary from "./ShowAllSummary";
import TermsAndConditionModal from "./components/TermsAndConditionModal";

const ConsentForm = ({
  register,
  watch,
  id,
  setValue,
  setFocus,
  handleSubmit,
  showSubmitButton,
  errors,
  userData,
}) => {
  const lessthan576 = useMediaQuery("(max-width: 576px)");
  const [isReviewed, setIsReviewed] = useState(false);
  const [open, setOpen] = useState(false);
  const [hasReviewedConditions, setHasReviewedConditions] = useState(false);
  const allFormData = watch();

  const { agent } = useSelector((state) => state.agent);
  //
  const dispatch = useDispatch();

  const [timer, setTimer] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isViewConditionModalOpen, toggleIsViewConditionModal] =
    useState(false);

  const { mutate: declareOTP, isPending: isPendingOTP } = useDeclareOTP();
  const { mutate: declarePDF } = useDeclarePDF();
  const { mutate, isPending } = useDocumentFinalApproval();
  const { generateApplication, generatePdfPending } =
    useGenerateApplicationFormPDF();
  const isReviewCondition = userData?.declaration?.transcript_status;
  const onSubmit = () => {
    
    if (!isReviewCondition && !watch("declaration.declaration_pdf")) {
      toast.error("Please review all data before proceeding");
      return;
    }
    // if (!watch("declaration.check")) {
    //   return;
    // }
    if (watch("approval_access") && id) {
      mutate({
        id: id,
      });
      
      return;
    }
    if (watch("declaration.declaration_pdf")) {
      watch("payment_status") && dispatch(incrementAgent());
      dispatch(incrementAgent());
      return;
    }
    setOpen(true);
    declareOTP({id:id});
  };
  const handleCheck = (e) => {
    if (!isReviewCondition && !watch("declaration.declaration_pdf")) {
      toast.error("Please View Terms & Conditions before proceeding");
      return;
    }
    setIsReviewed(e.target.checked);
    // setHasReviewedConditions(e.target.checked);
  };

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
    if (open) {
      setTimeout(() => {
        setFocus("otp_code[0]");
      }, 100);
    }
  }, [open]);

  useEffect(() => {
    const isChecked = watch("declaration.check");
    if (isChecked) {
      setIsReviewed(isChecked);
    }
  }, []);

  return (
    <div className="w-full flex flex-col justify-center gap-2">
      <ShowAllSummary
        userData={userData}
        handleDownload={() => {
          generateApplication({ id: +id });
        }}
        generatePdfPending={generatePdfPending}
      />
      <div className="p-4 gap-4 rounded-lg shadow-sm w-full mx-auto bg-offWhite flex items-center justify-between border border-lightGray">
        <div className="flex items-center gap-2">
          <div className="flex flex-col gap-3">
            <section className="flex gap-2">
              <h2 className=" font-semibold text-sm md:text-base lg:text-base">Terms & Conditions</h2>
              {isReviewCondition && (
                <UiCapsule
                  text="Reviewed"
                  icon={"CircleCheck"}
                  color="#08CB00"
                  className=""
                />
              )}
            </section>

            <span className="text-xs text-gray-500">
              Review our terms and conditions before accepting the proposal
            </span>
          </div>
        </div>
        <div className="">
          <UiButton
            buttonType="tertiary"
            text={"View Terms"}
            onClick={() => {
              toggleIsViewConditionModal(true);
            }}
            className="py-2 px-4 bg-gray-200 transform transition-transform duration-300 hover:scale-1.5"
          />
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="px-4 py-6 rounded-lg shadow-sm mx-auto bg-offWhite flex items-center justify-between border border-lightGray">
          <>
            <label className="flex items-center  gap-2 text-xs font-medium text-slate-700">
              <input
                id="summary"
                type="checkbox"
                checked={isReviewed}
                onChange={(e) => {
                  handleCheck(e);
                }}
                disabled={watch("declaration.check")}
                className="border"
              />
              By Submitting this application, I confirm my agreement to this
              term. I here by declare that the above statement are true and
              correct.
            </label>
          </>
        </div>
        <div className="mt-6 flex items-center justify-between gap-2 mx-auto">
          {agent > 0 && (
            <Button
              startIcon={<HiArrowNarrowLeft size={15} />}
              variant="outlined"
              width="auto"
              onClick={() => dispatch(decrementAgent())}>
              Back
            </Button>
          )}

          {showSubmitButton && (
            <Button
              type="submit"
              width="auto"
              disabled={isReviewed === false}
              endIcon={
                isPending || isPendingOTP ? (
                  <HiOutlineRefresh className="animate-spin" size={15} />
                ) : (
                  <HiArrowNarrowRight size={15} />
                )
              }>
              {watch("approval_access") ? "Next" : "Submit"}
            </Button>
          )}
        </div>
      </form>
      <GlobalModal
        open={open}
        onClose={() => {
          setOpen(false);
          setValue("otp_code", Array(6).fill(""));
        }}
        width={"400"}
        title={"Verify OTP"}>
        <StyledModal>
          {/* <form> */}
          <div className="flex items-center justify-center space-y-1">
            <div id="otp" className="flex gap-4">
              {[...Array(6)].map((_, index) => (
                <Input
                  key={_}
                  Width={"40"}
                  inputRef={register(`otp_code[${index}]`)}
                  name={"otp"}
                  type={"password"}
                  maxLength={1}
                  onChange={(e) => {
                    allowOnlyNumbers(e);
                  }}
                  className="text-center"
                  minHeight={"0"}
                  onKeyUp={(e) => handleKeyUp(e, index)}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-4 justify-center mt-4">
            <Button
              type="button"
              variant={"outlined"}
              width={"100%"}
              disabled={timer}
              onClick={() => {
                declareOTP();
                setTimer(true);
                setValue("modalNumberOtp", "");
              }}>
              {timer ? `Resend OTP in ${countdown}s` : "Resend OTP"}
            </Button>
            <Button
              width={"100%"}
              type="button"
              onClick={() => [
                declarePDF({
                  id: +id,
                  otp_code: watch("otp_code").join(""),
                }),
              ]}>
              Verify OTP
            </Button>
          </div>
          {/* </form> */}
        </StyledModal>
      </GlobalModal>
      <TermsAndConditionModal
        isOpen={isViewConditionModalOpen}
        handleClose={() => {
          toggleIsViewConditionModal(false);
        }}
       // setHasReviewedConditions={setHasReviewedConditions}
        userData={userData}
      />
    </div>
  );
};

export default ConsentForm;
