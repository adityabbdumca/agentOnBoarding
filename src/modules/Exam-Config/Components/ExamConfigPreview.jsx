const ExamConfigPreview = ({ watch }) => {
  const { type, number_of_questions, passing_percentage, exam_time } = watch();

  const requiredAnswers = Math.ceil(
    (number_of_questions * passing_percentage) / 100
  );

  const questionPace = Math.ceil(number_of_questions / exam_time);
  const timePerQuestion = Math.ceil(exam_time / number_of_questions);
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Exam Configuration Summary
      </h3>

      <div className="space-y-4">
        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="text-gray-600 text-sm">User Type:</span>
          <span className="font-medium text-gray-800">
            {type?.label || "N/A"}
          </span>
        </div>

        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="text-gray-600 text-sm">Number of Questions:</span>
          <span className="font-medium text-gray-800 truncate ">
            {number_of_questions}
          </span>
        </div>

        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="text-gray-600 text-sm">Passing Percentage:</span>
          <span className="font-medium text-gray-800 truncate">
            {passing_percentage}
          </span>
        </div>

        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="text-gray-600 text-sm">
            Required Correct Answers:
          </span>
          <span className="font-medium text-gray-800">{requiredAnswers}</span>
        </div>

        <div className="flex justify-between border-b border-gray-100 pb-2">
          <span className="text-gray-600 text-sm">Exam Duration:</span>
          <span className="font-medium text-gray-800">20</span>
        </div>

        <div className="mt-4 pt-2 bg-light-color  rounded-md">
          <h4 className="text-sm font-medium text-primary mb-2">
            Time Management
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Pace:</span>
              <span className="font-medium">{questionPace} per minute</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time per Question:</span>
              <span className="font-medium">
                {timePerQuestion} minutes each
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamConfigPreview;
