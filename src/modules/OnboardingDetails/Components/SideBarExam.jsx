"use client";

export default function SideBarExam({
  totalQuestions,
  currentQuestionIndex,
  answeredQuestions,
  goToQuestion,
  warningCount,
  maxWarnings,
  onCloseSidebar,
}) {
  return (
    <div className="w-full h-full bg-white border-r border-gray-200 flex flex-col max-h-screen overflow-hidden">
      {/* Logo/Title with close button for mobile */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h1 className="ml-2 text-lg font-bold text-gray-800">Exam Portal</h1>
        </div>
        {/* Close button for mobile */}
        {onCloseSidebar && (
          <button
            onClick={onCloseSidebar}
            className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
            aria-label="Close sidebar"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Progress Indicator */}
        <div className="p-4">
          <h2 className="text-sm font-medium text-gray-500 mb-3">
            EXAM PROGRESS
          </h2>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                  {Math.round(
                    (answeredQuestions.length / totalQuestions) * 100
                  )}
                  %
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-blue-600">
                  {answeredQuestions.length}/{totalQuestions} Questions
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
              <div
                style={{
                  width: `${
                    (answeredQuestions.length / totalQuestions) * 100
                  }%`,
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
              ></div>
            </div>
          </div>
        </div>

        {/* Warning Status */}
        <div className="px-4 pb-4">
          <h2 className="text-sm font-medium text-gray-500 mb-2">WARNINGS</h2>
          <div className="flex items-center space-x-1">
            {Array.from({ length: maxWarnings }).map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full ${
                  index < warningCount ? "bg-red-500" : "bg-gray-200"
                } transition-colors`}
              ></div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {warningCount} of {maxWarnings} warnings received
          </p>
        </div>

        {/* Question Navigation */}
        <div className="px-4 py-4 border-t border-gray-200">
          <h2 className="text-sm font-medium text-gray-500 mb-3">QUESTIONS</h2>
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mb-4">
            {Array.from({ length: totalQuestions }).map((_, index) => {
              const questionNumber = index + 1;
              const isActive = index === currentQuestionIndex;
              const isAnswered = answeredQuestions.includes(questionNumber);

              return (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-full h-10 flex items-center justify-center rounded-md transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700 font-medium"
                      : isAnswered
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  aria-label={`Go to question ${questionNumber}`}
                >
                  {questionNumber}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
