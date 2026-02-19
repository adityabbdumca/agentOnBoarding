export default function ExamStart({
  onStart,
  totalQuestions,
  examTime,
  formPassingPercentage,
}) {
  return (
    <div className="flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-blue-600 p-4 sm:p-6">
          <div className="flex items-center justify-center">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h1 className="ml-3 text-xl sm:text-2xl font-bold text-white">
              MCQ Examination
            </h1>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-100">
              <h2 className="text-base sm:text-lg font-semibold text-blue-800 mb-2 flex items-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Exam Details
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-blue-800">
                <li className="flex items-center">
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                  Total Questions: {totalQuestions ?? "--"}
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Total Exam Time: {examTime} minutes
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Passing Score: {formPassingPercentage}%
                </li>
              </ul>
            </div>

            <div className="bg-amber-50 p-3 sm:p-4 rounded-lg border border-amber-100">
              <h2 className="text-base sm:text-lg font-semibold text-amber-800 mb-2 flex items-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Important Notes
              </h2>
              <ul className="space-y-2 text-xs sm:text-sm text-amber-800">
                <li className="flex items-center">
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Exam will open in full-screen mode
                </li>
                <li className="flex items-start">
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  3 warnings for exiting fullscreen/changing tabs
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Auto-submission after 3rd warning
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-200 mb-6">
            <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 flex items-center">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              Instructions
            </h2>
            <ul className="space-y-1 text-xs sm:text-sm text-gray-700 list-disc pl-5">
              <li>Read each question carefully before answering.</li>
              <li>
                You can navigate between questions using the sidebar or
                navigation buttons.
              </li>
              <li>You can change your answers before submitting the exam.</li>
              <li>
                Click "Finish Exam" on the last question to submit your answers.
              </li>
              <li>
                Your results will be displayed immediately after submission.
              </li>
            </ul>
          </div>

          <div className="flex justify-center">
            <button
              onClick={onStart}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center text-sm sm:text-base">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Start Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
