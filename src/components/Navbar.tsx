"use client";
import Link from "next/link";
import Image from "next/image";
import { MdVerified, MdCancel } from "react-icons/md";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

export default function Navbar() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shouldRegister, setShouldRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, fetchUserData, logout } = useUser();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setShouldRegister(false);

    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.shouldRegister) {
          setShouldRegister(true);
        }
        throw new Error(data.message || 'Verification failed');
      }

      localStorage.setItem('user', JSON.stringify({ username: data.data.username }));
      await fetchUserData(data.data.username);
      router.push('/profile');
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="flex items-center justify-center-safe py-3 shadow-xl/40 space-x-5 bg-gray-800">
      <Link href="/" className="hover:opacity-80 transition-opacity">
        <Image 
          src="/logoTransparentBg.png" 
          alt="Logo" 
          width={180} 
          height={180} 
          className="h-12 w-auto"
        />
      </Link>
      <div>
        <ul className="flex space-x-6 text-lg font-medium text-gray-300">
          <li>
            <Link href="/" className="hover:text-purple-400 transition-colors">Home</Link>
          </li>
          <li>
            <Link href="/profile" className="hover:text-purple-400 transition-colors">Profile</Link>
          </li>
          {user ? (
            <li>
              <button 
                onClick={logout}
                className="hover:text-purple-400 transition-colors"
              >
                Logout
              </button>
            </li>
          ) : (
            <Dialog.Root>
              <Dialog.Trigger asChild>
                <div className="flex justify-center items-center space-x-2 cursor-pointer">
                  <li className="hover:text-purple-400 transition-colors">Verify</li>
                  <MdCancel className="text-red-500 text-xl" />
                </div>
              </Dialog.Trigger>
              
              <Dialog.Portal>
              <Dialog.Portal>
              <Dialog.Overlay className="bg-black/50 fixed inset-0 z-50 backdrop-blur-sm" />
              <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 focus:outline-none">
                <div className="flex justify-between items-center mb-6">
                  <Dialog.Title className="text-2xl font-bold text-white">
                    Account Verification
                  </Dialog.Title>
                  <Dialog.Close asChild>
                    <button
                      className="text-gray-400 hover:text-white rounded-full p-1"
                      aria-label="Close"
                    >
                      <Cross2Icon className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </div>
                
                <Dialog.Description className="text-gray-300 mb-6">
                  {shouldRegister ? (
                    <span>
                      User not found. <Link href="/register" className="text-purple-400 hover:underline">Register here</Link>
                    </span>
                  ) : (
                    "Please enter your credentials to verify your account."
                  )}
                </Dialog.Description>
                
                {!shouldRegister && (
                  <form onSubmit={handleVerify} className="space-y-4">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                        Username
                      </label>
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Enter your username"
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
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        placeholder="Enter your password"
                        required
                      />
                    </div>
                    
                    {error && (
                      <div className="text-red-400 text-sm">{error}</div>
                    )}
                    
                    <div className="flex justify-end space-x-3 pt-4">
                      <Dialog.Close asChild>
                        <button 
                          type="button"
                          className="px-4 py-2 text-gray-300 hover:text-white rounded-lg transition-colors"
                          disabled={isLoading}
                        >
                          Cancel
                        </button>
                      </Dialog.Close>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium ${
                          isLoading ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {isLoading ? 'Verifying...' : 'Verify Account'}
                      </button>
                    </div>
                  </form>
                )}
                
                {shouldRegister && (
                  <div className="flex justify-center">
                    <Link 
                      href="/register"
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Go to Registration
                    </Link>
                  </div>
                )}
              </Dialog.Content>
            </Dialog.Portal>
              </Dialog.Portal>
            </Dialog.Root>
          )}
          {user?.isVerified && (
            <div className="flex items-center">
              <MdVerified className="text-green-500 text-xl" />
            </div>
          )}
        </ul>
      </div>
    </nav>
  );
}