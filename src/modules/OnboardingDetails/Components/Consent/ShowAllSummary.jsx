import { Download } from "lucide-react";
import BankDetailsSummary from "./components/BankDetailsSumary";
import NomineeDetailsSummary from "./components/NomineeDetailsSummary";
import ProfileSummary from "./components/ProfileSummary";
import UiButton from "@/UI-Components/Buttons/UiButton";

const ShowAllSummary = ({ userData, handleDownload, generatePdfPending }) => {
  return (
    <div className="w-full  flex flex-col gap-4 p-4 border border-lightGray rounded-lg shadow-sm mx-auto">
      <section className="flex justify-between items-center md:px-4 lg:px-5 ">
        <div className="flex flex-col justify-self-start">
          <h2 className="text- font-semibold">Summary</h2>

          <p className="text-xs text-gray-400">View all the entered data</p>
        </div>
        {userData?.declaration?.check && (
          <UiButton
            text={"Download"}
            icon={<Download className="size-4" />}
            onClick={handleDownload}
            disabled={generatePdfPending}
            className="w-24 text-xs md:text-sm md:w-28 "
          />
        )}
      </section>
      <section className="flex flex-col gap-2 max-h-[calc(100vh-200px)] overflow-y-auto scroll-auto px-2">
        <ProfileSummary userData={userData} />
        <BankDetailsSummary bankData={userData?.bank} />
        <NomineeDetailsSummary nomineeData={userData?.nominee} />
      </section>
    </div>
  );
};

export default ShowAllSummary;
