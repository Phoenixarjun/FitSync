import React, { useState } from 'react'
import Sidebar from '@/components/Sidebar/Sidebar'
import WorkoutForm from '@/components/Workout/WorkoutForm'


export default function HomeLayout() {

  const [isWorkoutDone, setIsWorkoutDone] = useState(false);

  return (
    <div className='flex items-center'>   
      <Sidebar />
      <WorkoutForm setIsWorkoutDone={setIsWorkoutDone} />
    </div>
  )
}