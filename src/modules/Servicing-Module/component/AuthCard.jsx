import { useLogOutUser } from "@/Components/SideBar/Service";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { Calendar } from "lucide-react";
import { Fragment } from "react";
import { HiChevronUpDown } from "react-icons/hi2";
import { IoLogOutOutline } from "react-icons/io5";

const AuthCard = () => {
  const { mutate: mutateLogout } = useLogOutUser();
  const nameInitial = JSON.parse(localStorage.getItem("user"))?.name?.[0];
  const name = JSON.parse(localStorage.getItem("user"))?.name || "User";
  const agentType =
    JSON.parse(localStorage.getItem("agentType"))?.label || "N/A";
  const applicationNo = localStorage.getItem("application_no");

  const settings = [
    {
      label: "Log Out",
      icon: <IoLogOutOutline size={16} className="text-red-600" />,
      onClick: mutateLogout,
    },
  ];
  const last_login = localStorage.getItem("last_login_date");
  return (
    <div className="flex flex-col items-end gap-0.5">
      <div>
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
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute right-0 mt-2 w-44 origin-top-right bg-white divide-y divide-gray-200 rounded-md shadow-lg shadow-primary/10 focus:outline-none z-50 ring-1 ring-gray-200">
              {location.pathname === "/agent" && (
                <div className="px-4 py-2 text-xs text-gray-700 font-medium">
                  <p className="text-gray-500 text-xxs font-semibold mb-1">
                    Application No:
                  </p>
                  <p className="text-xs font-semibold">{applicationNo}</p>
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
                        } flex items-center w-full px-4 py-2 text-xs text-left font-semibold text-gray-700 gap-2`}
                      >
                        {setting?.icon}
                        {setting?.label}
                      </button>
                    )}
                  </MenuItem>
                ))}
              </div>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
      <div className="flex  gap-1 text-xs text-gray-400 mt-1">
        <Calendar className="h-3 w-3" />
        Last login: {last_login}
      </div>
    </div>
  );
};

export default AuthCard;
