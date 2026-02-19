import { Clock, FileText, User } from "lucide-react";
import UiCapsule from "@/UI-Components/Capsules/UiCapsule";
import { DateTime } from "luxon";
import InlineLoader from "@/Components/Loader/InlineLoader";

interface HistoryItem {
  causer: string;
  comment: string | null;
  endorsement_status: string;
  document_path: string;
  created_by: string;
  messageType: "sender" | "receiver";
  created_at: string;
}

interface RequestHistoryProps {
  historyData: HistoryItem[];
  isLoading: boolean;
}

const textColorClasses: Record<string, string> = {
  "Under Review": "#E2852E",
  Rejected: "#FF0000",
  Approved: "#10B981",
  "Discrepancy Raised": "#F59E0B",
};

export default function HistoryModal({
  historyData,
  isLoading,
}: RequestHistoryProps) {
  const formatDate = (iso: string) =>
    DateTime.fromISO(iso).toFormat("dd-MM-yyyy HH:mm:ss");

  if (isLoading) return <InlineLoader />;

  return (
    <div className="bg-offWhite flex flex-col gap-2 rounded-lg shadow-xl w-full max-h-[calc(100vh-320px)] overflow-auto p-4">
      {historyData?.map((item) => {
        const isSender = item.messageType === "sender";

        return (
          <div
            key={item?.created_at}
            className={`flex  w-full  ${isSender ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`
                  min-w-1/2 p-2 rounded-xl border
                  ${isSender ? "bg-orange-50 border-orange-200" : "bg-gray-50 border-gray-200"}
                `}
            >
              {/* Header */}

              <section className="flex justify-between gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-700">
                    {item.created_by}
                  </h3>
                </div>
                <UiCapsule
                  text={item.endorsement_status}
                  color={textColorClasses[item.endorsement_status]}
                  // className={'border border-[#10B981]'}
                />
              </section>

              {item.comment && (
                <div className="flex flex-col gap-4 p-2 my-2 text-sm text-gray border border-gray-200 rounded-xl  w-full">
                  <h6 className="text-sm text-gray-700 font-medium">Comment</h6>
                  <div className=" font-medium">{item?.comment ?? "---"}</div>
                </div>
              )}

              {item.document_path && (
                <a
                  href={item.document_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline my-2"
                >
                  <FileText size={16} />
                  View Document
                </a>
              )}

              <div
                className={`pt-3 border-t ${
                  item.messageType === "sender"
                    ? "border-blue-100"
                    : "border-slate-300"
                } space-y-1.5`}
              >
                <div className="flex items-center gap-2 text-xs text-body">
                  <User size={14} />
                  <span>{item.causer}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-body">
                  <Clock size={14} />
                  <span>{formatDate(item.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
