"use client"
import Navbar from "@/components/Navbar";
export default function Home() {
  return (
    <div>
      <Navbar  />
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1>Welcome to FitSync!</h1>
        {/* You can add more content here */}
      </div>
    </div>
  );
}
