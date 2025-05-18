"use client"
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import HomeLayout from "@/layouts/HomeLayout";

export default function Home() {
  return (
    <div>
      <Navbar />
      <HomeLayout />
      <Footer />
    </div>
  );
}