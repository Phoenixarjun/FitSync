import { useEffect, useState } from "react";
import { useUser } from '@/context/UserContext';
import Loader from "../Loader";
export default function CaloriesBurned() {

  const { user } = useUser();
  const [calories, setCalories] = useState({
    total: 0,
    cardio: 0,
    weightTraining: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalories = async () =>{
      if (!user?.userId) return;
      try{
        const response = await fetch(`/api/saveworkout?userId=${user.userId}`);
        const data = await response.json();
        if (response.ok) {
          setCalories({
            total: data.totalCalories || 0,
            cardio: data.CardioCalories || 0,
            weightTraining: data.StrengthCalories || 0
          });
        }
      }catch (error) {
        console.error('Failed to fetch calories:', error);
      }finally{
        setLoading(false);
      }
    };
    fetchCalories();
  },[user?.userId]);

  if (loading) {
    return (
      <div className="z-10 w-full max-w-6xl mx-auto mt-10 px-4">
        <h1 className="text-3xl font-bold text-center text-white mb-6">Track Your Burn 🔥</h1>
        <Loader />
      </div>
    );
  }
  return (
    <div className="z-10 w-full max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-center text-white mb-6">Track Your Burn 🔥</h1>

      <div className="flex flex-col items-center justify-center md:flex-row gap-6">
        <div className="flex-1 bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 text-white">
          <h2 className="text-xl font-semibold mb-2 text-[#ff914d]">Total Calories Burned</h2>
          <p className="text-4xl font-bold">{calories.total} kcal</p>
          <p className="text-sm opacity-70 mt-1">Today's session summary</p>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/20 text-white">
            <h3 className="text-lg font-semibold mb-1 text-[#ff914d]">Cardio</h3>
            <p className="text-2xl font-bold">{calories.cardio} kcal</p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/20 text-white">
            <h3 className="text-lg font-semibold mb-1 text-[#ff914d]">Weight Training</h3>
            <p className="text-2xl font-bold">{calories.weightTraining} kcal</p>
          </div>
        </div>
      </div>
    </div>
  );
}
