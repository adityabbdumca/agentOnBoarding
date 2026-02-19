import { User } from "lucide-react";


const InfoCard = ({ label, value, icon: Icon = User }) => {
  return (
    <div className="rounded-lg px-1 py-1 flex gap-4 items-center">
      <div className="flex flex-col min-w-0">
        <span className="text-xs text-gray-400">{label}</span>
        <span className="mt-1 text-xs font-semibold truncate">
          {typeof value === "object" ? value?.label || "—" : value || "—"}
        </span>
      </div>
    </div>
  );
};

export default InfoCard;

