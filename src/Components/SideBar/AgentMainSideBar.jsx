import { useSelector, useDispatch } from "react-redux";
import {
  setAgent,
  setAgentName,
  setCompletedName,
  setCompletedType,
  setMenus,
} from "@/modules/OnboardingDetails/agent.slice";
import { useGetAgentMenu } from "./Service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { HiCheck } from "react-icons/hi";
import { ICONS } from "../../constants/ICONS";

const AgentMainSideBar = () => {
  const { agentName, completedName } = useSelector((state) => state.agent);
  const dispatch = useDispatch();

  const [animating, setAnimating] = useState(false);
  const [progressAnimation, setProgressAnimation] = useState(false);

  const isAdmin = +localStorage.getItem("isAdmin");

  const navigate = useNavigate();

  useEffect(() => {
    isAdmin && navigate("/");
  }, []);

  const id =
    +new URLSearchParams(window.location.search).get("id") || undefined;

  const { data } = useGetAgentMenu(id);
  const steps = data?.data?.menu || [];

  useEffect(() => {
    if (steps.length > 0) {
      dispatch(setMenus(steps));
    }
  }, [steps]);

  const completedId = steps?.findIndex((item) => item?.label === completedName);
  const agentId = steps?.findIndex((item) => item?.label === agentName);

  const handleStepClick = (index) => {
    if (index <= completedId && !animating) {
      setAnimating(true);
      dispatch(setAgent(index));
      dispatch(setAgentName(steps[index].label));
      setTimeout(() => setAnimating(false), 400);
    }
  };

  // Demo function to advance to next step with progress animation
  useEffect(() => {
    if (completedId < steps.length - 1 && !animating) {
      setAnimating(true);
      setProgressAnimation(true);

      // After a delay to show the progress animation, reset the animation states
      setTimeout(() => {
        setAnimating(false);
        setProgressAnimation(false);
      }, 800);
    }
  }, [completedId]);

  useEffect(() => {
    if (agentId >= completedId) {
      // Simulate a delay for the progress animation
      dispatch(setCompletedType(agentId));
      dispatch(setCompletedName(agentName));
    }
  }, [agentId]);

  return (
    <div className="h-[calc(100%-50px)] overflow-y-auto overflow-x-hidden hide-scroll">
      {/* Responsive Stepper Container */}
      <div className="p-2 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible hide-scroll max-sm:h-20">
        {steps.map((step, index) => {
          const isActive = index === agentId;
          const isCompleted = index <= completedId;
          const isClickable = index <= completedId && !animating;
          const isAnimatingToNext = progressAnimation && index === completedId;
          const Icon = ICONS[steps[index]?.label];

          return (
            <div
              key={index}
              className="flex flex-col md:flex-row items-center md:items-start min-w-fit">
              {/* Step Circle and Line Container */}
              <div className="flex flex-row md:flex-col items-center">
                {/* Step Circle */}
                <button
                  type="button"
                  onClick={() => isClickable && handleStepClick(index)}
                  className={`
                    relative flex items-center justify-center 
                    size-10 sm:w-10 sm:h-10 md:w-10 md:h-10
                    rounded-full z-9
                    transition-all duration-300 ease-out
                    ${
                      isActive
                        ? "bg-gradient-to-br from-primary to-secondary scale-110 shadow-lg"
                        : isCompleted
                          ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-md"
                          : "bg-gray-200 dark:bg-gray-700"
                    } 
                    ${
                      isClickable
                        ? "cursor-pointer hover:scale-105"
                        : "cursor-not-allowed"
                    }
                  `}>
                  {/* Number/Icon */}
                  <div
                    className={`
                      transition-all duration-300 ease-out
                      ${
                        isCompleted && !isActive
                          ? "opacity-0 scale-0"
                          : "opacity-100 scale-100"
                      }
                    `}>
                    <span
                      className={`
                        text-xs sm:text-sm md:text-base font-bold size-4 z-10
                        ${
                          isActive || isCompleted
                            ? "text-white"
                            : "text-gray-500 dark:text-gray-400"
                        }
                      `}>
                      {Icon && <Icon />}
                    </span>
                  </div>

                  {/* Checkmark */}
                  <div
                    className={`
                      absolute inset-0 flex items-center justify-center
                      transition-all duration-300 ease-out
                      ${
                        isCompleted && !isActive
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-0"
                      }
                    `}>
                    <HiCheck className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-white" />
                  </div>

                  {/* Pulse for active step */}
                  {isActive && (
                    <span className="absolute w-full h-full rounded-full bg-primary/30 animate-pulse" />
                  )}
                </button>

                {/* Connector Line - Responsive */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      h-1 w-16
                      md:h-4 md:w-1 lg:h-6 lg:w-1
                      mx-2 md:mx-0 md:my-0.5
                      relative overflow-hidden rounded-full
                      bg-gray-200 dark:bg-gray-700
                    `}>
                    {/* Completed progress fill */}
                    <div
                      className={`
                        absolute 
                        w-0 h-full
                        md:w-full md:h-0
                        rounded-full
                        bg-gradient-to-r from-green-500 to-emerald-600
                        transition-all duration-500 ease-out
                        ${
                          isCompleted && index < completedId
                            ? "w-full md:h-full"
                            : "w-0 md:h-0"
                        }
                      `}
                      style={{
                        transform:
                          isCompleted && index < completedId
                            ? "translateX(0)"
                            : "translateX(-100%)",
                      }}
                    />

                    {/* Active progress animation */}
                    {isAnimatingToNext && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {/* Animated progress bar */}
                        <div className="absolute w-0 h-full md:w-full md:h-0 bg-primary rounded-full animate-progress-flow" />

                        {/* Moving dots */}
                        <div className="absolute w-2 h-2 bg-white rounded-full animate-dot-move-1" />
                        <div className="absolute w-1.5 h-1.5 bg-white/80 rounded-full animate-dot-move-2" />
                        <div className="absolute w-1 h-1 bg-white/60 rounded-full animate-dot-move-3" />
                      </div>
                    )}

                    {/* Next step progress indicator */}
                    {isCompleted &&
                      index === completedId &&
                      !progressAnimation && (
                        <div className="absolute inset-0">
                          <div className="h-full w-1/3 bg-primary/50 rounded-full animate-progress-pulse-1" />
                          <div className="h-full w-1/4 bg-primary/40 rounded-full animate-progress-pulse-2" />
                          <div className="h-full w-1/5 bg-primary/30 rounded-full animate-progress-pulse-3" />
                        </div>
                      )}
                  </div>
                )}
              </div>

              {/* Step Label - Responsive positioning */}
              <div
                className={`
                  mt-2 text-center
                  md:mt-0 md:ml-4 md:text-left md:flex md:items-center md:min-h-[3rem]
                  ${isClickable ? "cursor-pointer" : "cursor-not-allowed"}
                  transition-all duration-300 ease-out
                  min-w-fit relative
                `}
                onClick={() => isClickable && handleStepClick(index)}>
                <div
                  data-last={index === steps.length - 1 ? true : false}
                  className={`
                    font-medium text-xs md:text-sm
                    whitespace-nowrap
                    transition-all duration-300 ease-out max-sm:absolute max-sm:-bottom-4  max-sm:-left-16 max-sm:data-[last=true]:-left-8
                    ${
                      isActive
                        ? "text-primary dark:text-primary/80 font-bold"
                        : isCompleted
                          ? "text-slate-600 dark:text-slate-600"
                          : "text-gray-500 dark:text-gray-400"
                    }
                  `}>
                  {step.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AgentMainSideBar;
