// app/components/Onboarding.js
import { useState } from 'react';
import ProgressBar from './ProgressBar';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [userInfo, setUserInfo] = useState({
    ageRange: '',
    educationLevel: '',
    grade: '',
  });

  const steps = [
    {
      question: "Select Your Age Range to Begin:",
      options: ["6-10", "11-14", "15-18", "18+"],
      key: "ageRange",
    },
    {
      question: "What is your education level?",
      options: ["Elementary", "Middle School", "High School", "University"],
      key: "educationLevel",
    },
    {
      question: "What grade are you in?",
      options: ["1-5", "6-8", "9-12", "University"],
      key: "grade",
    },
  ];

  const handleOptionSelect = (option) => {
    setUserInfo({ ...userInfo, [steps[step].key]: option });
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete(userInfo);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-3xl font-bold mb-4">Welcome to LearnWell!</h1>
        <h2 className="text-xl mb-4">Your friendly chatbot, here to help you excel in your studies!</h2>
        <p className="text-lg mb-6">We&apos;re excited to get to know you better so we can create a personalized learning experience just for you.</p>
        <ProgressBar current={step + 1} total={steps.length} />
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">{steps[step].question}</h2>
          <div className="grid grid-cols-2 gap-4">
            {steps[step].options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-300"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
