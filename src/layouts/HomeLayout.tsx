import React from 'react'
import Sidebar from '@/components/Sidebar/Sidebar'
import LandingSection from '@/components/HomePage/LandingSection'

export default function HomeLayout() {
  return (
    <div className='flex items-center'>   
      <Sidebar />
      <LandingSection />
    </div>
  )
}
