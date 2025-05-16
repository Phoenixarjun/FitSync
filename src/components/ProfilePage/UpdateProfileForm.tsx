"use client";
import { useState, useEffect } from 'react';
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { TbLoader3 } from "react-icons/tb";
import { FiArrowLeft } from "react-icons/fi";

export default function UpdateProfileForm({ onCancel }: { onCancel: () => void }) {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    name: '',
    age: '',
    sex: '',
    weight: '',
    height: '',
    bmi: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        name: user.name || '',
        age: user.age?.toString() || '',
        sex: user.sex || '',
        weight: user.weight?.toString() || '',
        height: user.height?.toString() || '',
        bmi: user.bmi?.toString() || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/editUserInfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          name: formData.name,
          age: Number(formData.age),
          sex: formData.sex,
          weight: Number(formData.weight),
          height: Number(formData.height),
          bmi: Number(formData.bmi),
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Update failed');

      setIsSuccess(true);
      setMessage('Profile updated successfully!');
      setUser(data.user);

      setTimeout(() => {
        onCancel();
      }, 2000);
    } catch (error: any) {
      console.error('Update error:', error);
      setMessage(error.message || 'An error occurred during update');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-xl shadow-2xl">
        <div className="flex items-center justify-between gap-6">
          <button onClick={onCancel} className="flex items-center text-gray-400 hover:text-white transition-colors">
            <FiArrowLeft className="mr-2" />
          </button>
          <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
          <div className="w-8" />
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">Username</label>
              <input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            {/* Age and Sex */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1">Age</label>
                <input
                  id="age"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="sex" className="block text-sm font-medium text-gray-300 mb-1">Sex</label>
                <select
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  required
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Weight and Height */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-1">Weight (kg)</label>
                <input
                  id="weight"
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  required
                />
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-1">Height (cm)</label>
                <input
                  id="height"
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  required
                />
              </div>
            </div>

            {/* BMI */}
            <div>
              <label htmlFor="bmi" className="block text-sm font-medium text-gray-300 mb-1">BMI</label>
              <input
                id="bmi"
                type="number"
                name="bmi"
                value={formData.bmi}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white"
                required
              />
            </div>
          </div>

          {message && (
            <div className={`text-sm ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </div>
          )}

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSubmitting && <TbLoader3 className="animate-spin" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
