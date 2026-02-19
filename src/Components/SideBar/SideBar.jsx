import { Tooltip, useMediaQuery } from "@mui/material";
import { Suspense, useEffect, useState } from "react";
import logo from "@/assets/images/Prud_Logo.png";
import { Outlet, useNavigate } from "react-router";
import { useGetAdminMenu } from "@/modules/Access-Control/Service";
import BrokerIcon from "@/assets/images/Prud_favicon.svg";
import { useDispatch, useSelector } from "react-redux";
import { setSidebarOpen } from "./sidebar.slice";
import { IoIosArrowUp } from "react-icons/io";
import ScreenLoader from "../Loader/ScreenLoader";
import { HiChevronLeft } from "react-icons/hi";
import { SIDE_MENU, sideBarIcons } from "./sidebar.constant";
const SideBar = () => {
  const { open } = useSelector((state) => state.sideBar);

  const [open2, setOpen2] = useState([]);

  const dispatch = useDispatch();

  const navigate = useNavigate();
  const { data } = useGetAdminMenu();
  const isAdmin = +localStorage.getItem("isAdmin");

  useEffect(() => {
    !isAdmin && navigate("/agent");
  }, []);
  const menuFromApi = data?.data?.menus?.map((item) => item.slug);

  const lessthan576 = useMediaQuery("(max-width: 576px)") || undefined;

  return (
    <div className="flex items-center justify-start bg-[#eff3f6] relative">
      <div
        className={`h-screen left-0  flex flex-col gap-8 py-4 px-4 bg-offWhite/70 border-r border-extraLightGray z-50 max-md:data-[open=false]:hidden absolute data-[open=true]:visible data-[open=true]:w-3/4 data-[open=true]:bg-[#eff3f6] max-md:data-[open=true]:shadow-2xl data-[open=true]:rounded-r-lg md:relative md:w-16 md:data-[open=true]:w-72 transition-all duration-300 ease-in-out ring-1 ring-gray-200`}
        data-open={open}>
        <div className="flex items-center justify-center w-full h-16 border-b bg-[#eff3f6] border-b-gray-100">
          <img
            src={open ? logo : BrokerIcon}
            data-open={open}
            className={`w-10 data-[open=true]:w-30 mix-blend-darken`}
            alt="logo"
          />
        </div>
        <div
          className="absolute top-12 right-[-14px] h-[29px] w-[30px] flex justify-center items-center bg-white rounded-[6px] border border-[#b7b7b7] cursor-pointer transform transition duration-500 ease-in-out data-[open=false]:rotate-180"
          onClick={() => dispatch(setSidebarOpen(!open))}
          data-open={open}>
          <HiChevronLeft size={16} className="text-slate-600" />
        </div>
        <div className="hide-scroll overflow-y-auto flex flex-col gap-1 h-fit">
          {SIDE_MENU?.filter(
            (item) =>
              menuFromApi?.includes(item.slug) ||
              (item.submenus &&
                item.submenus?.some((submenu) =>
                  menuFromApi?.includes(submenu.slug)
                ))
          ).map((menu) => {
            const isActive =
              menu.submenus?.some(
                (submenu) =>
                  location.pathname.split("/")[1] ===
                  submenu.route.split("/")[0]
              ) || location.pathname === `/${menu.route}`;
            const isExpanded = open2.includes(menu.id);
            const hasSubmenus = menu.submenus?.length;

            return (
              <div key={menu.id}>
                <Tooltip arrow title={menu.name} placement="right">
                  <div
                    className={`flex items-center justify-between gap-2 px-2 h-9 rounded-lg font-semibold w-full transition-colors duration-200 ${
                      isActive ? "bg-white text-primary/90" : "text-slate-600"
                    } hover:bg-extraLightGray/80 cursor-pointer`}
                    onClick={() => {
                      if (menu.route) navigate(menu.route);
                      if (hasSubmenus) {
                        setOpen2(isExpanded ? [] : [menu.id]);
                      }
                      if (lessthan576 && menu.route) {
                        dispatch(setSidebarOpen(false));
                      }
                    }}>
                    <div className="flex relative items-center gap-2 w-44">
                      <span>{sideBarIcons[menu.name]}</span>
                      {open && (
                        <p className="text-sm text-ellipsis whitespace-nowrap overflow-hidden">
                          {menu.name}
                        </p>
                      )}
                    </div>
                    {hasSubmenus && open && (
                      <span
                        className={`transition-transform duration-300 ${
                          !isExpanded ? "rotate-180" : ""
                        }`}>
                        <IoIosArrowUp />
                      </span>
                    )}
                  </div>
                </Tooltip>

                <div
                  className={`my-1 pl-5 w-44 flex flex-col gap-1 border-l-2 translate-x-4 border-lightGray cursor-pointer transition-all duration-500 ease-in-out overflow-hidden ${
                    isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  } ${!open ? "hidden" : ""}`}>
                  {menu?.submenus
                    ?.filter((submenu) => menuFromApi?.includes(submenu.slug))
                    ?.map((submenu) => {
                      const subActive =
                        location.pathname.split("/")[1] ===
                        submenu.route.split("/")[0];
                      return (
                        <div
                          key={submenu.id}
                          className={`flex items-center gap-2 px-2 h-9 rounded-lg font-semibold w-full text-sm transition-colors duration-200 ${
                            subActive
                              ? "bg-white text-primary/90"
                              : "text-slate-600"
                          } hover:bg-white hover:text-primary text-ellipsis whitespace-nowrap overflow-hidden`}
                          onClick={() => {
                            navigate(submenu.route);
                            if (lessthan576) dispatch(setSidebarOpen(false));
                          }}>
                          {submenu.name}
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Outlet />
    </div>
  );
};
export default SideBar;
