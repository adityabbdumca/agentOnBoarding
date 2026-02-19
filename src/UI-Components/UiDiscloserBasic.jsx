import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "lucide-react";
import { AnimatePresence } from "motion/react";
import { Fragment } from "react/jsx-runtime";
import * as motion from "motion/react-client";
import { easeOut } from "motion";

function UiDiscloserBasic({
  isLoading,
  containerClass,
  className,
  titleElement,
  children,
  disable = false,
  defaultOpen = true,
}) {
  if (isLoading) {
    return (
      <section className={containerClass}>
        <div className="h-24 bg-offWhite rounded " />
      </section>
    );
  }
  return (
    <Disclosure as="div" className={containerClass} defaultOpen={defaultOpen}>
      {({ open }) => {
        return (
          <>
            <DisclosureButton
              disabled={disable}
              className={`group flex w-full items-center justify-between ${className}`}
            >
              {titleElement}
              {!disable && (
                <ChevronDownIcon className="size-5  group-data-[open]:rotate-180 duration-300" />
              )}
            </DisclosureButton>
            <AnimatePresence>
              {open && (
                <DisclosurePanel static as={Fragment}>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: easeOut }}
                    className="origin-top"
                  >
                    {children}
                  </motion.div>
                </DisclosurePanel>
              )}
            </AnimatePresence>
          </>
        );
      }}
    </Disclosure>
  );
}
export default UiDiscloserBasic;
