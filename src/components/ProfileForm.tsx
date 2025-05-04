"use client";

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useDropzone } from 'react-dropzone';
import { FaLock } from "react-icons/fa6";
import { TbLoader3 } from "react-icons/tb";
import bcrypt from 'bcryptjs';

export default function ProfileForm({ handleIsProfileCreated }: { handleIsProfileCreated: (status: boolean) => void }) {

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    sex: '',
    weight: '',
    height: '',
    bmi: '',
    profilePhoto: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileUpload = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, profilePhoto: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.png', '.jpg'] as const }, 
    onDrop: handleFileUpload,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    
    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match!');
      setIsSubmitting(false);
      return;
    }

  
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
  
      // Success case
      setIsSuccess(true);
      setMessage(data.message);
      setFormData({
        name: '',
        age: '',
        sex: '',
        weight: '',
        height: '',
        bmi: '',
        profilePhoto: '',
        username: '',
        password: '',
        confirmPassword: ''
      });
      setTimeout(() => {
        handleIsProfileCreated(true); 
      }, 3000); 
  
    } catch (error: any) {
      console.error('Registration error:', error);
      setMessage(error.message || 'An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 bg-gray p-10 rounded-xl shadow-2xl transform transition-all duration-500 hover:scale-[1.01]">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-white">
            Create Your Profile
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Fill in your details to get started
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="John Doe"
                required
              />
            </div>

            {/* Age and Sex in one row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-300 mb-1">
                  Age
                </label>
                <input
                  id="age"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="25"
                  required
                />
              </div>
              <div>
                <label htmlFor="sex" className="block text-sm font-medium text-gray-300 mb-1">
                  Sex
                </label>
                <select
                  id="sex"
                  name="sex"
                  value={formData.sex}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            {/* Weight and Height in one row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-300 mb-1">
                  Weight (kg)
                </label>
                <input
                  id="weight"
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="70"
                  required
                />
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-300 mb-1">
                  Height (cm)
                </label>
                <input
                  id="height"
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="175"
                  required
                />
              </div>
            </div>

            {/* BMI */}
            <div>
              <label htmlFor="bmi" className="block text-sm font-medium text-gray-300 mb-1">
                BMI
              </label>
              <input
                id="bmi"
                type="number"
                name="bmi"
                value={formData.bmi}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="22.5"
                required
              />
            </div>

            {/* Profile Photo (Upload) */}
            <div>
              <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-300 mb-1">
                Profile Photo
              </label>
              <div {...getRootProps()} className="border-2 border-dashed border-gray-600 rounded-lg p-4 cursor-pointer bg-gray-700 text-white">
                <input {...getInputProps()} id="profilePhoto" name="profilePhoto" type="file" />
                {formData.profilePhoto ? (
                  <div className="mt-4">
                    <img src={formData.profilePhoto} alt="Profile Preview" className="w-24 h-24 rounded-full mx-auto" />
                  </div>
                ) : (
                  <p className="text-center text-gray-400">Drag and drop a photo, or click to select</p>
                )}
              </div>
            </div>

            {/* Username and Password */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="johndoe"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
            {/* Confirm Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                ConfirmPassword
              </label>
              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="••••••••"
                required
              />
            </div>
          </div>
          {isSuccess && <div><p>{message}</p></div>}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isSubmitting ? (
                  <TbLoader3 className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'/>

                ) : (
                  <FaLock className="h-5 w-5 text-purple-300 group-hover:text-purple-200"/>
                )}
              </span>
              {isSubmitting ? 'Submitting...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
