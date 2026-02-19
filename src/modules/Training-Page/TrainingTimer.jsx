import { useEffect, useState } from "react";
import { useStartTraining } from "../OnboardingDetails/service";

const TrainingTimer = ({ agentId, isFls, agentType, time, setTime}) => {
  const { data: timerData } = useStartTraining({ agentId, isFls, agentType });

 
  const [isActive, setIsActive] = useState(false);
  useEffect(() => {
    setIsActive(true);
  }, []);
  useEffect(() => {
    if (timerData?.return_data?.remaining_seconds > 0) {
      setTime(timerData?.return_data?.remaining_seconds);
    }
  }, [timerData?.return_data]);

  useEffect(() => {
    let interval;
    if (isActive && time > 0) {
      // Decrease the time every second
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    // Cleanup interval on component unmount or when the timer is stopped
    return () => clearInterval(interval);
  }, [isActive, time]);

  // const startTimer = () => setIsActive(true);
  // const stopTimer = () => setIsActive(false);

  // Helper function to format time as HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const sec = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div className="flex justify-between gap-2">
      <div
        data-completed={time === 0}
        className="font-bold text-xs md:text-sm text-primary font-family-theme px-4  py-1 rounded-3xl data-[completed=true]:bg-green-100 data-[completed=true]:text-emerald-600 bg-primary/10">
        {time === 0 ? "Completed" : formatTime(time)}
      </div>
    
    </div>
  );
};

export default TrainingTimer;
