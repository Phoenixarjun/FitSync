import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Work from '@/models/Work';

export async function GET(request: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
  }

  try {
    const workouts = await Work.find({ userId }).sort({ createdAt: 1 }).lean();

    if (!workouts.length) {
      return NextResponse.json([], { status: 200 });
    }

    // Transform the data to match what your frontend expects
    const workoutData = workouts.map((workout) => {
      // Calculate date in YYYY-MM-DD format
      const date = new Date(workout.createdAt).toISOString().split('T')[0];
      
      // Get calories data (fallback to 0 if not present)
      const cardioCalories = workout.calories?.cardio || 0;
      const weightCalories = workout.calories?.weight || 0;
      const totalCalories = workout.calories?.total || (cardioCalories + weightCalories);

      return {
        date,
        totalCalories,
        cardioCalories,
        weightCalories,
        consistencyScore: workout.stats?.consistencyScore || 0,
        // Add any other fields you want to display
        streak: workout.stats?.currentStreak || 0,
        workoutTypes: [
          ...(workout.cardio?.map((c: { type: string }) => c.type) || []),
          ...Object.values(workout.weight || {}).flatMap(exercises => 
            Array.isArray(exercises) ? exercises.map(ex => ex.category) : []
          )
        ].filter(Boolean)
      };
    });

    return NextResponse.json(workoutData);
  } catch (error) {
    console.error('Workout Progress Fetch Error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch data', error: (error as Error).message },
      { status: 500 }
    );
  }
}