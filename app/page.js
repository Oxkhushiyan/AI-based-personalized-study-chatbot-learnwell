//app/page.js
'use client';

import { useState } from 'react';
import Onboarding from './components/Onboarding';
import ChatInterface from './components/ChatInterface';

export default function Home() {
  const [userInfo, setUserInfo] = useState(null);

  const handleOnboardingComplete = (info) => {
    setUserInfo(info);
  };

  return (
    <div className="h-screen">
      {!userInfo ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <ChatInterface userInfo={userInfo} />
      )}
    </div>
  );
}