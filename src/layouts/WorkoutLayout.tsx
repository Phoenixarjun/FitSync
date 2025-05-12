import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import WorkoutForm from '@/components/Workout/WorkoutForm';
import NotVerified from '@/components/NotVerified';
import ChatBot from '@/components/ChatBot';

export default function HomeLayout() {
  const [isVerified, setIsVerified] = useState(false);
  const [isWorkoutDone, setIsWorkoutDone] = useState(false);

  const checkVerification = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsVerified(!!parsedUser?.isVerified);
      } catch {
        setIsVerified(false);
      }
    } else {
      setIsVerified(false);
    }
  };

  useEffect(() => {
    checkVerification();

    const handleStorageChange = () => checkVerification();
    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(checkVerification, 1000); 

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className='flex items-center'>
      {
        isVerified ? (
          <WorkoutForm setIsWorkoutDone={setIsWorkoutDone} />
        ) : (
          <NotVerified />
        )
      }
      <Sidebar />
      <ChatBot /> 
    </div>
  );
}
