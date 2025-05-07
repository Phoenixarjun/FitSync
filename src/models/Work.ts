import mongoose, { Schema, Document } from 'mongoose';

export interface CardioExercise {
  type: 'treadmill' | 'uprightBike' | 'crossTrainer';
  time: number;
  speed: number;
  distance: number;
  date: string;
}

export interface WeightExercise {
  name: string;
  category: string;
  sets: number;
  reps: number;
  customName?: string;
  date: string;
}

export interface UserStats {
  currentStreak: number;
  bestStreak: number;
  consistencyScore: number;
  lastWorkoutDate: Date;
}

export interface AllWorkouts extends Document {
  cardio: CardioExercise[];
  weight: Record<string, WeightExercise[]>;
  userId: string;
  stats: UserStats;
  createdAt: Date;
}

const CardioExerciseSchema = new Schema<CardioExercise>({
  type: { type: String, enum: ['treadmill', 'uprightBike', 'crossTrainer'], required: true },
  time: { type: Number, required: true },
  speed: { type: Number, required: true },
  distance: { type: Number, required: true },
  date: { type: String, required: true },
});

const WeightExerciseSchema = new Schema<WeightExercise>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: Number, required: true },
  customName: { type: String },
  date: { type: String, required: true },
});

const UserStatsSchema = new Schema<UserStats>({
  currentStreak: { type: Number, default: 0 },
  bestStreak: { type: Number, default: 0 },
  consistencyScore: { type: Number, default: 0 },
  lastWorkoutDate: { type: Date }
});

const WorkoutSchema = new Schema<AllWorkouts>({
  cardio: [CardioExerciseSchema],
  weight: { type: Map, of: [WeightExerciseSchema], required: true },
  userId: { type: String, required: true },
  stats: UserStatsSchema,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Work || mongoose.model<AllWorkouts>('Work', WorkoutSchema);