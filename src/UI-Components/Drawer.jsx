import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import { HiArrowNarrowLeft } from "react-icons/hi";

export default function Drawer({ isOpen, onClose, children, width = "70%" }) {
  const hierarchy = new URLSearchParams(window.location.search).get(
    "use-hierarchy"
  );

  return (
    <Transition show={isOpen || hierarchy} as={Fragment}>
      <Dialog as="div" className="relative z-[999]" onClose={onClose}>
        {/* Overlay */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />
        </TransitionChild>

        {/* Panel Container */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 flex sm:justify-end justify-center sm:items-start items-end">
            <TransitionChild
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="translate-x-full sm:translate-y-0 sm:translate-x-full"
              enterTo="translate-x-0 sm:translate-x-0"
              leave="transform transition ease-in-out duration-200"
              leaveFrom="translate-x-0 sm:translate-x-0"
              leaveTo="translate-x-full sm:translate-x-full"
            >
              <DialogPanel
                className={`w-full sm:w-[var(--size)] bg-white h-[90%] sm:h-full sm:rounded-l-xl rounded-t-xl p-5 shadow-xl overflow-y-hidden relative`}
                style={{ "--size": hierarchy ? "100%" : width }}
              >
                {!hierarchy && (
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-2 text-sm font-semibold text-primary mb-4"
                  >
                    <HiArrowNarrowLeft className="h-4 w-4" />
                    Back to Page
                  </button>
                )}

                {/* Content */}
                <div className="text-sm text-gray-700">{children}</div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
