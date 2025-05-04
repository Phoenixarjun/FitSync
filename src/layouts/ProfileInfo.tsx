"use client";
import { FiEdit } from "react-icons/fi";
import { FaWeight, FaRulerVertical, FaBirthdayCake, FaVenusMars } from "react-icons/fa";
import { RiUser3Fill } from "react-icons/ri";
import { IoMdFitness } from "react-icons/io";

export default function ProfileInfo() {
  // Dummy data - this will be replaced with actual data from your form
  const profileData = {
    name: "Alex Johnson",
    age: 28,
    sex: "Male",
    weight: "75 kg",
    height: "178 cm",
    bmi: "23.7",
    username: "alexfit",
    profilePhoto: "", // Leave empty to show placeholder
    joinDate: "March 15, 2023",
    fitnessLevel: "Intermediate",
    goals: ["Build muscle", "Improve endurance"]
  };

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl overflow-hidden shadow-2xl">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-purple-600 to-blue-500">
            <div className="absolute -bottom-16 left-8">
              <div className="relative">
                {profileData.profilePhoto ? (
                  <img 
                    src={profileData.profilePhoto} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full border-4 border-gray-800 object-cover shadow-xl"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-gray-800 bg-gray-700 flex items-center justify-center shadow-xl">
                    <RiUser3Fill className="text-gray-400 text-5xl" />
                  </div>
                )}
                <button className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow-md transition-all transform hover:scale-110">
                  <FiEdit className="text-lg" />
                </button>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white">{profileData.name}</h1>
                <p className="text-gray-400">@{profileData.username}</p>
              </div>
              <span className="bg-purple-600/30 text-purple-400 px-3 py-1 rounded-full text-sm font-medium">
                {profileData.fitnessLevel}
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard 
                icon={<FaWeight className="text-blue-400 text-xl" />} 
                label="Weight" 
                value={profileData.weight} 
              />
              <StatCard 
                icon={<FaRulerVertical className="text-green-400 text-xl" />} 
                label="Height" 
                value={profileData.height} 
              />
              <StatCard 
                icon={<IoMdFitness className="text-yellow-400 text-xl" />} 
                label="BMI" 
                value={profileData.bmi} 
              />
              <StatCard 
                icon={<FaVenusMars className="text-pink-400 text-xl" />} 
                label="Gender" 
                value={profileData.sex} 
              />
            </div>

            <div className="mt-8 flex justify-end">
              <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                <FiEdit /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Stat Card Component
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

// Reusable Info Section Component
function InfoSection({ title, content }: { title: string, content: React.ReactNode | string }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <div className="text-gray-300">
        {typeof content === 'string' ? <p>{content}</p> : content}
      </div>
    </div>
  );
}