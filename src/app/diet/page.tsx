"use client";
import Navbar from "@/components/Navbar";
import { useUser } from "@/context/UserContext";
import Loader from "@/components/Loader";
import DietLayout from "@/layouts/DietLayout"

export default function Diet() {
  const { user, loading } = useUser();



  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-white"> <Loader /> </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div>
        {user && (
          <DietLayout />
        )
      }
      </div>
    </div>
  );
}