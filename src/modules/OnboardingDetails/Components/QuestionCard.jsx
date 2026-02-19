const QuestionCard = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  register,
}) => {
  return (
    <div>
      {/* Question */}
      <div className="mb-6">
        <h2 className="text-lg md:text-xl font-medium text-gray-800 mb-2">
          Question {question?.id || 1}
        </h2>
        <p className="text-gray-700 bg-gray-50 p-3 md:p-4 rounded-lg border-l-4 border-blue-500 text-sm md:text-base">
          {question?.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2 md:space-y-3">
        {question?.option?.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const optionLabel = String.fromCharCode(65 + index);
          const inputId = `question-${question?.id}-option-${index}`;

          return (
            <div
              key={index}
              onClick={() => onSelectAnswer(option)}
              className={`p-3 md:p-4 rounded-lg cursor-pointer transition-all border ${
                isSelected
                  ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                  : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
              }`}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  id={inputId}
                  name={`question-${question?.id}-option${index}`}
                  value={option}
                  checked={isSelected}
                  onChange={() => onSelectAnswer(option)}
                  className="hidden"
                  {...(register
                    ? register(`posexam.answers.${question?.id}`)
                    : {})}
                />
                <div
                  className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center mr-3 ${
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {optionLabel}
                </div>
                <label
                  htmlFor={inputId}
                  className="text-gray-800 text-sm md:text-base cursor-pointer flex-1"
                >
                  {option}
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;
