import { Banknote } from "lucide-react";
import InfoCard from "./InfoCard";

const BankDetailsSummary = ({ bankData }) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-2 p-2 border border-lightGray rounded-lg">
        <h2 className="text-sm font-semibold">Bank Details</h2>

        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-1">
          <InfoCard
            label="Account Type"
            value={bankData?.account_type || "—"}
            icon={Banknote}
          />
          <InfoCard
            label="Name as in Bank Account"
            value={bankData?.name_as_in_bank_acount || "—"}
            icon={Banknote}
          />
          <InfoCard
            label="Bank Account Number"
            value={bankData?.bank_account_number || "—"}
            icon={Banknote}
          />
          <InfoCard
            label="Re-Enter Bank Account Number"
            value={bankData?.re_enter_bank_account_number || "—"}
            icon={Banknote}
          />
          <InfoCard
            label="IFSC Code"
            value={bankData?.ifsc_code || "—"}
            icon={Banknote}
          />
          <InfoCard
            label="Bank Name"
            value={bankData?.bank_name || "—"}
            icon={Banknote}
          />
          <InfoCard
            label="Bank City"
            value={bankData?.bank_city || "—"}
            icon={Banknote}
          />
          <InfoCard
            label="Branch Name"
            value={bankData?.branch_name || "—"}
            icon={Banknote}
          />
        </section>
      </div>
    </div>
  );
};

export default BankDetailsSummary;
