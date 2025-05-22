"use client"
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import DietChart from '@/components/DietPage/DietChart';
import ChatBot from '@/components/ChatBot';
import { FiSidebar } from 'react-icons/fi';

export default function DietLayout() {
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
    <div className="flex h-full relative">
      {/* Sidebar Toggle Button */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="absolute cursor-pointer right-4 -top-15 z-50 p-3 bg-gray-800/80 rounded-full shadow-lg hover:bg-gray-700 transition-colors"
        >
          <FiSidebar className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Main Section with background */}
      <div
        className="flex flex-col items-center justify-center min-h-screen w-full bg-cover relative p-10"
        style={{ backgroundImage: "url('/dietBg.jpg')" }}
        aria-label="Background gym image"
      >
        <div className="absolute inset-0 bg-black opacity-60 z-0 pointer-events-none" />
        
        {isVerified && (
          <div className="z-10 w-full max-w-4xl">
            <DietChart />
          </div>
        )}
      </div>

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <ChatBot />
    </div>
  );
}
