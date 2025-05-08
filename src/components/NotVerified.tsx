"use client";
import Link from "next/link";

export default function NotVerified() {
  return (
    <div className="flex items-center justify-center w-full h-full py-8 px-4">
      <div className="flex flex-col items-center">
        <img src="NotLoggedIn.png" alt="Not Verified" className="w-md" />
        <h1 className="text-2xl font-bold text-gray-300">Account Not Verified</h1>
        <p className="mt-4 text-gray-300 text-center">
          Please verify your account to continue. Use the <span className="text-cyan-400">verify</span>  option in the navigation bar or create a new account below.
        </p>
        <Link href="/profile">
          <button className="mt-8 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Login</button>
        </Link>
      </div>
    </div>
  );
}
