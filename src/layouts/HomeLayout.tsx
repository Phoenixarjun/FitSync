"use client"
import React, {useState, useEffect} from 'react'
import Sidebar from '@/components/Sidebar/Sidebar'
import LandingSection from '@/components/HomePage/LandingSection'
import Banner from '@/components/HomePage/Banner'
import CaloriesBurned from '@/components/HomePage/CaloriesBurned'
import WorkoutProgress from '@/components/HomePage/WorkoutProgress'
import ChatBot from '@/components/ChatBot' 
import { FiSidebar } from 'react-icons/fi'

export default function HomeLayout() {
  const [isVerified, setIsVerified] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
    <div className='flex h-full relative'>   
      {/* Sidebar Toggle Button (fixed position) */}
      {!sidebarOpen && <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute right-4 -top-15 z-50 p-3 bg-gray-800/80 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
      >
        <FiSidebar className="w-5 h-5 text-white" />
      </button>
}

      <div className="flex flex-col items-center justify-center gap-20 min-h-screen w-full bg-cover relative p-10"
        style={{ backgroundImage: "url('/gym2.jpg')" }}
        aria-label="Background gym image">
        <div className="absolute inset-0 bg-black opacity-60 z-0 pointer-events-none" />
        <Banner />
        <LandingSection />
        {isVerified && (
          <div className='z-10 flex flex-col items-center justify-center gap-20'>
            <CaloriesBurned />
            <WorkoutProgress />
          </div>
        )}
      </div>
      
      {/* Sidebar with toggle state */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <ChatBot /> 
    </div>
  )
}