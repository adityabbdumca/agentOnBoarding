import { useEffect, useRef, useState } from "react";

const UiSliderTabs = ({
  tabs,
  className,
  activeTab,
  setActiveTab,
  bgColor = "bg-primary",
  handleClick,
  disabledTab,
  setEndorsementTypeId,
}) => {
  const tabRefs = useRef({});
  const [indicatorProps, setIndicatorProps] = useState({ x: 0, width: 0 });
  const verticalId = JSON.parse(localStorage.getItem("vertical_id"));
  useEffect(() => {
    const currentRef = tabRefs.current[activeTab.id];
    if (currentRef && currentRef.parentElement) {
      const rect = currentRef.getBoundingClientRect();
      const parentRect = currentRef.parentElement.getBoundingClientRect();
      setIndicatorProps({
        x: rect.left - parentRect.left,
        width: rect.width,
      });
    }
  }, [activeTab]);

  // Helper: Check if current tab is disabled (by id or name)
  const isTabDisabled = (tab) => {
    return (
      disabledTab != null &&  
      (tab.id === disabledTab || tab.name === disabledTab)
    );
  };

  return (
    <div className={`relative flex flex-col gap-2 py-2 ${className}`}>
      <div className="relative flex gap-8 border-b border-gray-200">
        {/* Indicator line (only visible if active tab is not disabled) */}
        {!isTabDisabled(activeTab) && (
          <div
            className={`absolute bottom-0 h-0.5 rounded-lg ${bgColor} transition-all duration-300`}
            style={{
              transform: `translateX(${indicatorProps.x}px)`,
              width: `${indicatorProps.width}px`,
            }}
          />
        )}

        {tabs.map((tab) => {
          const isDisabled = isTabDisabled(tab);
          return (
            <div
              key={tab.id}
              ref={(el) => (tabRefs.current[tab.id] = el)}
              onClick={() => {
                if (isDisabled) return;
                if (verticalId == 3 && tab?.id == 3) {
                  setEndorsementTypeId(null);
                }
                setActiveTab(tab);
                handleClick?.();
              }}
              className={`relative px-1 py-3 text-sm font-medium transition-all duration-300 cursor-${
                isDisabled ? "default" : "pointer"
              } ${
                isDisabled
                  ? "text-gray-300"
                  : activeTab.id === tab.id
                  ? "text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              style={{
                opacity: isDisabled ? 0.6 : 1,
                pointerEvents: isDisabled ? "none" : "auto",
              }}
            >
              {tab.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UiSliderTabs;
