import React from "react";

const WarningModal = ({ message, warningCount, maxWarnings, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-4 sm:p-6 rounded-lg max-w-md w-full shadow-xl animate-bounce-once">
        <div className="flex items-center text-red-600 mb-4">
          <svg
            className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h2 className="text-lg sm:text-xl font-bold">
            Warning #{warningCount}!
          </h2>
        </div>

        <p className="mb-4 text-gray-700 text-sm sm:text-base">{message}</p>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Warning Count
            </span>
            <span className="text-xs sm:text-sm font-medium text-red-600">
              {warningCount} of {maxWarnings}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="h-2.5 rounded-full bg-red-600 transition-all duration-300"
              style={{ width: `${(warningCount / maxWarnings) * 100}%` }}
            ></div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-gray-500 mb-4">
          After {maxWarnings} warnings, your exam will be automatically
          submitted.
        </p>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Return to Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default WarningModal;
