import { useEffect, useState } from "react";
import { useGetTheme } from "../../service";
import { useNavigate } from "react-router";
import { HiRefresh } from "react-icons/hi";

const CircleTimer = () => {
  const INTERVAL_TIME = 10;
  const navigate = useNavigate();

  const [timerState, setTimerState] = useState({
    countdown: INTERVAL_TIME,
    isFetching: false,
    lastFetchTime: "",
  });

  const { data, refetch, isPending } = useGetTheme(!timerState.isFetching);
  useEffect(() => {
    if (data?.data?.status === 200) {
      navigate("/agent-master");
    }
  }, [data?.data?.status]);

  useEffect(() => {
    // Initial fetch

    // Set up timer
    const timer = setInterval(() => {
      setTimerState((prev) => {
        // If already fetching, don't change the state
        if (prev.isFetching) return { ...prev, isFetching: false };

        // If countdown reached 0, trigger a new fetch
        if (prev.countdown <= 1) {
          // refetch();
          return {
            isFetching: true,
            countdown: INTERVAL_TIME,
          };
        }

        // Otherwise, decrement the countdown
        return {
          ...prev,
          countdown: prev.countdown - 1,
        };
      });
    }, 1000);

    // Clean up
    return () => {
      setTimerState((prev) => ({ ...prev, isFetching: false }));
      clearInterval(timer);
    };
  }, [refetch]);
  const { countdown } = timerState;

  // Calculate progress percentage
  const progress = (countdown / INTERVAL_TIME) * 100;

  // Size and stroke parameters
  const size = 40;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative inline-flex items-center justify-center">
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />

          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#3B82F6"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-300 stroke-blue-500`}
          />
        </svg>

        {/* Inner text or loading indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-white">{countdown}</span>
        </div>
      </div>
      <span className="relative flex items-center">
        <HiRefresh
          className={`mr-2 h-4 w-4 ${
            isPending ? "animate-spin" : "group-hover:animate-spin"
          }`}
        />
        {isPending ? "Reconnecting..." : "Attempting to Reconnect..."}
      </span>
    </div>
  );
};

export default CircleTimer;
