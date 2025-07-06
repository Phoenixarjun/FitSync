type CardioEntry = {
  type: 'treadmill' | 'uprightBike' | 'crossTrainer';
  time: number;
  speed: number;
  distance: number;
};

type WeightEntry = {
  name: string;
  category: string;
  sets: number;
  reps: number;
  weightUsed: number;
  restTime: number;
};

type WorkoutData = {
  cardio: CardioEntry[];
  weight: Record<string, WeightEntry[]>;
  userWeightKg: number;
  currentWeight?: number;
};

export function estimateCalories({
  cardio,
  weight,
  userWeightKg,
  currentWeight = userWeightKg
}: WorkoutData): {
  totalCalories: number;
  cardioCalories: number;
  weightCalories: number;
  bmrContribution: number;
} {
  const BMR_PER_MINUTE = 1.2;

  const hasCardio = cardio.length > 0;
  const hasWeight = Object.values(weight).some(arr => arr.length > 0);

  const cardioCalories = hasCardio ? calculateCardioCalories(cardio, currentWeight) : 0;
  const weightCalories = hasWeight ? calculateWeightTrainingCalories(weight, currentWeight) : 0;
  const bmrContribution = (hasCardio || hasWeight)
    ? calculateBmrContribution(cardio, weight, BMR_PER_MINUTE, currentWeight)
    : 0;

  const totalCalories = Math.round((hasCardio && !hasWeight)
    ? cardioCalories
    : (!hasCardio && hasWeight)
      ? weightCalories
      : cardioCalories + weightCalories + bmrContribution);

  return {
    totalCalories,
    cardioCalories: Math.round(cardioCalories),
    weightCalories: Math.round(weightCalories),
    bmrContribution: Math.round(bmrContribution),
  };
}

function calculateBmrContribution(
  cardio: CardioEntry[],
  weight: Record<string, WeightEntry[]>,
  baseBmrPerMin: number,
  userWeightKg: number
): number {
  let totalTime = 0;

  totalTime += cardio.reduce((sum, session) => sum + session.time, 0);

  for (const category of Object.values(weight)) {
    for (const exercise of category) {
      const exerciseTimePerSet = 0.5;
      totalTime += exercise.sets * exerciseTimePerSet;
      totalTime += (exercise.sets - 1) * exercise.restTime;
    }
  }

  const weightAdjustment = userWeightKg / 70;
  return baseBmrPerMin * totalTime * weightAdjustment;
}

function calculateCardioCalories(
  cardio: CardioEntry[],
  userWeightKg: number
): number {
  const MET_VALUES = {
    treadmill: {
      walking: { base: 3.0, speedFactor: 0.1 },
      running: { base: 6.0, speedFactor: 0.2 }
    },
    uprightBike: {
      base: 4.0,
      speedFactor: 0.15
    },
    crossTrainer: {
      base: 5.0,
      resistanceFactor: 0.1
    },
    default: 4.0
  };

  return cardio.reduce((total, session) => {
    let met = MET_VALUES.default;

    switch (session.type) {
      case 'treadmill':
        if (session.speed < 6) {
          const walking = MET_VALUES.treadmill.walking;
          met = walking.base + (session.speed * walking.speedFactor);
        } else {
          const running = MET_VALUES.treadmill.running;
          met = running.base + (session.speed * running.speedFactor);
        }
        break;

      case 'uprightBike':
        const bike = MET_VALUES.uprightBike;
        met = bike.base + (session.speed * bike.speedFactor);
        break;

      case 'crossTrainer':
        const cross = MET_VALUES.crossTrainer;
        met = cross.base + (session.speed * cross.resistanceFactor);
        break;
    }

    return total + (met * userWeightKg * (session.time / 60));
  }, 0);
}

function calculateWeightTrainingCalories(
  weight: Record<string, WeightEntry[]>,
  userWeightKg: number
): number {
  const BASE_ENERGY_PER_REP = 0.05;
  const REST_MET = 1.5;
  const WORK_MET = 3.5;
  const BODYWEIGHT_MET = 4.0;

  return Object.values(weight).reduce((categoryTotal, category) => {
    return categoryTotal + category.reduce((exerciseTotal, exercise) => {
      const isBodyweight = exercise.weightUsed === 0;

      const effectiveWeight = isBodyweight ? userWeightKg * 0.3 : exercise.weightUsed;

      const workCalories =
        exercise.sets * exercise.reps *
        BASE_ENERGY_PER_REP * effectiveWeight;

      const workTimeHours = (exercise.sets * 0.5) / 60;
      const workMet = isBodyweight ? BODYWEIGHT_MET : WORK_MET;
      const workMetCalories = workMet * userWeightKg * workTimeHours;

      const restTimeHours = ((exercise.sets - 1) * exercise.restTime) / 60;
      const restCalories = REST_MET * userWeightKg * restTimeHours;

      return exerciseTotal + workCalories + workMetCalories + restCalories;
    }, 0);
  }, 0);
}
