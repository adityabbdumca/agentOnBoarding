import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Fragment } from "react";
import {
  HiHome,
  HiMenu,
  HiOutlineChevronRight,
  HiOutlineSwitchHorizontal,
} from "react-icons/hi";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { useLogOutUser } from "@/Components/SideBar/Service";
import { setSidebarOpen } from "@/Components/SideBar/sidebar.slice";
import { HiChevronUpDown } from "react-icons/hi2";
import UiCapsule from "@/UI-Components/Capsules/UiCapsule";
import { APP_NAME } from "@/config/env";

const HeaderMobileView = ({ setOpen, isUserPaymentDone, userData }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { mutate: mutateLogout } = useLogOutUser();

  const nameInitial = JSON.parse(localStorage.getItem("user"))?.name?.[0];
  const name = JSON.parse(localStorage.getItem("user"))?.name || "User";
  const vertical_id = localStorage.getItem("vertical_id");
  const agentType =
    JSON.parse(localStorage.getItem("agentType"))?.label || "N/A";
  const isDeclarationDone = userData?.declaration?.check;
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

  return (
    <div className="flex flex-col gap-1">
      <header className="w-full px-2 py-2 flex justify-between items-center sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center w-full md:p-2 gap-2 text-slate-600">
          <HiHome size={16} className="" />
          <HiOutlineChevronRight size={12} className="shrink-0" />
          <div className="flex gap-2">
            <p className="flex items-center gap-2 text-sm text-primary font-semibold tracking-wider">
              {APP_NAME}{" "}
            </p>
          </div>
        </div>

        {/* {location.pathname !== "/agent" && (
        <button
          type="button"
          className="sm:hidden flex items-center gap-2 text-xs text-slate-600 bg-slate-200 rounded-lg p-2 font-medium"
          onClick={() => history.state.idx > 0 && navigate(-1)}>
          <HiArrowLeftCircle size={20} />
        </button>
      )}

      {location.pathname !== "/agent" && (
        <button
          type="button"
          className="sm:hidden flex items-center gap-2 text-xs text-slate-600 bg-slate-200 rounded-lg p-2"
          onClick={() => dispatch(setSidebarOpen(true))}>
          <HiMenu size={20} />
        </button>
      )} */}

        <Menu as="div" className="relative">
          <MenuButton className="flex items-center bg-gray-100 rounded-lg px-3 py-1 h-10 cursor-pointer">
            <span className="bg-white text-black font-semibold rounded-full w-7 h-7 flex items-center justify-center text-sm mr-2">
              {nameInitial}
            </span>
            <HiChevronUpDown />
          </MenuButton>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <MenuItems className="absolute right-0 mt-2 w-44 origin-top-right bg-white rounded-md shadow-lg focus:outline-none z-50 ring-1 ring-gray-200">
              <div className="px-4 py-3">
                <p className="font-semibold text-sm">{name}</p>
                <p className="text-xs text-gray-500">{agentType}</p>
              </div>

              <div className="py-1">
                {settings.map((setting) => (
                  <MenuItem key={setting.label}>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={setting.onClick}
                        className={`${active ? "bg-gray-100" : ""} w-full flex items-center gap-2 px-4 py-2 text-xs`}>
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
      </header>
      {vertical_id === "4" && isDeclarationDone && (
        <div className="flex justify-end">
          <UiCapsule text={userData?.user_application_status} color="#73AF6F" />
        </div>
      )}
    </div>
  );
};

export default HeaderMobileView;
