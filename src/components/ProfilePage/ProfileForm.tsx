"use client";
import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { TbLoader3 } from "react-icons/tb";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function ProfileForm({
  handleIsProfileCreated
}: {
  handleIsProfileCreated: (status: boolean) => void
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const { fetchUserData } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    // Calculate password strength whenever password changes
    if (formData.password) {
      let strength = 0;
      
      // Length check
      if (formData.password.length >= 8) strength += 1;
      
      // Contains number
      if (/\d/.test(formData.password)) strength += 1;
      
      // Contains uppercase
      if (/[A-Z]/.test(formData.password)) strength += 1;
      
      // Contains special char
      if (/[^A-Za-z0-9]/.test(formData.password)) strength += 1;
      
      setPasswordStrength(strength);
    } else {
      setPasswordStrength(0);
    }
  }, [formData.password]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Validate fields on change
    const newErrors = { ...errors };
    
    if (name === 'email') {
      const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (!emailRegex.test(value)) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        delete newErrors.email;
      }
    }

    if (name === 'age') {
      const ageNum = Number(value);
      if (isNaN(ageNum)) {
        newErrors.age = 'Age must be a number';
      } else if (ageNum < 13 || ageNum > 120) {
        newErrors.age = 'Age must be between 13 and 120';
      } else {
        delete newErrors.age;
      }
    }

    if (name === 'weight') {
      const weightNum = Number(value);
      if (isNaN(weightNum)) {
        newErrors.weight = 'Weight must be a number';
      } else if (weightNum < 30 || weightNum > 300) {
        newErrors.weight = 'Weight must be between 30kg and 300kg';
      } else {
        delete newErrors.weight;
      }
    }

    if (name === 'height') {
      const heightNum = Number(value);
      if (isNaN(heightNum)) {
        newErrors.height = 'Height must be a number';
      } else if (heightNum < 100 || heightNum > 250) {
        newErrors.height = 'Height must be between 100cm and 250cm';
      } else {
        delete newErrors.height;
      }
    }

    if (name === 'bmi') {
      const bmiNum = Number(value);
      if (isNaN(bmiNum)) {
        newErrors.bmi = 'BMI must be a number';
      } else if (bmiNum < 10 || bmiNum > 50) {
        newErrors.bmi = 'BMI must be between 10 and 50';
      } else {
        delete newErrors.bmi;
      }
    }

    setErrors(newErrors);
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
    maxFiles: 1,
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // Validate form before submission
    if (Object.keys(errors).length > 0) {
      setMessage('Please fix the errors in the form');
      setIsSubmitting(false);
      return;
    }

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

      setIsSuccess(true);
      setMessage(data.message);
      localStorage.setItem('user', JSON.stringify({ username: data.user.username, isVerified: true }));
      await fetchUserData(data.user.username);
      handleIsProfileCreated(true);
      router.push('/profile');
    } catch (error) {
      console.error('Registration error:', error);
      setMessage(error instanceof Error ? error.message : 'An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0: return 'bg-gray-500';
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0: return '';
      case 1: return 'Weak';
      case 2: return 'Moderate';
      case 3: return 'Strong';
      case 4: return 'Very Strong';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center ">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-xl shadow-2xl transform transition-all duration-500 hover:scale-[1.01] border border-gray-700">
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

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="john@example.com"
                required
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
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
                  min="13"
                  max="120"
                  className="appearance-none relative block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="25"
                  required
                />
                {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
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
                  min="30"
                  max="300"
                  className="appearance-none relative block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="70"
                  required
                />
                {errors.weight && <p className="mt-1 text-sm text-red-500">{errors.weight}</p>}
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
                  min="100"
                  max="250"
                  className="appearance-none relative block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="175"
                  required
                />
                {errors.height && <p className="mt-1 text-sm text-red-500">{errors.height}</p>}
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
                min="10"
                max="50"
                step="0.1"
                className="appearance-none relative block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="22"
                required
              />
              {errors.bmi && <p className="mt-1 text-sm text-red-500">{errors.bmi}</p>}
            </div>

            {/* Profile Photo (Upload) */}
            <div>
              <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-300 mb-1">
                Profile Photo
              </label>
              <div {...getRootProps()} className="border-2 border-dashed border-gray-600 rounded-lg p-4 cursor-pointer bg-gray-700 text-white hover:border-purple-500 transition-colors duration-200">
                <input {...getInputProps()} id="profilePhoto" name="profilePhoto" type="file" />
                {formData.profilePhoto ? (
                  <div className="mt-4">
                    <Image 
                      src={formData.profilePhoto} 
                      alt="Profile Preview" 
                      width={96}
                      height={96}
                      className="w-24 h-24 rounded-full mx-auto object-cover"
                    />
                    <p className="text-center text-gray-400 mt-2">Click to change photo</p>
                  </div>
                ) : (
                  <p className="text-center text-gray-400">Drag and drop a photo, or click to select</p>
                )}
              </div>
            </div>

            {/* Username */}
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

            {/* Password with toggle */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {/* Password strength indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div 
                        key={i}
                        className={`h-1 flex-1 rounded-full ${i <= passwordStrength ? getPasswordStrengthColor() : 'bg-gray-600'}`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs mt-1 ${getPasswordStrengthColor().replace('bg', 'text')}`}>
                    {getPasswordStrengthText()}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password with toggle */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none relative block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-10"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">Passwords don&apos;t match!</p>
              )}
            </div>
          </div>
          
          {message && (
            <div className={`text-sm ${isSuccess ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </div>
          )}
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting || Object.keys(errors).length > 0}
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