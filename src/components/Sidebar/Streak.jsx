import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';

export default function Streak() {
  const { user } = useUser();
  const [stats, setStats] = useState({
    streak: 0,
    best: 0,
    score: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.userId) return;
      
      try {
        const response = await fetch(`/api/saveworkout?userId=${user.userId}`);
        const data = await response.json();
        
        if (response.ok) {
          setStats({
            streak: data.streak || 0,
            best: data.best || 0,
            score: data.score || 0
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user?.userId]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br text-white rounded-2xl p-6 w-full max-w-sm shadow-xl space-y-4">
        <h2 className="text-xl font-semibold tracking-wide text-center">🔥 Workout Consistency</h2>
        <div className="animate-pulse">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-800/60 p-4 rounded-xl h-24"></div>
            <div className="bg-gray-800/60 p-4 rounded-xl h-24"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br text-white rounded-2xl p-6 w-full max-w-sm shadow-xl space-y-4">
      <h2 className="text-xl font-semibold tracking-wide text-center">🔥 Workout Consistency</h2>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-800/60 p-4 rounded-xl">
          <p className="text-sm text-gray-200">Current Streak</p>
          <p className="text-xl font-bold">{stats.streak}</p>
          <div className="border-t border-gray-700 my-2"></div>
          <p className="text-sm text-gray-200">My Best🔥</p>
          <p className="text-xl font-bold">{stats.best}</p>
        </div>
        
        <div className="bg-gray-800/60 p-4 rounded-xl flex flex-col justify-center items-center gap-2">
          <p className="text-sm text-gray-200">Consistency Score</p>
          <p className="text-xl font-bold">{stats.score.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}