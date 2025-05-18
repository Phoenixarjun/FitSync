"use client"
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WorkoutLayout from "@/layouts/WorkoutLayout";

export default function Home() {
  return (
    <div>
      <Navbar />
      <WorkoutLayout />
      <Footer />
    </div>
    
  );
}
