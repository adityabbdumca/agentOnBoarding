import UiButton from "@/UI-Components/Buttons/UiButton";
import UiTabs from "@/UI-Components/Tabs/UiTabs";
import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import { ArrowLeft } from "lucide-react";
import { Outlet } from "react-router";
import AuthCard from "./component/AuthCard";
import { BASE_TABS } from "./servicingModule.constant";

const ServicingModule = ({ isHeader = true }) => {
  const { navigate } = useGlobalRoutesHandler();
  const verticalId = parseInt(localStorage.getItem("vertical_id"), 10);

  // const TABS =
  //   verticalId === 1 || verticalId === 2
  //     ? BASE_TABS.filter((tab) => tab.name === "Status Tracking")
  //     : BASE_TABS;

  return (
    <div className="relative w-full h-screen overflow-x-hidden bg-white rounded-l-lg">
      {isHeader && (
        <>
          {verticalId === 4 && (
            <UiButton
              buttonType="tertiary"
              text="Back To Certificate"
              className="flex-row-reverse gap-4 text-sm hover:bg-lightGray/40 p-2 ml-2 mt-2"
              icon={
                <ArrowLeft className="size-4 text-black flex flex-row-reverse" />
              }
              onClick={() => {
                navigate("/agent");
              }}
            />
          )}
          <div className="bg-white border-b border-gray-200">
            <div className="flex items-center justify-between px-6 py-2">
              <section className="flex flex-col items-start">
                <h1 className="text-xl font-semibold text-gray-900">
                  Servicing Module
                </h1>
                <p className="text-sm text-gray-600">
                  Agent Profile Management Portal
                </p>
              </section>
              <AuthCard />
            </div>
          </div>
        </>
      )}

      <UiTabs
        containerClass="w-full border-none gap-4 bg-extraLightGray/30 px-6"
        layoutId="activityTab"
        className="h-12"
        tabList={BASE_TABS || []}
      />

      <div className="px-6 py-4 h-[calc(100vh-100px)] overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ServicingModule;
