import useGlobalRoutesHandler from "@/hooks/useGlobalHandleRouter";
import * as motion from "motion/react-client";

export default function UiTabs({
  tabList = [],
  className,
  containerClass,
  layoutId,
}) {
  const { navigateTo, activeRoutes } = useGlobalRoutesHandler();

  return (
    <div
      id="hide-scrollbar"
      className={`flex items-center border-b relative border-extraLightGray ${containerClass}`}
    >
      {tabList?.map((tab) => {
        const isDisabled = tab?.disabled;
        const isActive = activeRoutes.includes(tab?.path);
        const Icon = tab?.Icon || (() => <></>);
        return (
          <motion.li
            id={tab?.name}
            key={tab?.path}
            initial={false}
            data-active={isActive}
            className={`text-nowrap w-max px-3 relative py-2  rounded-t text-sm font-medium 
               flex items-center justify-center gap-2  ${className} ${
              isDisabled ? "cursor-not-allowed" : "cursor-pointer"
            } `}
            onClick={() => {
              if (isDisabled) return;
              navigateTo({ url: tab?.path });
            }}
          >
            <Icon className="size-4 text-body" />
            {tab?.iconNode}
            <span> {tab.name}</span>

            {isActive ? (
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary"
                layoutId={layoutId}
              />
            ) : null}
          </motion.li>
        );
      })}
    </div>
  );
}
