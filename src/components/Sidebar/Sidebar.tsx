import React from 'react';
import { useUser } from '@/context/UserContext';
import Calendar from '../Sidebar/Calendar';
import Streak from './Streak';
import { RiUser3Fill } from 'react-icons/ri';
import { FaVenusMars, FaWeight, FaRulerVertical } from 'react-icons/fa';
import { IoMdFitness } from 'react-icons/io';
import { MdVerified } from 'react-icons/md';

export default function Sidebar() {
  const { user } = useUser();

  const getFitnessLevel = (bmi: number): string => {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 25) return "Normal";
    if (bmi >= 25 && bmi < 30) return "Overweight";
    return "Obese";
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen max-w-md bg-gray-800/50 backdrop-blur-lg shadow-2xl shadow-white/20 p-6">
        <div className="text-gray-300 text-center">Please login to view your profile</div>
      </div>
    );
  }

  const fitnessLevel = getFitnessLevel(user.bmi || 0);
  const fitnessLevelColor = {
    Underweight: 'text-blue-400',
    Normal: 'text-green-400',
    Overweight: 'text-yellow-400',
    Obese: 'text-red-400'
  }[fitnessLevel];

  return (
    <div className="flex flex-col  min-h-screen w-96 bg-gray-800/50 backdrop-blur-lg shadow-2xl shadow-white/20 p-6">
      {/* User Profile Section */}
      <div className="flex flex-col items-center mb-8">

        
        {/* Profile Image */}
        <div className="relative mb-4">
          {user.profilePhoto ? (
            <img 
              src={user.profilePhoto} 
              alt="Profile" 
              className="w-24 h-24 rounded-full border-4 border-purple-500/50 object-cover shadow-lg"
            />
          ) : (
            <div className="w-24 h-24 rounded-full border-4 border-purple-500/50 bg-gray-700 flex items-center justify-center shadow-lg">
              <RiUser3Fill className="text-gray-400 text-4xl" />
            </div>
          )}
          {user.isVerified && (
            <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
              <MdVerified className="text-white text-sm" />
            </div>
          )}
        </div>

        {/* User Details */}
          <div className="flex flex-col justify-between items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{user.name}</h3>
            <span className={`text-sm px-2 py-1 rounded-full ${fitnessLevelColor} bg-gray-700/50`}>
              {fitnessLevel}
            </span>
          </div>
        </div>

      {/* Divider */}
      <div className="border-t border-gray-700 my-2"></div>

      <Streak />

      {/* Calendar Section */}
      <div className="flex-1">
        <h2 className="text-xl font-bold text-white mb-4 text-center">Workout Calendar</h2>
        <Calendar />
      </div>
    </div>
  );
}