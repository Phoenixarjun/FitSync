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

    const workoutData = workouts.map((w) => {
      const date = new Date(w.createdAt).toISOString().split('T')[0];

      const cardio = w.calories?.cardio || 0;
      const weight = w.calories?.weight || 0;
      const total = cardio + weight;

      return {
        date,
        totalCalories: total,
        cardioCalories: cardio,
        weightCalories: weight,
        consistencyScore: w.stats?.consistencyScore || 0
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
