import { memo, useState } from "react";
import Header from "@/Components/Header/Header";
import AgentTypeModal from "./AgentTypeModal";
const MainContainer = ({
  children,
  userData,
  heading,
  subHeading,
  pageActions,
  setOpenOCRModal,
}) => {
  const [agentOpen, setAgentOpen] = useState(false);
  const isUserPaymentDone = userData?.data?.payment_status;
  
  return (
    <main className="relative w-full h-screen overflow-x-hidden bg-white rounded-l-lg">
      <>
        <Header setOpen={setAgentOpen} isUserPaymentDone={isUserPaymentDone} userData={userData} />
      </>

      <AgentTypeModal
        setOpenOCRModal={setOpenOCRModal}
        userData={userData}
        open={agentOpen}
        setOpen={setAgentOpen}
      />

      <div className="px-5 py-4 top-14 flex flex-col gap-4">
        {heading && (
          <section className="flex justify-between items-center">
            <div className="max-w-full md:max-w-1/2">
              <h2 className="text-base md:text-lg font-bold text-primary">{heading}</h2>
              <p className="mt-2 text-slate-600 text-sm">{subHeading}</p>
            </div>
            <div className="hidden md:flex items-center justify-end w-1/2  ">
              {pageActions}
            </div>
          </section>
        )}
        {children}
      </div>
    </main>
  );
};

export default memo(MainContainer);
