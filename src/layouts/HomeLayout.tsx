import React, { useState } from 'react'
import Sidebar from '@/components/HomePage/Sidebar'
import { useUser } from '@/context/UserContext'
import WorkoutForm from '@/components/HomePage/WorkoutForm'
import WorkoutInfo from '@/components/HomePage/WorkoutInfo'


export default function HomeLayout() {

  const [isWorkoutDone, setIsWorkoutDone] = useState(false);

  return (
    <div className='flex items-center'>   
      <Sidebar />
      {isWorkoutDone ? (
          <WorkoutInfo setIsWorkoutDone={setIsWorkoutDone} />
          ) : (
          <WorkoutForm setIsWorkoutDone={setIsWorkoutDone} />
          )}
    </div>
  )
}