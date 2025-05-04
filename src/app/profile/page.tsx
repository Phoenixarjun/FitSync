"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProfileForm from "@/components/ProfileForm";
import ProfileInfo from "@/layouts/ProfileInfo";

export default function Profile() {
  const [isProfileCreated, setIsProfileCreated] = useState(false);

  const handleIsProfileCreated = (status: boolean) => {
    setIsProfileCreated(status);
  }

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        {
          isProfileCreated ? (
            <ProfileInfo />
          ) : (
            <ProfileForm handleIsProfileCreated={handleIsProfileCreated} />
          )
        }
      </div>
    </div>
  );
}
