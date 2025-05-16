import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import Loader from '../Loader';
import { useUser } from '@/context/UserContext';

interface WorkoutEntry {
  date: string;
  totalCalories: number;
  cardioCalories: number;
  weightCalories: number;
  consistencyScore: number;
  workoutTypes?: string[];
}

export default function WorkoutProgress() {
  const { user } = useUser();
  const userId = user?.userId;

  const [workoutData, setWorkoutData] = useState<WorkoutEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchWorkoutProgress = async () => {
      try {
        const response = await fetch(`/api/workoutProgressInfo?userId=${userId}`);
        if (!response.ok) throw new Error('Failed to fetch workout data');
        const data: WorkoutEntry[] = await response.json();
        setWorkoutData(data);
      } catch (error) {
        console.error('Error fetching workout progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutProgress();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  if (!workoutData.length) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">No workout data available</h2>
        <p className="text-gray-400">Start working out to see your progress!</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-white">
      <h1 className="text-3xl font-bold text-center mb-8">Your Workout Progress🔥</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Line Chart */}
        <ChartCard title="Total Calories Burned Over Time">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={workoutData}>
              <CartesianGrid stroke="#444" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: '#1f1f1f', border: 'none', color: '#fff' }} />
              <Legend />
              <Line
                type="monotone"
                dataKey="totalCalories"
                stroke="#00d8ff"
                strokeWidth={2}
                activeDot={{ r: 6 }}
                name="Total Calories"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar Chart */}
        <ChartCard title="Cardio vs Weight Training">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={workoutData}>
              <CartesianGrid stroke="#444" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: '#1f1f1f', border: 'none', color: '#fff' }} />
              <Legend />
              <Bar dataKey="cardioCalories" fill="#34d399" name="Cardio" />
              <Bar dataKey="weightCalories" fill="#818cf8" name="Weight" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Area Chart */}
        <ChartCard title="Workout Consistency">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={workoutData}>
              <CartesianGrid stroke="#444" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: '#1f1f1f', border: 'none', color: '#fff' }} />
              <Legend />
              <Area
                type="monotone"
                dataKey="consistencyScore"
                stroke="#facc15"
                fill="#facc15"
                name="Consistency"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Workout Types */}
        <ChartCard title="Workout Types">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={workoutData.map(item => ({
                date: item.date,
                count: item.workoutTypes?.length || 0
              }))}
            >
              <CartesianGrid stroke="#444" />
              <XAxis dataKey="date" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip contentStyle={{ backgroundColor: '#1f1f1f', border: 'none', color: '#fff' }} />
              <Legend />
              <Bar dataKey="count" fill="#fb7185" name="Workout Types" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 shadow-lg border border-white/20">
      <h3 className="text-xl font-semibold mb-4 text-center">{title}</h3>
      <div className="h-80">{children}</div>
    </div>
  );
}
