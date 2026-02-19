import { HiDotsHorizontal, HiUser } from "react-icons/hi";
import MainContainer from "../OnboardingDetails/Components/MainContainer";
import { useGetAgentMenu } from "@/Components/SideBar/Service";
import { useEffect, useState } from "react";
import Button from "@/UI-Components/Button";
import { useAgentMenuReorder } from "./service";
const AgentMenuMasterIndex = () => {
  const { data } = useGetAgentMenu(undefined, { allMenu: true });
  const { mutate } = useAgentMenuReorder();

  const [step, setStep] = useState([]);
  const [dropStep, setDropStep] = useState(null);
  const [activeStep, setActiveStep] = useState(null);

  useEffect(() => {
    if (Array.isArray(data?.data?.menu)) {
      setStep(data?.data?.menu);
    }
  }, [data]);

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("text/plain", id);
    setActiveStep(id);
  };

  const handleDragOver = (e, id) => {
    e.preventDefault();
    // e.stopPropagation();
    setDropStep(id);
  };

  const handleDragEnd = () => {
    if (activeStep === dropStep) return;
    setStep((prev) =>
      prev
        ?.flatMap((step, index) => {
          if (
            (step?.id >= activeStep && step?.id <= dropStep) ||
            (step?.id <= activeStep && step?.id >= dropStep)
          ) {
            if (activeStep <= dropStep) {
              if (step?.id === dropStep) {
                return [
                  { ...step, id: index },
                  { label: prev[activeStep]?.label, id: activeStep },
                ];
              }
              if (activeStep === step?.id) return [];
              else return [{ ...step, id: step?.id }];
            } else {
              if (step?.id === dropStep) {
                return [
                  { label: prev[activeStep]?.label, id: activeStep },
                  { ...step, id: index },
                ];
              }
              if (activeStep === step?.id) return [];
              else return [step];
            }
          } else return [step];
        })
        ?.map((step, index) => {
          return { ...step, id: index };
        })
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    mutate(step);
  };

  return (
    <MainContainer
      title="Agent Menu Master"
      Icon={HiUser}
      heading={"Agent Menu Master"}
      subHeading={
        "View and manage the list of agents for your Insurance Agent qualification exam"
      }
      isAdmin
    >
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-700 text-sm">
          <span className="font-medium">Tip:</span> Drag and drop items to
          reorder the steps in your onboarding process.
        </p>
      </div>

      <form onSubmit={onSubmit}>
        {/* Draggable steps */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          {step
            // .sort((a, b) => a.id - b.id)
            .map((step) => (
              <div
                key={step.id}
                draggable
                onDragStart={(e) => handleDragStart(e, step.id)}
                onDragOver={(e) => handleDragOver(e, step.id)}
                onDragEnd={handleDragEnd}
                className={`
                    border-b border-gray-100 last:border-b-0 
                    cursor-grab active:cursor-grabbing
                    transition-all duration-200
                    ${step.id === step ? "bg-blue-50" : "hover:bg-gray-50"}
                  `}
              >
                <div className="flex items-center p-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-md mr-4 text-gray-500">
                    <span className="text-sm font-medium">{step.id}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-gray-800 font-medium">{step.label}</h3>
                  </div>
                  <div
                    className={`flex items-center text-gray-400 ${
                      step.id === step ? "opacity-0" : "opacity-100"
                    }`}
                  >
                    <HiDotsHorizontal />
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="flex item-center justify-end mt-4">
          <Button type="submit" width={"200px"}>
            Submit
          </Button>
        </div>
      </form>
    </MainContainer>
  );
};

export default AgentMenuMasterIndex;
