import { useEffect, useRef, useState } from "react";
import ExamStart from "./ExamStart";
import ResultScreen from "./ResultScreen";
import WarningModal from "./Warning";
import SideBarExam from "./SideBarExam";
import QuestionCard from "./QuestionCard";
import { usePOSExamQuestion, usePosExamSubmit } from "../service";

// Set a consistent timer for all questions (in seconds)
const QUESTION_TIME_LIMIT = 15;

export default function POSExam({
  register,
  handleSubmit,
  setValue,
  watch,
  reset,
}) {
  // React Hook Form setup for all question-related data
  const { data: questionsData = [], mutate: mutateQuestions } =
    usePOSExamQuestion();

  useEffect(() => {
    if (questionsData?.length > 0)
      setValue("posexam", {
        ...watch("posexam"),
        questions: questionsData,
        currentQuestionIndex: 0,
        score: 0,
        answers: {},
        warningCount: 0,
        examTimeLimit: QUESTION_TIME_LIMIT * questionsData.length,
      });
  }, [questionsData]);

  const { mutate, isPending } = usePosExamSubmit();


  // Watch form values
  const formQuestions = questionsData;
  const formAnswers = watch("posexam.answers");
  const formPassingPercentage = watch("posexam.passing_percentage");
  const formTotalQuestions = watch("posexam.number_of_questions");
  const formCurrentQuestionIndex = watch("posexam.currentQuestionIndex");
  const formWarningCount = watch("posexam.warningCount");
  const examTime = +watch("posexam.exam_time");

  // Regular useState for UI state
  const [examStarted, setExamStarted] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [examTimeRemaining, setExamTimeRemaining] = useState(+examTime * 60);

  // Use a ref to track the timer interval
  const timerIntervalRef = useRef(null);
  const fullscreenRef = useRef(null);
  const maxWarnings = 3;

  const currentQuestion = formQuestions[formCurrentQuestionIndex];

  // Format time as minutes:seconds
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Start the timer
  const startTimer = () => {
    // Clear any existing interval first
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // Start a new interval
    timerIntervalRef.current = setInterval(() => {
      setExamTimeRemaining((prev) => {
        if (prev <= 1) {
          // Clear the interval when time is up
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
          }
          // Finish the exam in the next render cycle
          setTimeout(() => finishExam(), 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Stop the timer
  const stopTimer = () => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  };

  // Handle fullscreen and visibility changes
  useEffect(() => {
    if (!examStarted || examCompleted) return;

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleWarning("You exited fullscreen mode");
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleWarning("You changed tabs or minimized the window");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [examStarted, examCompleted]);

  // Handle exam timer
  useEffect(() => {
    if (!examStarted || examCompleted) {
      stopTimer();
      return;
    }

    // Start the timer when exam starts
    startTimer();

    // Clean up on unmount
    return () => stopTimer();
  }, [examStarted, examCompleted]);

  // Handle warnings
  const handleWarning = (message) => {
    // Directly increment the warning count without relying on the current state
    const newWarningCount = +watch("posexam.warningCount") + 1;

    if (+newWarningCount < +maxWarnings) {
      setValue("posexam.warningCount", +newWarningCount);
      setWarningMessage(message);
      setShowWarning(true);
    } else {
      setValue("posexam.warningCount", +newWarningCount); // Make sure to update the count for the results screen
      finishExam();
    }
  };

  // Close warning modal
  const closeWarning = () => {
    setShowWarning(false);

    // Request fullscreen again if exam is still in progress
    if (examStarted && !examCompleted && fullscreenRef.current) {
      fullscreenRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    }
  };

  // Start the exam
  const startExam = () => {
    mutateQuestions();
    setExamStarted(true);
    setValue("posexam.warningCount", 0);
    setExamTimeRemaining(examTime * 60);
    setValue("posexam.currentQuestionIndex", 0);
    setValue("posexam.answers", {});
  };

  useEffect(() => {
    if (examStarted) {
      fullscreenRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    }
  }, [examStarted]);

  // Handle answer selection
  const handleAnswerSelect = (answer) => {
    const updatedAnswers = {
      ...formAnswers,
      [currentQuestion?.id]: answer,
    };
    setValue("posexam.answers", updatedAnswers);
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (formCurrentQuestionIndex <= formQuestions.length - 1) {
      
      setValue("posexam.currentQuestionIndex", formCurrentQuestionIndex + 1);
    } else {
      finishExam();
    }
  };

  // Navigate to previous question
  const handlePreviousQuestion = () => {
    if (formCurrentQuestionIndex > 0) {
      setValue("posexam.currentQuestionIndex", formCurrentQuestionIndex - 1);
    }
  };

  // Finish the exam and calculate score
  const finishExam = (data) => {
    if (formQuestions.length === formCurrentQuestionIndex) {
      // Stop the timer
      stopTimer();

      // Exit fullscreen
      if (document.fullscreenElement) {
        document.exitFullscreen().catch((err) => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
      }
      mutate({ answers: data?.posexam?.answers });
      setExamCompleted(true);
    }
  };

  // Restart the exam
  const restartExam = () => {
    setValue("posexam", {
      ...watch("posexam"),
      questions: questionsData,
      currentQuestionIndex: 0,
      score: 0,
      answers: {},
      warningCount: 0,
      timeLimit: QUESTION_TIME_LIMIT,
      examTimeLimit: QUESTION_TIME_LIMIT * questionsData.length,
    });
    setExamCompleted(false);
    setExamStarted(false);
    setExamTimeRemaining(examTime);
    setShowWarning(false);
    setSidebarOpen(false);
  };

  // If exam is not started, show start screen
  if (!examStarted) {
    return (
      <ExamStart
        onStart={startExam}
        totalQuestions={formTotalQuestions}
        examTime={examTime}
        formPassingPercentage={formPassingPercentage}
      />
    );
  }

  // If exam is completed, show results
  if (examCompleted) {
    return (
      <ResultScreen
        score={watch("score")}
        totalQuestions={formTotalQuestions}
        onRestart={restartExam}
        answers={formAnswers}
        questions={formQuestions}
        warningCount={formWarningCount}
      />
    );
  }

  return (
    <div
      ref={fullscreenRef}
      className="min-h-screen flex flex-col md:flex-row bg-gray-50"
    >
      {/* Warning Modal */}
      {showWarning && (
        <WarningModal
          message={warningMessage}
          warningCount={formWarningCount}
          maxWarnings={maxWarnings}
          onClose={closeWarning}
        />
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed md:relative inset-y-0 left-0 z-50 md:z-0 w-72 md:w-64 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } transition-transform duration-300 ease-in-out`}
      >
        <SideBarExam
          totalQuestions={formQuestions.length}
          currentQuestionIndex={formCurrentQuestionIndex}
          answeredQuestions={Object.keys(formAnswers).map(Number)}
          goToQuestion={(index) => {
            setValue("posexam.currentQuestionIndex", index);
            setSidebarOpen(false);
          }}
          warningCount={formWarningCount}
          maxWarnings={maxWarnings}
          examTimeRemaining={examTimeRemaining}
          onCloseSidebar={() => setSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {/* Mobile Sidebar Toggle */}
              <button
                type="button"
                onClick={toggleSidebar}
                className="mr-3 md:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              <h1 className="text-xl font-semibold text-gray-800">MCQ Exam</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4 overflow-x-auto">
              <div className="text-sm font-medium px-2 sm:px-3 py-1 bg-blue-50 text-blue-700 rounded-full flex items-center whitespace-nowrap">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="hidden sm:inline">Time:</span>{" "}
                {formatTime(examTimeRemaining)}
              </div>
              <div className="text-sm font-medium px-2 sm:px-3 py-1 bg-green-50 text-green-700 rounded-full whitespace-nowrap">
                <span className="hidden sm:inline">Question</span>{" "}
                {formCurrentQuestionIndex + 1}/{formQuestions.length}
              </div>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            <form onSubmit={handleSubmit(finishExam)}>
              <QuestionCard
                question={currentQuestion}
                selectedAnswer={formAnswers[currentQuestion?.id] || ""}
                onSelectAnswer={handleAnswerSelect}
                register={register}
              />

              <div className="mt-6 md:mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={handlePreviousQuestion}
                  disabled={formCurrentQuestionIndex === 0}
                  className={`px-3 sm:px-5 py-2 rounded-md font-medium transition-all ${
                    formCurrentQuestionIndex === 0
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>

                <button
                  type="submit"
                  onClick={handleNextQuestion}
                  className="px-3 sm:px-5 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  {formCurrentQuestionIndex < formQuestions.length - 1
                    ? "Next Question"
                    : "Finish Exam"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
