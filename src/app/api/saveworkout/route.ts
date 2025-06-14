import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Work, { AllWorkouts, CardioExercise, WeightExercise, UserStats } from '@/models/Work';
import { Decimal128 } from 'mongodb';

// Helper to properly format workout data including weight exercises
function formatWorkoutResponse(workout: AllWorkouts | null) {
  if (!workout) return null;

  return {
    ...workout.toObject(),
    currentWeight: workout.currentWeight ? parseFloat(workout.currentWeight.toString()) : 0,
    cardio: workout.cardio || [],
    weight: workout.weight instanceof Map
      ? Object.fromEntries(workout.weight.entries())
      : (workout.weight || {}),
    calories: workout.calories || {
      total: 0,
      cardio: 0,
      weight: 0
    }
  };
}

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

    // Normalize the date to midnight UTC
    const workoutDate = body.createdAt ? new Date(body.createdAt) : new Date();
    const normalizedDate = new Date(Date.UTC(
      workoutDate.getFullYear(),
      workoutDate.getMonth(),
      workoutDate.getDate()
    ));

    // Check if this is today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = normalizedDate.getTime() === today.getTime();

    // Date range for querying existing workouts
    const startOfDay = new Date(normalizedDate);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Find existing workout for this date
    const existingWorkout = await Work.findOne({
      userId: body.userId,
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    });

    // If trying to create a new workout for today and one already exists
    if (isToday && existingWorkout && !body._id) {
      return NextResponse.json(
        { 
          message: 'You have already logged a workout for today. You can only update previous dates.',
          existingWorkoutId: existingWorkout._id,
          workout: formatWorkoutResponse(existingWorkout)
        },
        { status: 400 }
      );
    }

    // For existing workouts (updating)
    if (body._id) {
      const updateData = {
        $set: {
          cardio: body.cardio as CardioExercise[],
          weight: new Map(Object.entries(body.weight)) as Map<string, WeightExercise[]>,
          currentWeight: Decimal128.fromString(body.currentWeight?.toString() || '0'),
          calories: body.calories,
          ...(isToday && {
            stats: existingWorkout?.stats || {
              currentStreak: 1,
              bestStreak: 1,
              consistencyScore: 1,
              lastWorkoutDate: normalizedDate
            } as UserStats
          })
        }
      };

      const updatedWorkout = await Work.findByIdAndUpdate(
        body._id,
        updateData,
        { new: true }
      );

      // If updating today's workout, we might need to update streaks
      if (isToday) {
        return await updateStreaks(updatedWorkout as AllWorkouts, body.userId);
      }

      return NextResponse.json({
        message: 'Workout updated successfully',
        workout: formatWorkoutResponse(updatedWorkout)
      }, { status: 200 });
    }

    // For new workouts (either today without existing, or past dates without existing)
    const stats: UserStats = {
      currentStreak: 1,
      bestStreak: 1,
      consistencyScore: 1,
      lastWorkoutDate: normalizedDate
    };

    // Calculate streaks for both today and past dates
    const lastWorkout = await Work.findOne({ userId: body.userId })
      .sort({ createdAt: -1 })
      .exec();

    if (lastWorkout?.stats) {
      const lastDate = new Date(lastWorkout.stats.lastWorkoutDate);
      lastDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((normalizedDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        stats.currentStreak = lastWorkout.stats.currentStreak + 1;
        stats.consistencyScore = lastWorkout.stats.consistencyScore + stats.currentStreak;
      } else if (diffDays > 1) {
        stats.currentStreak = 1;
        stats.consistencyScore = lastWorkout.stats.consistencyScore + 1;
      }

      stats.bestStreak = Math.max(stats.currentStreak, lastWorkout.stats.bestStreak);
    }

    const workout = new Work({
      ...body,
      weight: new Map(Object.entries(body.weight)) as Map<string, WeightExercise[]>,
      currentWeight: Decimal128.fromString(body.currentWeight?.toString() || '0'),
      stats: stats,
      createdAt: normalizedDate
    });

    await workout.save();

    return NextResponse.json({
      message: isToday ? 'Workout saved successfully' : 'Historical workout saved successfully',
      stats: {
        streak: stats.currentStreak,
        best: stats.bestStreak,
        score: stats.consistencyScore,
      },
      workout: formatWorkoutResponse(workout)
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving workout:', error);
    return NextResponse.json(
      { message: 'Failed to save workout', error: (error as Error).message },
      { status: 500 }
    );
  }
}

async function updateStreaks(workout: AllWorkouts, userId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastWorkoutBeforeToday = await Work.findOne({
      userId,
      createdAt: { $lt: today }
    }).sort({ createdAt: -1 }).exec();

    const stats: UserStats = workout.stats || {
      currentStreak: 1,
      bestStreak: 1,
      consistencyScore: 1,
      lastWorkoutDate: today
    };

    if (lastWorkoutBeforeToday?.stats) {
      const lastDate = new Date(lastWorkoutBeforeToday.stats.lastWorkoutDate);
      lastDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        stats.currentStreak = lastWorkoutBeforeToday.stats.currentStreak + 1;
        stats.consistencyScore = lastWorkoutBeforeToday.stats.consistencyScore + stats.currentStreak;
      } else if (diffDays > 1) {
        stats.currentStreak = 1;
        stats.consistencyScore = lastWorkoutBeforeToday.stats.consistencyScore + 1;
      }

      stats.bestStreak = Math.max(stats.currentStreak, lastWorkoutBeforeToday.stats.bestStreak);
    }

    const updatedWorkout = await Work.findByIdAndUpdate(
      workout._id,
      { $set: { stats } },
      { new: true }
    );

    return NextResponse.json({
      message: 'Today\'s workout updated with streak information',
      stats: {
        streak: stats.currentStreak,
        best: stats.bestStreak,
        score: stats.consistencyScore,
      },
      workout: formatWorkoutResponse(updatedWorkout)
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating streaks:', error);
    return NextResponse.json(
      { message: 'Workout saved but failed to update streaks', error: (error as Error).message },
      { status: 200 }
    );
  }
}

export async function GET(request: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const date = searchParams.get('date');

  if (!userId) {
    return NextResponse.json(
      { message: 'User ID is required' },
      { status: 400 }
    );
  }

  try {
    if (date) {
      const requestedDate = new Date(date);
      const startOfDay = new Date(Date.UTC(
        requestedDate.getFullYear(),
        requestedDate.getMonth(),
        requestedDate.getDate()
      ));
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const workout = await Work.findOne({
        userId,
        createdAt: { $gte: startOfDay, $lt: endOfDay }
      });

      return NextResponse.json({
        workout: formatWorkoutResponse(workout),
        exists: !!workout
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayWorkout = await Work.findOne({
      userId,
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const lastWorkout = await Work.findOne({ userId })
      .sort({ createdAt: -1 })
      .exec();

    const streak = lastWorkout?.stats?.currentStreak || 0;
    const best = lastWorkout?.stats?.bestStreak || 0;
    const score = lastWorkout?.stats?.consistencyScore || 0;

    return NextResponse.json({
      streak,
      best,
      score,
      totalCalories: todayWorkout?.calories?.total || 0,
      CardioCalories: todayWorkout?.calories?.cardio || 0,
      StrengthCalories: todayWorkout?.calories?.weight || 0,
      exists: !!todayWorkout,
      workout: formatWorkoutResponse(todayWorkout)
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { message: 'Failed to fetch stats', error: (error as Error).message },
      { status: 500 }
    );
  }
}