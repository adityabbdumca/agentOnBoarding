import { useDevices } from "@/hooks/useDevices";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Calendar } from "lucide-react";
import { Fragment } from "react";
import {
  HiHome,
  HiMenu,
  HiOutlineChevronRight,
  HiOutlineSwitchHorizontal,
} from "react-icons/hi";
import { HiArrowLeftCircle, HiChevronUpDown } from "react-icons/hi2";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { useLogOutUser } from "../SideBar/Service";
import HeaderMobileView from "./components/HeaderMobileView";
import UiCapsule from "@/UI-Components/Capsules/UiCapsule";
import { APP_NAME } from "@/config/env";

const Header = ({ setOpen, isUserPaymentDone, userData }) => {
  const navigate = useNavigate();
  const { mutate: mutateLogout } = useLogOutUser();
  const nameInitial = JSON.parse(localStorage.getItem("user"))?.name?.[0];
  const name = JSON.parse(localStorage.getItem("user"))?.name || "User";
  const agentType =
    JSON.parse(localStorage.getItem("agentType"))?.label || "N/A";
  const showTranslate = location.pathname.includes("Agent");
  const { isLargeMobile, isMobile } = useDevices();
  const dispatch = useDispatch();

  const settings = [
    ...(location.pathname === "/agent" && isUserPaymentDone
      ? [
          {
            label: "Change Agent Type",
            icon: <HiOutlineSwitchHorizontal size={16} />,
            onClick: () => setOpen(true),
          },
        ]
      : []),
    {
      label: "Log Out",
      icon: <IoLogOutOutline size={16} className="text-red-600" />,
      onClick: mutateLogout,
    },
  ];
  const vertical_id = localStorage.getItem("vertical_id");
  const last_login = localStorage.getItem("last_login_date");
  const isDeclarationDone = userData?.declaration?.check;
  // For MobileView //
  if (isMobile) {
    return (
      <HeaderMobileView
        setOpen={setOpen}
        isUserPaymentDone={isUserPaymentDone}
        userData={userData}
      />
    );
  }
  //For DeskTopView //
  return (
    <header className="w-full h-18 px-5 py-3 flex justify-between items-center sticky top-0 bg-white border-b border-gray-200 z-10">
      {location.pathname !== "/agent" ? (
        <>
          <button
            type="button"
            className="max-sm:hidden flex items-center gap-2 text-xs text-slate-800 bg-slate-200 rounded-lg p-2 font-semibold cursor-pointer"
            onClick={() => history.state.idx > 0 && navigate(-1)}>
            <HiArrowLeftCircle size={20} />
            Go Back
          </button>
          <button
            type="button"
            className="sm:hidden flex items-center gap-2 text-xs text-slate-600 bg-slate-200 rounded-lg p-2 font-medium cursor-pointer"
            onClick={() => dispatch(setSidebarOpen(true))}>
            <HiMenu size={20} />
          </button>
        </>
      ) : (
        <div className="flex items-center  w-full p-2 gap-2 text-slate-600">
          <HiHome size={16} /> <HiOutlineChevronRight size={12} />
          <p className="flex items-center gap-2 text-sm text-primary font-semibold tracking-wider ">
            {APP_NAME}
          </p>
        </div>
      )}

      {vertical_id === "4" && isDeclarationDone && (
        <UiCapsule
          text={`Application Status: ${userData?.user_application_status}`}
          color="#08CB00"
          className="text-sm"
        />
      )}

      <div className="flex flex-col items-end gap-0.5 w-1/2">
        <div className="flex items-center gap-4 ">
          {showTranslate && <div id="google_translate_element" />}

          <Menu as="div" className="relative">
            <MenuButton className="flex items-center bg-gray-100 rounded-lg px-3 py-1 h-10 cursor-pointer focus:outline-none ">
              <span className="bg-white text-black font-semibold rounded-full w-7 h-7 flex items-center justify-center text-sm mr-2">
                {nameInitial}
              </span>
              <div className="flex flex-col text-left mr-2 text-sm capitalize">
                <span className="text-sm font-semibold text-ellipsis overflow-hidden whitespace-nowrap max-w-36">
                  {name}
                </span>
                <span className="text-xxs text-gray-500">{agentType}</span>
              </div>
              <HiChevronUpDown />
            </MenuButton>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95">
              <MenuItems className="absolute right-0 mt-2 w-44 origin-top-right bg-white divide-y divide-gray-200 rounded-md shadow-lg shadow-primary/10 focus:outline-none z-50 ring-1 ring-gray-200">
                {location.pathname === "/agent" && (
                  <div className="px-4 py-2 text-xs text-gray-700 font-medium">
                    <p className="text-gray-500 text-xxs font-semibold mb-1">
                      Application No:
                    </p>
                    <p className="text-xs font-semibold">
                      {userData?.application_number || "N/A"}
                    </p>
                  </div>
                )}
                <div className="py-1">
                  {settings.map((setting) => (
                    <MenuItem key={setting.label}>
                      {({ active }) => (
                        <button
                          type="button"
                          onClick={() => setting.onClick()}
                          className={`${
                            active ? "bg-gray-100" : ""
                          } flex items-center w-full px-4 py-2 text-xs text-left font-semibold text-gray-700 gap-2`}>
                          {setting.icon}
                          {setting.label}
                        </button>
                      )}
                    </MenuItem>
                  ))}
                </div>
              </MenuItems>
            </Transition>
          </Menu>
        </div>
        {last_login && (
          <div className="flex  gap-1 text-xs text-gray-400 mt-1">
            <Calendar className="h-3 w-3" />
            Last login: {last_login}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
