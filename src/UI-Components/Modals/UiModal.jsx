import { Dialog, DialogPanel } from "@headlessui/react";
import { X } from "lucide-react";
import UiButton from "../Buttons/UiButton.jsx";

const DefaultLoaderComponent = (
  <div className="flex items-center justify-center bg-lightGray animate-pulse w-full rounded h-72" />
);

const UiModalContainer = ({
  isOpen,
  isLoading,
  headSection,
  containerClass,
  children,
  disableCloseButton,
  handleCloseModal,
  z_index = "z-50",
  LoaderComponent = DefaultLoaderComponent,
}) => {
  return (
    <Dialog
      as="div"
      className="relative z-50 focus:outline-none"
      open={isOpen}
      onClose={handleCloseModal}
    >
      <div
        className={`fixed inset-0 ${z_index} w-screen overflow-y-auto bg-lightGray/60 backdrop-blur-sm`}
      />
      <div
        className={`fixed inset-0 ${z_index} w-screen bg-body/50 overflow-y-auto`}
      >
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel
            transition
            className={`relative bg-white rounded-lg px-6 py-6 flex flex-col gap-4 shadow-xl border-b-4 border-primary duration-100 ease-in data-[closed]:scale-50 data-[closed]:opacity-0  ${containerClass}`}
          >
            <section className="flex items-start justify-between gap-8">
              {headSection}
              {!disableCloseButton ? (
                <UiButton
                  className="text-subHeading absolute top-6 right-6 focus:ring-primary focus:bg-primary/30"
                  icon={<X className="size-5" />}
                  buttonType="tertiary"
                  onClick={handleCloseModal}
                  disabled={disableCloseButton}
                />
              ) : null}
            </section>
            {isLoading ? LoaderComponent : children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default UiModalContainer;
