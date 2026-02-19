import { User2 } from "lucide-react";
import InfoCard from "./InfoCard"; 
import { NOMINEE_FIELDS } from "../summary.constant";

const NomineeDetailsSummary = ({ nomineeData }) => {
  if (!nomineeData?.length) return null;

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2 p-2 border border-lightGray rounded-lg">
        <h2 className="text-sm font-semibold">Nominee Details </h2>

        {nomineeData.map((nominee, idx) => (
          <div
            key={idx}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1 p-2 rounded-lg bg-lightGray/20">
            {NOMINEE_FIELDS.map(({ label, key }) => {
              const isSameAddress = key == "is_communication_address_same";
              const address =
                isSameAddress && nominee?.[key] === true ? "Yes" : "No";
              const finalValue = isSameAddress ? address : nominee?.[key];
              return (
                <InfoCard
                  key={key}
                  label={label}
                  value={finalValue ?? "-"}
                  icon={User2}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NomineeDetailsSummary;
