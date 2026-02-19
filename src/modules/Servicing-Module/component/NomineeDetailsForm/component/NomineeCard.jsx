import { User } from "lucide-react";

const NomineeCard = ({ setStage, stage, nomineeUnit, index }) => {
  return (
    <div
      key={nomineeUnit.key}
      className={`flex-shrink-0 cursor-pointer transition-all hover:shadow-md rounded-lg bg-white ${
        stage === index ? "border-blue-500 border-2" : "border border-blue-200"
      }`}
      onClick={() => setStage(index)}
    >
      <div className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <User className="w-8 h-8 text-blue-500" />
          </div>
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-gray-900">
              {nomineeUnit?.nominee_name || "Name"}
            </h3>
            <p className="text-xs text-gray-500">
              {nomineeUnit?.gender?.label || "Gender"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NomineeCard;
