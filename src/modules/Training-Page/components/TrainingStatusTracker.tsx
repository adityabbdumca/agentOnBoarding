import { CheckCircle2, Clock, Circle } from "lucide-react";

interface IStatusItem {
  id: number;
  title: string;
  description: string;
  status: "completed" | "in-progress" | "pending";
}

interface ITrackerData {
  stage_number: number;
  stage_label: string;
  stage_list: string[];
}

export function TrainingStatusTracker({
  trackerData,
}: {
  trackerData: ITrackerData;
}) {
  if (!trackerData) return null;

  const currentIndex = trackerData.stage_list.indexOf(trackerData.stage_label);

  const statusItems: IStatusItem[] = trackerData.stage_list.map(
    (label, index) => ({
      id: index + 1,
      title: label,
      description: "",
      status:
        index < currentIndex
          ? "completed"
          : index === currentIndex
            ? "in-progress"
            : "pending",
    })
  );

  return (
    <div className="bg-white pb-6 md:pb-8 flex flex-col gap-3 md:gap-6">
      <h2 className="text-base md:text-lg font-semibold">
        Track Application Status
      </h2>

      <div className="flex w-full items-start overflow-x-auto hide-scroll">
        {statusItems.map((item, index) => {
          const isCompleted = item.status === "completed";
          const isInProgress = item.status === "in-progress";

          const Icon = isCompleted
            ? CheckCircle2
            : isInProgress
              ? Clock
              : Circle;

          const circleColor = isCompleted
            ? "bg-green-600"
            : isInProgress
              ? "bg-amber-600"
              : "bg-slate-300";

          const connectorColor = isCompleted ? "bg-green-600" : "bg-slate-300";

          return (
            <div
              key={item.id}
              className="flex items-start flex-1 last:flex-none"
            >
              <div className="flex flex-col items-center w-28 md:w-40">
                <div className="relative mb-2 md:mb-3">
                  {isInProgress && (
                    <div
                      className={`absolute inset-0 rounded-full ${circleColor} animate-radiate`}
                    />
                  )}

                  <div
                    className={`${circleColor} rounded-full p-2 md:p-3 flex items-center justify-center relative`}
                  >
                    <Icon className="text-white size-5 md:size-6" />
                  </div>
                </div>

                <p className="text-xs md:text-sm font-medium text-slate-800 text-center">
                  {item.title}
                </p>

                {item.description && (
                  <p className="text-[10px] md:text-xs text-slate-500 mt-1 text-center">
                    {item.description}
                  </p>
                )}
              </div>

              {index < statusItems.length - 1 && (
                <div className="flex-1 mt-4 md:mt-6">
                  <div className={`h-1 w-6 lg:h-1 md:h-1 lg:w-full ${connectorColor}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
