import { HiOutlineDuplicate } from "react-icons/hi";
import ResultCell from "./ResultCell";
import { toast } from "react-toastify";
import RejectCell from "./RejectCell";

export const AGENT_TYPE_STYLES = {
  new: "bg-green-100 text-green-700",
  composite: "bg-cyan-100 text-cyan-700",
  transfer: "bg-yellow-100 text-yellow-700",
  posp: "bg-purple-100 text-purple-700",
};
export const AgentMasterCustomCells = {
  agent_type: ({ row }) => {
    const style =
      AGENT_TYPE_STYLES[`${row.getValue("agent_type")}`] ||
      "bg-gray-100 text-gray-700";
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${style}`}
      >
        {row.getValue("agent_type") || "N/A"}
      </span>
    );
  },
  result: ({ row }) => {
    const verticalId = localStorage.getItem("vertical_id");
    return ["3"].includes(verticalId) ? "N/A" : <ResultCell row={row} />;
  },
  reject: ({ row }) => {
    const verticalId = localStorage.getItem("vertical_id");
    return ["3"].includes(verticalId) ? "N/A" : <RejectCell row={row} />;
  },
  application_number: ({ row }) => {
    if (!row.getValue("application_number")) return <span>N/A</span>;
    const handleCopy = () => {
      navigator.clipboard.writeText(row.getValue("application_number"));
      toast.info("Application number copied to clipboard");
    };
    return (
      <div className="inline-flex items-center space-x-2 bg-blue-50 px-2 py-1 rounded text-xs font-semibold text-blue-600 min-w-[100px]">
        <span>{row.getValue("application_number")}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="hover:text-blue-800 transition cursor-pointer"
        >
          <HiOutlineDuplicate size={16} />
        </button>
      </div>
    );
  },
};
