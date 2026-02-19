import { useState, useEffect, Suspense } from "react";
import logo from "@/assets/images/Prud_Logo.png";
import { Outlet } from "react-router";
import AgentMainSideBar from "./AgentMainSideBar";
import BrokerIcon from "@/assets/images/Prud_favicon.svg";
import { HiChevronLeft } from "react-icons/hi";
import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import PrudentialLoader from "../Loader/PrudentialLoader";

const AgentSideBar = () => {
  const { location } = useGlobalRoutesHandler();
  const [open, setOpen] = useState(true);
  const [lessthan768, setLessthan768] = useState(window.innerWidth <= 768);
  const isAgentRoot = location.pathname === "/agent";

  useEffect(() => {
    const handleResize = () => setLessthan768(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (lessthan768) return <Outlet />;

  return (
    <div className="flex h-screen">
      {isAgentRoot && (
        <aside className="flex  bg-[#eff3f6] min-h-screen">
          <div
            className={`!flex !flex-col !gap-4 relative transition-all duration-200 ease-in-out bg-[#eff3f6] p-5 pt-5 ${
              open ? "w-60" : "w-24"
            } h-screen rounded-l-[20px] hidden md:block`}
          >
            <div className="flex items-center justify-center w-full h-16  border-b-gray-100">
              <img
                src={open ? logo : BrokerIcon}
                data-open={open}
                className={`w-10 data-[open=true]:w-30 mix-blend-darken`}
                alt="logo"
              />
            </div>
            <div
              onClick={() => setOpen(!open)}
              className={`absolute top-[48px] right-[-14px] w-[30px] h-[29px] flex items-center justify-center bg-white border border-gray-400 rounded-md cursor-pointer transition-transform duration-500 z-20 ${
                !open ? "rotate-[-180deg]" : "rotate-0"
              }`}
            >
              <HiChevronLeft size={16} className="text-slate-600" />
            </div>

            <AgentMainSideBar />
          </div>
        </aside>
      )}
      <div className="flex-grow overflow-x-hidden">
        <Suspense fallback={<PrudentialLoader />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  );
};

export default AgentSideBar;
