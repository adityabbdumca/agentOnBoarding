import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import UiButton from "../Buttons/UiButton";
import { ArrowLeft } from "lucide-react";

function UiDrawerWrapper({
  HeadSection,
  isOpen,
  isLoading,
  z_index = "z-50",
  containerClass,
  children,
  LoaderComponent = (
    <div className="h-56 bg-lightGray rounded-lg animate-pulse" />
  ),
  handleClose = () => {},
  BackButtonComponent = false,
}) {
  return (
    <Transition as={Fragment} appear show={isOpen}>
      <Dialog as="div" onClose={handleClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out transform duration-300"
          enterFrom="opacity-0 "
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className={`fixed inset-0 ${z_index} bg-body/50 backdrop-blur-sm`}
          />
        </TransitionChild>

        {isOpen && (
          <DialogPanel
            transition
            className={`fixed top-1 ${z_index} right-1 h-[calc(100vh-10px)] bg-white px-4 py-6 rounded shadow-xl flex flex-col  ${containerClass} data-[enter]:translate-x-20 data-[enter]:opacity-0 transition-all duration-200 ease-in-out`}
          >
            {BackButtonComponent ? (
              <div className="w-full justify-start">
                <UiButton
                  text={"Back"}
                  type="button"
                  buttonType="secondary"
                  onClick={handleClose}
                  icon={<ArrowLeft className="size-5" />}
                  isLoading={false}
                  disabled={false}
                  className="flex-row-reverse px-5 text-red-600 hover:bg-primary hover:text-white"
                />
              </div>
            ) : (
              <></>
            )}
            {HeadSection}
            {isLoading ? LoaderComponent : children}
          </DialogPanel>
        )}
      </Dialog>
    </Transition>
  );
}

export default UiDrawerWrapper;
