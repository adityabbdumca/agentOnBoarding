import { removeCharAddSpace } from "@/HelperFunctions/helperFunctions";
import { RefreshCcw } from "lucide-react";

const BeforeAfterSectionCard = ({ viewEndorseData, renderValue }) => {
  if (!viewEndorseData?.before_changes && !viewEndorseData?.after_changes) {
    return null;
  }

  const beforeChanges = viewEndorseData?.before_changes?.nominee || viewEndorseData?.before_changes || {};
  const afterChanges = viewEndorseData?.after_changes || {};

  const allChangeKeys = Object.keys(afterChanges);
  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <RefreshCcw className="size-5 text-amber-600" />
        Changes Made
      </h2>

      <div className="grid grid-cols-2 gap-1">
        {allChangeKeys.map((key) => {
          const beforeValue = beforeChanges[key];
          const afterValue = afterChanges[key];
          const title =
            viewEndorseData?.endorsement_type == "Change in Nominee Details"
              ? `Nominee details ${+key + 1}`
              : removeCharAddSpace(key, "_");

          return (
            <div
              key={key}
              className="col-span-2 grid grid-cols-2 gap-4 border border-lightGray rounded-lg bg-white p-4">
              {/* Before */}
              <div>
                <p className="text-xs text-red-600 font-medium mb-1 capitalize">
                  {title} (Before)
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  {renderValue(beforeValue)}
                </div>
              </div>

              {/* After */}
              <div>
                <p className="text-xs text-green-600 font-medium mb-1 capitalize">
                  {title} (After)
                </p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  {renderValue(afterValue)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BeforeAfterSectionCard;
