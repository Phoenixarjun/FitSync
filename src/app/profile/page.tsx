"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import ProfileForm from "@/components/ProfilePage/ProfileForm";
import ProfileInfo from "@/components/ProfilePage/ProfileInfo";
import { useUser } from "@/context/UserContext";
import Loader from "@/components/Loader";

export default function Profile() {
  const { user, loading } = useUser();
  const [isProfileCreated, setIsProfileCreated] = useState(false);

  useEffect(() => {
    if (user) {
      setIsProfileCreated(true);
    }
  }, [user]);

  const handleIsProfileCreated = (status: boolean) => {
    setIsProfileCreated(status);
  };

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
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        {isProfileCreated && user ? (
          <ProfileInfo />
        ) : (
          <ProfileForm handleIsProfileCreated={handleIsProfileCreated} />
        )}
      </div>
    </div>
  );
}