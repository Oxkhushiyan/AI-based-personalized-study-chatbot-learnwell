import { useState, useEffect } from 'react';

const QuizInterface = ({ topic, userInfo, onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic, userInfo }),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Failed to generate quiz');
        }
        if (Array.isArray(data.questions) && data.questions.length > 0) {
          setQuestions(data.questions);
        } else {
          throw new Error('Invalid quiz data received');
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [topic, userInfo]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading quiz...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error}</div>;
  }

  if (questions.length === 0) {
    return <div className="flex justify-center items-center h-screen">No questions available. Please try again.</div>;
  }

  if (quizCompleted) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-lg mb-4">Your score: {score} out of {questions.length}</p>
          <button
            onClick={onClose}
            className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded transition duration-300"
          >
            Return to Chat
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Quiz on {topic}</h2>
        <p className="text-lg mb-4">Question {currentQuestion + 1} of {questions.length}</p>
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <p className="text-lg font-medium">{currentQ.question}</p>
        </div>
        <div className="space-y-2 mb-4">
          {currentQ.answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-3 rounded transition duration-300 ${
                selectedAnswer === index
                  ? index === currentQ.correctAnswer
                    ? 'bg-green-700 text-white'
                    : 'bg-red-500 text-white'
                  : showExplanation && index === currentQ.correctAnswer
                  ? 'bg-green-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
              disabled={showExplanation}
            >
              {answer}
            </button>
          ))}
        </div>
        {showExplanation && (
          <div className="bg-blue-100 text-blue-800 p-4 rounded-lg mb-4">
            <p className="font-medium">Explanation:</p>
            <p>{currentQ.explanation}</p>
          </div>
        )}
        {showExplanation && (
          <button
            onClick={handleNextQuestion}
            className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded transition duration-300"
          >
            {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizInterface;
