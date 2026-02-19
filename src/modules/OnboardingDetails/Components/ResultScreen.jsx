export default function ResultScreen({
  score,
  totalQuestions,
  onRestart,
  answers,
  questions,
  warningCount,
}) {
  const percentage = Math.round((score / totalQuestions) * 100);
  const isPassing = percentage >= 60;

  return (
    <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div
          className={`p-4 sm:p-6 ${
            isPassing ? "bg-green-600" : "bg-red-600"
          } text-white`}
        >
          <div className="flex items-center justify-center">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isPassing ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              )}
            </svg>
            <h1 className="ml-3 text-xl sm:text-2xl font-bold">
              Exam {isPassing ? "Passed" : "Failed"}
            </h1>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {isPassing ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 text-center mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-green-700 mb-2">
                Congratulations!
              </h3>
              <p className="text-green-600 mb-6">
                You have successfully passed the exam with a score of{" "}
                {percentage}%.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100 flex-1 max-w-xs">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                    Your Score
                  </h4>
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">
                    {percentage}%
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {score} out of {totalQuestions} correct
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-green-100 flex-1 max-w-xs">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                    Passing Score
                  </h4>
                  <div className="text-2xl sm:text-3xl font-bold text-green-600">
                    60%
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {Math.ceil(totalQuestions * 0.6)} out of {totalQuestions}{" "}
                    required
                  </p>
                </div>
              </div>

              {warningCount > 0 && (
                <div className="mt-6 inline-block px-4 py-2 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-amber-700 text-sm">
                    Warnings received during exam: {warningCount}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 text-center mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-red-700 mb-2">
                Exam Not Passed
              </h3>
              <p className="text-red-600 mb-6">
                You scored {percentage}%, which is below the passing score of
                60%.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-red-100 flex-1 max-w-xs">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                    Your Score
                  </h4>
                  <div className="text-2xl sm:text-3xl font-bold text-red-600">
                    {percentage}%
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {score} out of {totalQuestions} correct
                  </p>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm border border-red-100 flex-1 max-w-xs">
                  <h4 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                    Needed to Pass
                  </h4>
                  <div className="text-2xl sm:text-3xl font-bold text-red-600">
                    60%
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    {Math.ceil(totalQuestions * 0.6)} out of {totalQuestions}{" "}
                    required
                  </p>
                </div>
              </div>

              {warningCount > 0 && (
                <div className="mt-6 inline-block px-4 py-2 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-amber-700 text-sm">
                    Warnings received during exam: {warningCount}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-center">
            <button
              onClick={onRestart}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors flex items-center text-sm sm:text-base"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Take Exam Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
