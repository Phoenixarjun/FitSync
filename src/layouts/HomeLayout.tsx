import React, {useState, useEffect} from 'react'
import Sidebar from '@/components/Sidebar/Sidebar'
import LandingSection from '@/components/HomePage/LandingSection'
import Banner from '@/components/HomePage/Banner'
import CaloriesBurned from '@/components/HomePage/CaloriesBurned'

export default function HomeLayout() {
  const [isVerified, setIsVerified] = useState(false);

  const checkVerification = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setIsVerified(!!parsedUser?.isVerified);
      } catch {
        setIsVerified(false);
      }
    } else {
      setIsVerified(false);
    }
  };

  useEffect(() => {
    checkVerification();

    const handleStorageChange = () => checkVerification();
    window.addEventListener('storage', handleStorageChange);

    const interval = setInterval(checkVerification, 1000); 

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);


  return (
    <div className='flex h-full'>   
      <Sidebar />
      <div  className="flex flex-col items-center justify-center gap-20 min-h-screen w-full bg-cover relative"
      style={{ backgroundImage: "url('/gym2.jpg')" }}
      aria-label="Background gym image">
        <div className="absolute inset-0 bg-black opacity-60 z-0 pointer-events-none" />
        <Banner />
        <LandingSection />
        {isVerified && (
          <CaloriesBurned />
        )}
      </div>
      
    </div>
  )
}
