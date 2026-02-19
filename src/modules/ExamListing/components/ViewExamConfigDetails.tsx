import UiButton from "@/UI-Components/Buttons/UiButton";
import UiDrawerWrapper from "@/UI-Components/Drawer/UiDrawer";
import { ArrowLeft, BookOpenText, Cross, View, X } from "lucide-react";

const ViewExamConfigDetails = ({
  isOpen,
  handleClose,
  viewData,
}: {
  isOpen: boolean;
  handleClose: () => void;
  viewData: any;
}) => {

   const timePerQuestion= Math.round(viewData?.data?.exam_time/viewData?.data?.number_of_questions) 
  return (
    <UiDrawerWrapper
      HeadSection={
        <>
          <section className="flex justify-between gap-3 text-sm bg-extraLightGray p-4 rounded-t-xl">
         
            <div className="flex items-center justify-center gap-2">
              <BookOpenText className="size-6 text-primary/60" />
              <p className="text-lg font-semibold text-gray-800">
                Exam Config Details
              </p>
            </div>
             <UiButton
              buttonType="tertiary"
              icon={<X className="size-5" />}
              className="w-7 h-7 rounded-full flex flex-row-reverse hover:bg-primary hover:text-white"
              onClick={()=>handleClose()}
            />
          </section>
        </>
      }
      isOpen={isOpen}
      containerClass="w-[50%]"
      handleClose={handleClose}>
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 mt-2">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Exam Configuration Summary
        </h3>

        <div className="space-y-4">
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-600 text-sm">User Type:</span>
            <span className="font-medium text-gray-800">
              {viewData?.data?.type || "N/A"}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-600 text-sm">Number of Questions:</span>
            <span className="font-medium text-gray-800 truncate ">
              {viewData?.data?.number_of_questions || "--"}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-600 text-sm">Passing Percentage:</span>
            <span className="font-medium text-gray-800 truncate">
              {viewData?.data?.passing_percentage || "--"}
            </span>
          </div>

          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-600 text-sm">Exam Duration:</span>
            <span className="font-medium text-gray-800">{viewData?.data?.exam_time ?? "0"}</span>
          </div>

          <div className="mt-4 pt-2 bg-light-color  rounded-md">
            <h4 className="text-sm font-medium text-primary mb-2">
              Time Management
            </h4>
            <div className="space-y-2 text-sm">
              {/* <div className="flex justify-between">
                <span className="text-gray-600">Pace:</span>
                <span className="font-medium">
                  {viewData?.data?.questionPace ?? "0"} per minute
                </span>
              </div> */}
              <div className="flex justify-between">
                <span className="text-gray-600">Time per Question:</span>
                <span className="font-medium">
                  {timePerQuestion ?? "--"} minutes each
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UiDrawerWrapper>
  );
};

export default ViewExamConfigDetails;
