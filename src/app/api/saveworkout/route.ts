import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Work from '@/models/Work';

export async function POST(request: NextRequest) {
  await connectDB();

  try {
    const body = await request.json();
    
    if (!body.userId) {
      return NextResponse.json(
        { message: 'User ID is required' },
        { status: 400 }
      );
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Check if user already worked out today
    const todayWorkout = await Work.findOne({
      userId: body.userId,
      createdAt: {
        $gte: new Date(currentDate),
        $lt: new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
      }
    });

    if (todayWorkout) {
      return NextResponse.json(
        { message: 'Workout already logged for today' },
        { status: 400 }
      );
    }

    // Get the user's most recent workout stats
    const lastWorkout = await Work.findOne({ userId: body.userId })
      .sort({ createdAt: -1 })
      .exec();

    let stats = {
      currentStreak: 1,
      bestStreak: 1,
      consistencyScore: 1,
      lastWorkoutDate: currentDate
    };

    if (lastWorkout && lastWorkout.stats) {
      const lastDate = new Date(lastWorkout.stats.lastWorkoutDate);
      lastDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        // Consecutive day - increment streak and add to consistency score (Fibonacci-style)
        stats.currentStreak = lastWorkout.stats.currentStreak + 1;
        stats.consistencyScore = lastWorkout.stats.consistencyScore + stats.currentStreak;
      } else if (diffDays > 1) {
        // Broken streak - reset but add 1 to consistency score
        stats.consistencyScore = lastWorkout.stats.consistencyScore + 1;
      } else {
        // Same day (shouldn't happen due to earlier check)
        stats = lastWorkout.stats;
      }

      // Update best streak if current is better
      stats.bestStreak = Math.max(stats.currentStreak, lastWorkout.stats.bestStreak);
    }

    const workout = new Work({
      ...body, 
      stats,
      createdAt: currentDate
    });

    await workout.save();

    return NextResponse.json({
      message: 'Workout saved successfully',
      stats: {
        streak: stats.currentStreak,
        best: stats.bestStreak,
        score: stats.consistencyScore
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving workout:', error);
    return NextResponse.json(
      { message: 'Failed to save workout', error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json(
      { message: 'User ID is required' },
      { status: 400 }
    );
  }

  try {
    // Get the user's most recent workout stats
    const lastWorkout = await Work.findOne({ userId })
      .sort({ createdAt: -1 })
      .exec();

    if (!lastWorkout) {
      return NextResponse.json({
        streak: 0,
        best: 0,
        score: 0
      });
    }

    return NextResponse.json({
      streak: lastWorkout.stats.currentStreak,
      best: lastWorkout.stats.bestStreak,
      score: lastWorkout.stats.consistencyScore
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { message: 'Failed to fetch stats', error: (error as Error).message },
      { status: 500 }
    );
  }
}