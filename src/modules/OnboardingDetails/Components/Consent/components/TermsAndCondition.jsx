import InlineLoader from "@/Components/Loader/InlineLoader";
import UiButton from "@/UI-Components/Buttons/UiButton";
import { useEffect, useRef } from "react";
import useConsent from "../hooks/useConsent";

const TermsAndCondition = ({
  isShowAgreeButton,
  hasScrolledToEnd,
  setHasScrolledToEnd,
  handleClose,
  agentId,
}) => {
  const contentRef = useRef(null);
  const {
    mutations: { agreeTermAndConditionMutation },
    function: { getConsentTermAndCondition },
  } = useConsent({ handleClose, agentId });
  useEffect(() => {
    const div = contentRef.current;
    if (!div) return;

    const handleScroll = () => {
      const isAtBottom =
        div.scrollTop + div.clientHeight >= div.scrollHeight - 10; // small buffer
      if (isAtBottom) setHasScrolledToEnd(true);
    };

    div.addEventListener("scroll", handleScroll);
    return () => div.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col gap-4 px-2 rounded">
      <div
        ref={contentRef}
        className="flex flex-col gap-2 max-h-90 overflow-y-auto py-2 ">
        {getConsentTermAndCondition?.isPending ? (
          <InlineLoader />
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: getConsentTermAndCondition?.data?.data,
            }}
          />
        )}

        <div className="p-2 space-y-6 text-gray-800"></div>
      </div>

      {!isShowAgreeButton && hasScrolledToEnd && (
        <div className=" ml-auto">
          <UiButton
            text="I Agree"
            buttonType="primary"
            className="w-24"
            onClick={() => {
              agreeTermAndConditionMutation.mutate({
                id: agentId,
                transcript_status: true,
              });
            }}
            isLoading={agreeTermAndConditionMutation?.isPending}
          />
        </div>
      )}
    </div>
  );
};

export default TermsAndCondition;
