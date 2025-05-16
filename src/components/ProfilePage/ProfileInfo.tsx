"use client";
import { FiEdit } from "react-icons/fi";
import { FaWeight, FaRulerVertical, FaVenusMars } from "react-icons/fa";
import { RiUser3Fill } from "react-icons/ri";
import { IoMdFitness } from "react-icons/io";
import { useUser } from "@/context/UserContext";
import { useState } from "react";
import UpdateProfileForm from "./UpdateProfileForm";
import UpdateProfilePhoto from "./UpdateProfilePhoto";

export default function ProfileInfo() {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPhoto, setIsEditingPhoto] = useState(false);
  
  if (!user) {
    return <div className="text-red-500">User data not found</div>;
  }

  const formatBMI = (bmi: number) => {
    if (typeof bmi !== 'number' || isNaN(bmi)) return "0.0";
    return bmi.toFixed(1);
  };

  const formattedData = {
    name: user.name || "Unknown",
    age: user.age || 0,
    sex: user.sex || "Not specified",
    weight: `${user.weight || 0} kg`,
    height: `${user.height || 0} cm`,
    bmi: formatBMI(user.bmi),
    username: user.username || "",
    profilePhoto: user.profilePhoto || "",
    joinDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    fitnessLevel: getFitnessLevel(user.bmi || 0),
    isVerified: user.isVerified || false
  };

  function getFitnessLevel(bmi: number): string {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 25) return "Normal";
    if (bmi >= 25 && bmi < 30) return "Overweight";
    return "Obese";
  }

  if (isEditing) {
    return <UpdateProfileForm onCancel={() => setIsEditing(false)} />;
  }

  if (isEditingPhoto) {
    return <UpdateProfilePhoto onCancel={() => setIsEditingPhoto(false)} />;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-purple-600 to-blue-500">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                {formattedData.profilePhoto ? (
                  <img 
                    src={formattedData.profilePhoto} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full border-4 border-gray-800 object-cover shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-gray-800 bg-gray-700 flex items-center justify-center shadow-xl">
                    <RiUser3Fill className="text-gray-400 text-5xl" />
                  </div>
                )}
                <button 
                  onClick={() => setIsEditingPhoto(true)}
                  className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow-md transition-all transform hover:scale-110"
                >
                  <FiEdit className="text-lg" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white">{formattedData.name}</h1>
                <p className="text-gray-400">@{formattedData.username}</p>
              </div>
              <span className="bg-purple-600/30 text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
                {formattedData.fitnessLevel}
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard 
                icon={<FaWeight className="text-blue-400 text-xl" />} 
                label="Weight" 
                value={formattedData.weight} 
              />
              <StatCard 
                icon={<FaRulerVertical className="text-green-400 text-xl" />} 
                label="Height" 
                value={formattedData.height} 
              />
              <StatCard 
                icon={<IoMdFitness className="text-yellow-400 text-xl" />} 
                label="BMI" 
                value={formattedData.bmi} 
              />
              <StatCard 
                icon={<FaVenusMars className="text-pink-400 text-xl" />} 
                label="Gender" 
                value={formattedData.sex} 
              />
            </div>

            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <FiEdit /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="bg-gray-700/30 hover:bg-gray-700/50 p-4 rounded-xl transition-colors">
      <div className="flex items-center gap-3">
        <div className="bg-gray-800 p-2 rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-gray-400 text-sm">{label}</p>
          <p className="text-white font-semibold">{value}</p>
        </div>
      </div>
    </div>
  );
}