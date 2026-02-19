
import UiButton from "../Buttons/UiButton";
import UiModalContainer from "../Modals/UiModal";



const UiConfirmationModal = (options) => {
  const {
    isOpen,
    handleClose,
    headSection = "Delete",
    icon,
    subHeading = "",
    actionButtonIcon,
    actionButtonText,
    onActionButtonClick,
    className = "",
    isLoading,
    actionButtonClassName = "",
    onCancelAction,
    onCancelText = "Cancel",
  } = options;
  return (
    <UiModalContainer
      isOpen={isOpen}
      handleCloseModal={handleClose}
      headSection={<div></div>}
      containerClass={`!border-b-0`}
    >
      <div
        className={`flex flex-col gap-2  items-center w-[300px] ${className}`}
      >
        <div className="flex item-center w-full justify-center">{icon}</div>
        <h2 className="text-base font-semibold text-heading">{headSection}</h2>
        <h5 className="text-sm text-subHeading text-center">{subHeading}</h5>
        <section className="flex items-center gap-2 mt-4 w-full">
          <UiButton
            buttonType="secondary"
            text={onCancelText}
            className="w-full h-8"
            onClick={onCancelAction ? onCancelAction : handleClose}
          />
          <UiButton
            buttonType="tertiary"
            icon={actionButtonIcon}
            className={`w-full h-8 bg-error  text-white rounded flex hover:brightness-90 ring-1 ring-error/80 gap-2" 
              ${actionButtonClassName}`}
            text={actionButtonText}
            onClick={onActionButtonClick}
            isLoading={isLoading}
          />
        </section>
      </div>
    </UiModalContainer>
  );
};

export default UiConfirmationModal;
