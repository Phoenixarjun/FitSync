"use client";
import React from "react";
import Image from "next/image";
import { useUser } from "@/context/UserContext";
import Calendar from "../Sidebar/Calendar";
import Streak from "./Streak";
import { RiUser3Fill } from "react-icons/ri";
import { MdVerified } from "react-icons/md";
import { FiX } from "react-icons/fi";
import NotVerified from "../NotVerified";

export default function Sidebar({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { user } = useUser();

  const getFitnessLevel = (bmi: number): string => {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 25) return "Normal";
    if (bmi >= 25 && bmi < 30) return "Overweight";
    return "Obese";
  };

  const fitnessLevel = getFitnessLevel(user?.bmi || 0);
  const fitnessLevelColor = {
    Underweight: "text-blue-400",
    Normal: "text-green-400",
    Overweight: "text-yellow-400",
    Obese: "text-red-400",
  }[fitnessLevel];

  return (
    <div
      className={`fixed inset-y-0 right-0 w-96 bg-gray-800/90 backdrop-blur-lg shadow-2xl z-40 transition-transform duration-300 ease-in-out transform ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <button
        onClick={onClose}
        className="absolute top-4 left-4 text-gray-400 hover:text-white p-1 cursor-pointer"
      >
        <FiX className="w-6 h-6" />
      </button>

      {!user ? (
        <div className="flex items-center justify-center h-full px-6 text-center text-gray-300">
          <NotVerified />
        </div>
      ) : (
        <div className="p-6 h-full overflow-y-auto scrollbar-hide">
          {/* User Profile */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative mb-4">
              {user.profilePhoto ? (
                <Image
                  src={user.profilePhoto}
                  alt="Profile photo"
                  width={96}
                  height={96}
                  className="rounded-full border-4 border-purple-500/50 object-cover shadow-lg"
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

            <div className="flex flex-col justify-between items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{user.name}</h3>
              <span className={`text-sm px-2 py-1 rounded-full ${fitnessLevelColor} bg-gray-700/50`}>
                {fitnessLevel}
              </span>
            </div>
          </div>

          <div className="border-t border-gray-700 my-2"></div>

          <Streak />

          <div className="mt-6">
            <h2 className="text-xl font-bold text-white mb-4 text-center">Workout Calendar</h2>
            <Calendar />
          </div>
        </div>
      )}
    </div>
  );
}
