import trainingImg from "@/assets/images/training.png";
import Button from "@/UI-Components/Button";
import UiButton from "@/UI-Components/Buttons/UiButton";
import { BackButton } from "@/UI-Components/GlobalStyles";
import { Download, FileText, MoveRight } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { FaDownload } from "react-icons/fa";
import {
  HiBookOpen,
  HiCheckCircle,
  HiOutlineArrowNarrowLeft,
  HiSpeakerphone,
} from "react-icons/hi";
import { HiClock } from "react-icons/hi2";
import Swal from "sweetalert2";
import useTraining from "./hooks/useTraining";
import TrainingTimer from "./TrainingTimer";
import {
  useGenerateApplicationFormPDF,
  useGetTrainingDocs,
} from "../OnboardingDetails/service";
import { TrainingStatusTracker } from "./components/TrainingStatusTracker";

const TrainingPageIndex = ({ watch, userData }) => {
  // const { location } = useGlobalRoutesHandler();
  const [viewDoc, setViewDoc] = useState(false);
  const [time, setTime] = useState(0);
  const isExamScheduled = watch("user_stage")?.toLowerCase() === "exam pending";
  const verticalId = +localStorage.getItem("vertical_id");
  const examDate = watch("selected_date");
  const examHallTicket = watch("hall_ticket_path");
  const applicationNo = watch("application_number");
  const {
    mutations: {
      postDownloadCompositeMutation,
      postDownloadFresherMutation,
      generateTrainingPdfMutation,
    },
    functions: { getApplicationStatusTracker },
  } = useTraining({ agentId: userData?.profile?.user_id });
  const { generateApplication, generatePdfPending } =
    useGenerateApplicationFormPDF();
  const agentType = userData?.user_type;
  // const { subRoute } = useGlobalRoutesHandler();
  // const agentId = location?.pathname?.split("/")?.[2];
  // const { data: userData } = useGetData(agentId);
  const { data } = useGetTrainingDocs({ id: userData?.profile?.user_id });
  const isNewAgentType = agentType === "fresh";
  const isComposite = agentType === "composite";
  const isCompositeAndTransfer = ["composite", "transfer"].includes(agentType);
  const isFls = localStorage?.getItem("vertical_id") == 3;
  const fileArray = data?.return_data
    ? Object.entries(data?.return_data)?.map(([key, value]) => ({
        id: key,
        name: key,
        file: value,
      }))
    : [];

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // This is where you can do cleanup or show a confirmation message.
      // If you want to show a confirmation dialog, return a string message:
      const message = "Are you sure you want to leave?";
      event.returnValue = message; // Standard for most browsers
      return message; // For older browsers like IE
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleDownload = () => {
    if (isNewAgentType) {
      postDownloadFresherMutation.mutate(
        {
          id: userData?.profile?.user_id,
        },
        {
          onSuccess: (response) => {
            if (response?.status === 200) {
              window.open(response?.data?.pdf_url, "_blank");
            } else {
              Swal.fire("Error", response.message, "error");
            }
          },
        }
      );
    }
    if (isComposite) {
      postDownloadCompositeMutation.mutate(
        {
          id: userData?.profile?.user_id,
        },
        {
          onSuccess: (response) => {
            if (response?.status === 200) {
              window.open(response?.data?.pdf_url, "_blank");
            } else {
              Swal.fire("Error", response.data.message, "error");
            }
          },
        }
      );
    }
  };

  return (
    <>
      {[3, 4].includes(verticalId) && (
        <TrainingStatusTracker
          trackerData={getApplicationStatusTracker?.data?.data}
        />
      )}

      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex gap-4 items-start">
          <div className="flex-shrink-0">
            <HiCheckCircle className="size-12 text-emerald-600" />
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <h3 className="text-xl font-bold text-emerald-900">Thank You!</h3>
            <p className="text-emerald-700 text-sm">
              We appreciate your time and effort in completing this process.
              Your form has been successfully submitted with :
            </p>

            {!isExamScheduled && (
              <p className="text-sm !font-mono font-semibold text-emerald-600 bg-white px-2 py-2 rounded w-fit">
                Application ID: {applicationNo}
              </p>
            )}

            {(isNewAgentType || isComposite) && (
              <button
                type="button"
                onClick={handleDownload}
                className="w-fit flex-shrink-0 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm md:text-base"
              >
                <FaDownload className="w-4 h-4" />
                <span className="">
                  Download {isNewAgentType ? "1A" : "1B"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {userData?.declaration?.check && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex gap-4 items-start">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <h4 className="font-semibold text-emerald-900 mb-1">
                Download Your Consent Document
              </h4>

              <p className="text-sm text-emerald-700 mb-3">
                Save your signed consent form for your records. You'll need it
                for future reference.
              </p>

              <UiButton
                buttonType="tertiary"
                text={"Download Now"}
                icon={<MoveRight strokeWidth={1.5} className="size-4" />}
                onClick={() => {
                  generateApplication({ id: +userData?.profile?.user_id });
                }}
                isLoading={generatePdfPending}
                disabled={generatePdfPending}
                className="text-sm font-medium !text-blue-600 hover:!text-blue-800 transition-colors flex items-center gap-1"
              />
            </div>
          </div>
        </div>
      )}

      {!isCompositeAndTransfer && (
        <div className="w-full md:flex gap-4 lg:flex sm:gap-4">
          <section className="w-full p-2 md:w-[40%] lg:w-[60%]">
            {viewDoc && (
              <div className="flex mb-4">
                <BackButton type="button" onClick={() => setViewDoc(false)}>
                  <HiOutlineArrowNarrowLeft size={16} /> Back
                </BackButton>
              </div>
            )}

            <div className="flex items-center gap-2.5">
              {!viewDoc && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4  rounded-lg">
                  {fileArray.length > 0 ? (
                    fileArray.map((item) => (
                      <div
                        className="flex flex-col items-center justify-between gap-5 border border-gray-200 rounded-lg  p-4 shadow-sm"
                        key={item.id}
                        onClick={() => setViewDoc(item.id)}
                      >
                        <img
                          src={trainingImg}
                          alt="training"
                          className="w-full object-contain"
                        />
                        <Button width="100%" variant="outlined">
                          View {item.name.replace(/_/g, " ")}
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 my-auto text-center text-gray-500">
                      No training documents available.
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="w-full p-2 md:w-[60%] lg:w-[40%] lg:flex lg:gap-4">
            {!viewDoc && (
              <div className="bg-white w-full border border-gray-200 rounded-lg shadow-md">
                <section className="bg-gray-100 flex justify-between p-2">
                  <div className="p-2 flex flex-col gap-1 rounded-t-lg">
                    <h2 className="font-bold text-base flex items-center">
                      Training Instructions
                    </h2>
                    <TrainingTimer
                      agentId={userData?.profile?.user_id}
                      isFls={isFls}
                      agentType={agentType}
                      time={time}
                      setTime={setTime}
                    />
                  </div>
                  {time === 0 && (
                    <UiButton
                      buttonType="secondary"
                      icon={<Download className="size-4" />}
                      className="border border-lightGray text-xs flex flex-row-reverse rounded-lg p-1 px-2 items-center justify-center"
                      text={"Download TCC"}
                      onClick={() => {
                        generateTrainingPdfMutation.mutate({
                          user_id: userData?.profile?.user_id,
                        });
                      }}
                    />
                  )}
                </section>

                <div className="p-2">
                  <div className="flex items-start gap-3 mb-1 border border-extraLightGray rounded-lg p-2">
                    <div className="flex items-center justify-center p-2 rounded-full bg-[#ede9fe]">
                      <HiClock color="#7c3aed" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold">
                        Mandatory Training
                      </h2>
                      <p className="text-xs text-body">
                        Every Agent should complete 25 hours of mandatory
                        training.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mb-1 border border-extraLightGray rounded-lg p-2">
                    <div className="flex items-center justify-center p-2 rounded-full bg-[#e0e7ff]">
                      <HiSpeakerphone color="#3b82f6" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold">
                        Exam Notification
                      </h2>
                      <p className="text-xs text-body">
                        Once your exam is scheduled, you will be notified on
                        this page.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 mb-1 border border-extraLightGray rounded-lg p-2">
                    <div className="flex items-center justify-center p-2 rounded-full bg-[#dbeafe]">
                      <HiBookOpen color="#1d4ed8" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold">
                        Learning Resources
                      </h2>
                      <p className="text-xs text-body">
                        Happy Learning! Access all resources through the cards
                        below.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      )}

      {fileArray.map(
        (item) =>
          viewDoc === item.id && (
            <iframe
              key={item.id}
              src={item.file + "#toolbar=0"}
              width="100%"
              height="500px"
            />
          )
      )}
      {/* <ButtonWrapper>
        <Button
          width={"auto"}
          onClick={() => dispatch(setAgentName("Discrepancy"))}
        >
          Next
        </Button>
      </ButtonWrapper> */}
    </>
  );
};

export default TrainingPageIndex;
