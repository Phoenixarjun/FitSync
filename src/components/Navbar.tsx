// Navbar.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { MdVerified, MdCancel } from "react-icons/md";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { FiMenu } from 'react-icons/fi'

export default function Navbar() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shouldRegister, setShouldRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [navLinksOpen, setNavLinksOpen] = useState(false);
  const router = useRouter();
  const { user, fetchUserData, logout } = useUser();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setShouldRegister(false);

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.shouldRegister) {
          setShouldRegister(true);
        }
        throw new Error(data.message || "Verification failed");
      }

      localStorage.setItem(
        "user",
        JSON.stringify({
          username: data.data.username,
          isVerified: true,
          userId: data.data.userId,
        })
      );

      await fetchUserData(data.data.username);
      router.push("/profile");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Verification failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="flex items-center justify-center-safe py-3 shadow-xl/40 space-x-5 bg-gray-800 relative">
      {/* Mobile Nav Toggle Button (left side) */}
      <button 
        onClick={() => setNavLinksOpen(!navLinksOpen)}
        className="md:hidden absolute left-4 p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 cursor-pointer cursor-pointer"
      >
        <FiMenu className="w-6 h-6" />
      </button>

      {/* Mobile Nav Links (slides in from left) */}
      <div className={`fixed top-16 left-0 w-full bg-gray-800 shadow-lg z-50 transition-all duration-300 ease-in-out transform ${navLinksOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}>
        <div className="p-4 space-y-4">
          <Link href="/" className="block text-gray-300 hover:text-purple-400 transition-colors" onClick={() => setNavLinksOpen(false)}>
            Home
          </Link>
          <Link href="/workout" className="block text-gray-300 hover:text-purple-400 transition-colors" onClick={() => setNavLinksOpen(false)}>
            Workout
          </Link>
          <Link href="/diet" className="block text-gray-300 hover:text-purple-400 transition-colors" onClick={() => setNavLinksOpen(false)}>
            Diet
          </Link>
          <Link href="/profile" className="block text-gray-300 hover:text-purple-400 transition-colors" onClick={() => setNavLinksOpen(false)}>
            Profile
          </Link>
        </div>
      </div>

      <Link href="/" className="hover:opacity-80 transition-opacity">
        <Image
          src="/logoTransparentBg.png"
          alt="Logo"
          width={180}
          height={180}
          className="h-12 w-auto"
        />
      </Link>
      
      {/* Desktop Nav Links */}
      <div className="hidden md:block">
        <ul className="flex space-x-6 text-lg font-medium text-gray-300">
          <li>
            <Link href="/" className="hover:text-purple-400 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/workout"
              className="hover:text-purple-400 transition-colors"
            >
              Workout
            </Link>
          </li>
          <li>
            <Link
              href="/diet"
              className="hover:text-purple-400 transition-colors"
            >
              Diet
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="hover:text-purple-400 transition-colors"
            >
              Profile
            </Link>
          </li>
        </ul>
      </div>
      
      {/* Auth Section */}
      <div>
        {user ? (
          <div className="flex items-center space-x-2 cursor-pointer">
            <button
              onClick={logout}
              className="text-cyan-400 hover:text-purple-400 transition-colors cursor-pointer"
            >
              Logout
            </button>
            {user?.isVerified && (
              <MdVerified className="text-green-500 text-xl" />
            )}
          </div>
        ) : (
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <div className="flex justify-center items-center space-x-2 cursor-pointer">
                <span className="hover:text-purple-400 transition-colors">
                  Verify
                </span>
                <MdCancel className="text-red-500 text-xl" />
              </div>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="bg-black/50 fixed inset-0 z-50 backdrop-blur-sm m-5" />
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
                      User not found.{" "}
                      <Link
                        href="/register"
                        className="text-purple-400 hover:underline"
                      >
                        Register here
                      </Link>
                    </span>
                  ) : (
                    "Please enter your credentials to verify your account."
                  )}
                </Dialog.Description>

                {!shouldRegister && (
                  <form onSubmit={handleVerify} className="space-y-4">
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
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
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-300 mb-1"
                      >
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
                          className="px-4 py-2 text-gray-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                          disabled={isLoading}
                        >
                          Cancel
                        </button>
                      </Dialog.Close>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className={`px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium ${
                          isLoading ? "opacity-75 cursor-not-allowed" : ""
                        }`}
                      >
                        {isLoading ? "Verifying..." : "Verify Account"}
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
          </Dialog.Root>
        )}
      </div>
    </nav>
  );
}