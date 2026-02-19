import UiCapsule from "@/UI-Components/Capsules/UiCapsule";
import { ArrowRight } from "lucide-react";
import { iconMap } from "../../servicingModule.constant";

export default function EndorsementCard({ endorsement, handleClick }) {
  const IconComponent = iconMap[endorsement?.name];

  return (
    <div
      className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer bg-white hover:border-primary/50"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-lg">
          {IconComponent ? (
            <IconComponent className="w-5 h-5 text-blue-600" />
          ) : (
            <div className="w-5 h-5 text-gray-400">?</div>
          )}
        </div>
        <div className="flex flex-col items-start ml-2 gap-6">
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-gray-900 text-sm">
              {endorsement.name}
            </h3>
            <UiCapsule
              text={endorsement?.service_type}
              color={
                endorsement?.service_type === "Auto" ? "#16a34a" : "#F97A00"
              }
            />
          </div>
          <div className="space-y-1 ">
            <p className={`text-xs font-medium ${endorsement.color}`}>
              {endorsement.validation_type}
            </p>
            <p className="text-xs text-gray-600 leading-relaxed">
              {endorsement.description}
            </p>
          </div>
        </div>
        <div>
          <ArrowRight className="size-6 text-gray-400 mt-9" />
        </div>
      </div>
    </div>
  );
}
