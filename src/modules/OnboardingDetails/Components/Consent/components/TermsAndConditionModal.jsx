import UiButton from "@/UI-Components/Buttons/UiButton";
import UiModalContainer from "@/UI-Components/Modals/UiModal";
import { Info } from "lucide-react";
import TermsAndCondition from "./TermsAndCondition";
import UiCapsule from "@/UI-Components/Capsules/UiCapsule";
import { useState } from "react";

const TermsAndConditionModal = ({
  isOpen,
  handleClose,
  // setHasReviewedConditions,
  userData,
}) => {
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const isDeclarationCheck = userData?.declaration?.check;
  const isReviewCondition = userData?.declaration?.transcript_status;
  const agentId = userData?.profile.user_id;
  const isShowAgreeButton = isDeclarationCheck;
  return (
    <UiModalContainer
      isOpen={isOpen}
      handleCloseModal={handleClose}
      headSection={
        <div className="flex flex-col gap-2 border-b border-b-gray-400 py-4 w-full">
          <div className="flex gap-3 items-center flex-1">
            <UiButton
              buttonType="tertiary"
              icon={<Info className="size-4 text-gray-500" />}
              className="p-2 bg-gray-100"
            />

            <h2 className="text-base font-semibold text-primary !border-b-0 !mb-4">
              Terms and Conditions
            </h2>
            <div className="ml-6">
              <UiCapsule
                text="Reviewed"
                className="flex justify-start"
                color={isReviewCondition ? "#08CB00" : "#CBCBCB"}
              />
            </div>
          </div>
          {!hasScrolledToEnd && !isShowAgreeButton && (
            <p className="text-xs text-error text-left">
              Note scroll to the bottom to enable the "I Agree" button.
            </p>
          )}
        </div>
      }
      containerClass="w-[700px]">
      <TermsAndCondition
        agentId={agentId}
        handleClose={handleClose}
        isShowAgreeButton={isShowAgreeButton}
        hasScrolledToEnd={hasScrolledToEnd}
        setHasScrolledToEnd={setHasScrolledToEnd}
      />
    </UiModalContainer>
  );
};

export default TermsAndConditionModal;
