import React from "react";
import { useState } from "react";
import Image from "next/image";


export default function Navbar() {
  return(
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100 shadow-blue-500/50">
      <Image src="/logoTransparentBg.png" alt="Logo" width={100} height={100} className="mx-auto mb-4" />
      <div>
        <ul>
          <li>Home</li>
          <li>Profile</li>
          <div>
            <li>Verify</li>
          </div>
          
        </ul>
      </div>
    </div>
  )
}