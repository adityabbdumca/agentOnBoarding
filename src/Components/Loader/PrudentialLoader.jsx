import Logo_pre from "@/assets/images/Prudential.svg";
import { DotPulse } from "ldrs/react";
import "ldrs/react/DotPulse.css";
const PrudentialLoader = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center  gap-2 ">
      <img src={Logo_pre} alt="Prudential Logo" />
      <DotPulse size="40" speed="1.3" color="#ff0000" />
    </div>
  );
};

export default PrudentialLoader;
