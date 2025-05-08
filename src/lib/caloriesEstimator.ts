type CardioEntry = {
  type: string;
  time: number; // in minutes
  speed: number;
  distance: number;
};

type WeightEntry = {
  name: string;
  category: string;
  sets: number;
  reps: number;
};

type WorkoutData = {
  cardio: CardioEntry[];
  weight: Record<string, WeightEntry[]>;
  userWeightKg: number;
};

export function estimateCalories({
  cardio,
  weight,
  userWeightKg,
}: WorkoutData): {
  totalCalories: number;
  cardioCalories: number;
  weightCalories: number;
} {
  const MET_MAP = {
    treadmill: {
      walking: 3.5,
      jogging: 7,
      running: 11,
    },
    uprightBike: {
      light: 6,
      moderate: 8,
      vigorous: 12,
    },
    crossTrainer: 8.5,
    default: 6,
  };

  let cardioCalories = 0;

  for (const session of cardio) {
    let met = MET_MAP.default;

    if (session.type === 'treadmill') {
      const treadmill = MET_MAP.treadmill;
      if (session.speed < 6.5) {
        met = treadmill.jogging;
      } else {
        met = treadmill.running;
      }
    } else if (session.type === 'uprightBike') {
      const bike = MET_MAP.uprightBike;
      if (session.speed < 16) {
        met = bike.light;
      } else if (session.speed < 20) {
        met = bike.moderate;
      } else {
        met = bike.vigorous;
      }
    } else if (session.type === 'crossTrainer') {
      met = MET_MAP.crossTrainer;
    }

    const hours = session.time / 60;
    cardioCalories += met * userWeightKg * hours;
  }

  let weightCalories = 0;

  for (const category of Object.values(weight)) {
    for (const exercise of category) {
      const totalReps = exercise.sets * exercise.reps;
      const avgCalPerRepPerKg = 0.08; 
      weightCalories += totalReps * avgCalPerRepPerKg * userWeightKg;
    }
  }

  const totalCalories = Math.round(cardioCalories + weightCalories);

  return {
    totalCalories,
    cardioCalories: Math.round(cardioCalories),
    weightCalories: Math.round(weightCalories),
  };
}
