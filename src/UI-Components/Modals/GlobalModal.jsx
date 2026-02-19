import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { X } from "lucide-react";
import { Fragment } from "react";
import UiButton from "../Buttons/UiButton";

const GlobalModal = ({
  open,
  onClose,
  title,
  width = 1000,
  maxHeight = 550,
  overflowVisible,
  overflowHidden,
  children,
  Margin,
  FooterContent,
  showFooter,
  description,
  showESC = true,
}) => {
  return (
    <Transition appear show={open} as={Fragment} key={open}>
      {open && (
        <Dialog as="div" className="relative z-50" onClose={() => {}}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0  bg-opacity-50 bg-black/60  backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div
              className={`flex min-h-full items-center justify-center p-4 ${
                Margin ? `m-[${Margin}px]` : ""
              }`}
            >
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel
                  className={`
                  w-full max-w-[90%] 
                  transform overflow-hidden 
                  rounded-lg bg-white p-0 text-left align-middle 
                  shadow-xl transition-all
                  ${
                    overflowVisible
                      ? "overflow-visible"
                      : overflowHidden
                        ? "overflow-hidden"
                        : "overflow-auto"
                  }
                `}
                  style={{
                    maxWidth: width ? `${width}px` : "500px",
                    maxHeight: maxHeight ? `${maxHeight}px` : "550px",
                  }}
                >
                  <div className="sticky top-0 z-10 rounded-t-lg flex items-center justify-between border-b border-gray-300 bg-white px-6 py-4">
                    <section className="flex flex-col gap-1">
                      <DialogTitle
                        as="h3"
                        className="text-lg font-semibold leading-6 text-primary"
                      >
                        {title}
                      </DialogTitle>
                      {description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {description}
                        </p>
                      )}
                    </section>
                    {showESC && (
                      <UiButton
                        buttonType="tertiary"
                        className="px-2"
                        icon={<X className="size-5 text-red-500" />}
                        onClick={onClose}
                      />
                    )}
                  </div>

                  <div className="relative ">{children}</div>

                  {showFooter && FooterContent && (
                    <div className="flex justify-end border-t border-gray-300 bg-white">
                      {FooterContent}
                    </div>
                  )}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      )}
    </Transition>
  );
};

export default GlobalModal;
