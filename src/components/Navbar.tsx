// components/Navbar.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { MdVerified, MdCancel } from "react-icons/md";

export default function Navbar() {
  const isVerified = false;

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
          <div className="flex justify-center items-center space-x-2">
            <li className="hover:text-purple-400 transition-colors">Verify</li>
            {isVerified ? (
              <MdVerified className="text-green-500 text-xl" />
            ) : (
              <MdCancel className="text-red-500 text-xl" />
            )}
          </div>
        </ul>
      </div>
    </nav>
  );
}
