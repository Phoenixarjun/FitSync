"use client";
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUser } from "@/context/UserContext";
import { TbLoader3 } from "react-icons/tb";
import { FiArrowLeft, FiUpload } from "react-icons/fi";

export default function UpdateProfilePhoto({ onCancel }: { onCancel: () => void }) {
  const { user, setUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [preview, setPreview] = useState(user?.profilePhoto || '');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg']
    },
    maxFiles: 1
  });

  const handleSubmit = async () => {
    if (!preview || !user?.username) return;

    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/editUserInfo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, profilePhoto: preview }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Update failed');
      }

      setIsSuccess(true);
      setMessage('Profile photo updated successfully!');
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
          <button 
            onClick={onCancel}
            className="flex items-center text-gray-400 hover:text-white transition-colors"
          >
            <FiArrowLeft className="mr-2" />
          </button>
          <h2 className="text-2xl font-bold">Update Profile Photo</h2>
          <div className="w-8"></div>
        </div>

        {/* Display Username */}
        <div className="text-white text-center text-lg font-medium">
        <span className="text-purple-400">{user?.username}</span>
        </div>

        <div className="mt-8 space-y-6">
          <div 
            {...getRootProps()} 
            className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
          >
            <input {...getInputProps()} />
            {preview ? (
              <div className="flex flex-col items-center">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
                <p className="text-gray-400">Click or drag to replace photo</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <FiUpload className="text-4xl text-gray-400 mb-4" />
                <p className="text-gray-400">Drag and drop a photo here, or click to select</p>
              </div>
            )}
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
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || !preview}
              className={`px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2 ${(isSubmitting || !preview) ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSubmitting && <TbLoader3 className="animate-spin" />}
              Save Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
