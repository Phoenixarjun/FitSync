"use client";
import React, { useState, useEffect, forwardRef } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon, ChevronUpIcon, CheckIcon, Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import classNames from 'classnames';
import { useRouter } from "next/navigation";
import { useUser } from '@/context/UserContext';
import { estimateCalories } from '@/lib/caloriesEstimator';

type CardioExercise = {
  id: string;
  type: 'treadmill' | 'uprightBike' | 'crossTrainer';
  time: number;
  speed: number;
  distance: number;
  date: string;
};

type WeightExercise = {
  id: string;
  name: string;
  category: string;
  sets: number;
  reps: number;
  customName?: string;
  date: string;
};

type AllWorkouts = {
  cardio: CardioExercise[];
  weight: Record<string, WeightExercise[]>;
  userId?: string;
  createdAt?: Date;
  streak?: number; 
  consistency?: number;
  myBestStreak?: number;
  calories?: {
    total: number;
    cardio: number;
    weight: number;
  };
};

type SelectItemProps = {
  children: React.ReactNode;
  className?: string;
  value: string;
};

const exerciseCategories = {
  all: "All Exercises",
  leg: "Leg",
  chest: "Chest",
  fullBody: "Full Body",
  biceps: "Biceps",
  abs: "Abs",
  back: "Back",
  shoulders: "Shoulders",
  cardio: "Cardio",
  other: "Other"
};

const exercisesData = {
  leg: [
    { name: "Squat", category: "leg" },
    { name: "Lunge", category: "leg" },
    { name: "Split squats", category: "leg" },
    { name: "Seated leg press", category: "leg" },
    { name: "Single leg deadlift", category: "leg" },
    { name: "Dumbbell squat", category: "leg" },
    { name: "Barbell squat", category: "leg" },
    { name: "Single-leg squat", category: "leg" },
    { name: "Romanian deadlift", category: "leg" }
  ],
  chest: [
    { name: "Bench press", category: "chest" },
    { name: "Dumbbell Flyes", category: "chest" },
    { name: "Push-up", category: "chest" },
    { name: "Wall push-ups", category: "chest" },
    { name: "Floor press", category: "chest" },
    { name: "Alternating floor press", category: "chest" },
    { name: "Low cable crossover", category: "chest" }
  ],
  fullBody: [
    { name: "Deadlift", category: "fullBody" },
    { name: "Glute bridge", category: "fullBody" },
    { name: "Barbell deadlift", category: "fullBody" },
    { name: "Barbell glute bridge", category: "fullBody" },
    { name: "Power training", category: "fullBody" },
    { name: "Calisthenics", category: "fullBody" }
  ],
  biceps: [
    { name: "Bicep curl", category: "biceps" },
    { name: "Pull-up", category: "biceps" },
    { name: "Pull-down", category: "biceps" },
    { name: "Bent-over row", category: "biceps" }
  ],
  abs: [
    { name: "Plank", category: "abs" },
    { name: "Crunch", category: "abs" },
    { name: "Russian twist", category: "abs" },
    { name: "Dead bug", category: "abs" },
    { name: "Bird dog exercise", category: "abs" },
    { name: "Roman Chair Back Extension", category: "abs" }
  ],
  back: [
    { name: "Pull-up", category: "back" },
    { name: "Pull-down", category: "back" },
    { name: "Bent-over row", category: "back" },
    { name: "Roman Chair Back Extension", category: "back" }
  ],
  shoulders: [
    { name: "Overhead press", category: "shoulders" },
    { name: "Side lateral raise", category: "shoulders" },
    { name: "Arnold press", category: "shoulders" },
    { name: "Overhead Triceps Extension", category: "shoulders" }
  ],
  cardio: [
    { name: "Treadmill", category: "cardio" },
    { name: "Upright bike", category: "cardio" },
    { name: "Cross Trainers", category: "cardio" },
    { name: "HIIT workout", category: "cardio" }
  ],
  other: [
    { name: "Pilates", category: "other" },
    { name: "Tricep dips", category: "other" },
    { name: "Walking lunges", category: "other" },
    { name: "Goblet squat", category: "other" },
    { name: "Lying triceps extension", category: "other" },
    { name: "Step-up", category: "other" },
    { name: "Deadlift to upright row", category: "other" },
    { name: "Seated calf raise", category: "other" },
    { name: "Partial reps", category: "other" }
  ]
};

export default function WorkoutForm() {
  const [tab, setTab] = useState<'cardio' | 'weight'>('cardio');
  const [cardioExercises, setCardioExercises] = useState<CardioExercise[]>([]);
  const [weightExercises, setWeightExercises] = useState<WeightExercise[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedExercise, setSelectedExercise] = useState('');
  const [customExercise, setCustomExercise] = useState('');
  const [sets, setSets] = useState(3);
  const [reps, setReps] = useState(10);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [cardioType, setCardioType] = useState<'treadmill' | 'uprightBike' | 'crossTrainer'>('treadmill');
  const [time, setTime] = useState<number>(30);
  const [speed, setSpeed] = useState<number>(8);
  const [distance, setDistance] = useState<number>(5);

  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (time && speed) {
      const calculatedDistance = speed * (time / 60);
      setDistance(parseFloat(calculatedDistance.toFixed(2)));
    }
  }, [time, speed]);

  const addCardioExercise = () => {
    const newExercise: CardioExercise = {
      id: String(Date.now()),
      type: cardioType,
      time,
      speed,
      distance,
      date,
    };
    setCardioExercises([...cardioExercises, newExercise]);
  };

  const removeCardioExercise = (id: string) => {
    setCardioExercises(cardioExercises.filter(ex => ex.id !== id));
  };

  const addWeightExercise = () => {
    if (!selectedExercise && !customExercise) return;
    
    const category = selectedCategory === 'all' 
      ? Object.values(exercisesData).flat().find(ex => ex.name === selectedExercise)?.category || 'other'
      : selectedCategory;
    
    const newExercise: WeightExercise = {
      id: Date.now().toString(),
      name: selectedExercise === 'other' ? customExercise : selectedExercise || customExercise,
      category,
      sets,
      reps,
      date,
      ...(selectedExercise === 'other' && { customName: customExercise })
    };
    
    setWeightExercises([...weightExercises, newExercise]);
    setSelectedExercise('');
    setCustomExercise('');
  };

  const removeWeightExercise = (id: string) => {
    setWeightExercises(weightExercises.filter(ex => ex.id !== id));
  };

  const prepareWorkoutData = (): AllWorkouts => {
    const weightByCategory: Record<string, WeightExercise[]> = {};
    
    weightExercises.forEach(exercise => {
      if (!weightByCategory[exercise.category]) {
        weightByCategory[exercise.category] = [];
      }
      weightByCategory[exercise.category].push(exercise);
    });
  
    // Calculate calories
    const { totalCalories, cardioCalories, weightCalories } = estimateCalories({
      cardio: cardioExercises.map(ex => ({
        type: ex.type,
        time: ex.time,
        speed: ex.speed,
        distance: ex.distance,
      })),
      weight: weightByCategory,
      userWeightKg: user?.weight || 70,
    });
    
    return {
      cardio: [...cardioExercises],
      weight: weightByCategory,
      userId: user?.userId,
      calories: {
        total: totalCalories,
        cardio: cardioCalories,
        weight: weightCalories,
      },
      createdAt: new Date(),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (cardioExercises.length === 0 && weightExercises.length === 0) {
      setMessage("Please add at least one exercise before saving");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const response = await fetch('/api/saveworkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...prepareWorkoutData(),
          userId: user?.userId,
        }),
      });
  
      const data = await response.json();
      console.log("Workout saved:", data);
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save workout');
      }
  
      setMessage("Workout saved successfully!");
      
      setCardioExercises([]);
      setWeightExercises([]);
  
      setTimeout(() => {
        router.push('/');
      }, 3000);
    } catch (error) {
      console.error("Error saving workout:", error);
      setMessage(error instanceof Error ? error.message : "An error occurred while saving the workout.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredExercises = selectedCategory === 'all' 
    ? Object.values(exercisesData).flat()
    : exercisesData[selectedCategory as keyof typeof exercisesData] || [];

  const SelectItem = forwardRef<HTMLDivElement, SelectItemProps>(
    ({ children, className, value, ...props }, forwardedRef) => {
      return (
        <Select.Item
          value={value}
          className={classNames(
            "relative flex items-center pl-6 pr-4 py-2 rounded text-sm leading-none select-none",
            "data-[highlighted]:bg-teal-800 data-[highlighted]:text-white outline-none",
            "data-[highlighted]:outline-none text-gray-300",
            className
          )}
          {...props}
          ref={forwardedRef}
        >
          <Select.ItemText>{children}</Select.ItemText>
          <Select.ItemIndicator className="absolute left-1 inline-flex items-center justify-center w-4">
            <CheckIcon className="text-teal-400" />
          </Select.ItemIndicator>
        </Select.Item>
      );
    }
  );
  SelectItem.displayName = 'SelectItem';

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen py-8 px-4 bg-gray-900">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Workout Tracker</h1>
        
        <Tabs.Root 
          className="flex flex-col"
          value={tab} 
          onValueChange={(value) => setTab(value as 'cardio' | 'weight')}
        >
          <Tabs.List className="flex mb-8 bg-gray-700 rounded-lg p-1">
            <Tabs.Trigger
              value="cardio"
              className={classNames(
                "flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all",
                "data-[state=active]:bg-gray-600 data-[state=active]:text-teal-400 data-[state=active]:shadow-sm",
                "text-gray-300 hover:text-white"
              )}
            >
              Cardio
            </Tabs.Trigger>
            <Tabs.Trigger
              value="weight"
              className={classNames(
                "flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all",
                "data-[state=active]:bg-gray-600 data-[state=active]:text-teal-400 data-[state=active]:shadow-sm",
                "text-gray-300 hover:text-white"
              )}
            >
              Weight Training
            </Tabs.Trigger>
          </Tabs.List>

          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="date">
              Workout Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <Tabs.Content value="cardio" className="outline-none">
            <div className="mb-6">
              <label className="block text-gray-300 text-sm font-bold mb-2">
                Cardio Type
              </label>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {(['treadmill', 'uprightBike', 'crossTrainer'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setCardioType(type)}
                    className={classNames(
                      "py-2 px-3 rounded-md text-sm font-medium transition-all",
                      cardioType === type 
                        ? "bg-teal-600 text-white" 
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    )}
                  >
                    {type === 'treadmill' ? 'Treadmill' : 
                     type === 'uprightBike' ? 'Upright Bike' : 'Cross Trainer'}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="time">
                    Time (minutes)
                  </label>
                  <input
                    type="number"
                    id="time"
                    value={time}
                    onChange={(e) => setTime(Number(e.target.value))}
                    min="1"
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="speed">
                    Speed (km/h)
                  </label>
                  <input
                    type="number"
                    id="speed"
                    value={speed}
                    onChange={(e) => setSpeed(Number(e.target.value))}
                    min="1"
                    step="0.1"
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="distance">
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    id="distance"
                    value={distance}
                    onChange={(e) => setDistance(Number(e.target.value))}
                    min="0.1"
                    step="0.1"
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={addCardioExercise}
                className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all"
              >
                <PlusIcon /> Add Cardio Session
              </button>
            </div>

            {cardioExercises.length > 0 && (
              <div className="mb-6 flex flex-col gap-2">
                <h3 className="text-lg font-semibold mb-3 text-white">Added Cardio Sessions</h3>
                <div className="space-y-3">
                  {cardioExercises.map((exercise) => (
                    <div key={exercise.id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                      <div>
                        <p className="font-medium text-white">
                          {exercise.type === 'treadmill' ? 'Treadmill' : 
                           exercise.type === 'uprightBike' ? 'Upright Bike' : 'Cross Trainer'}
                        </p>
                        <p className="text-sm text-gray-300">
                          Time: {exercise.time} min | Speed: {exercise.speed} km/h | Distance: {exercise.distance} km
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCardioExercise(exercise.id)}
                        className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-gray-600"
                      >
                        <Cross2Icon />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Tabs.Content>

          <Tabs.Content value="weight" className="outline-none">
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="category">
                    Exercise Category
                  </label>
                  <Select.Root value={selectedCategory} onValueChange={setSelectedCategory}>
                    <Select.Trigger
                      className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-md bg-gray-700 border border-gray-600 text-white hover:bg-gray-600 outline-none focus:ring-2 focus:ring-teal-500"
                      aria-label="Exercise category"
                    >
                      <Select.Value>{exerciseCategories[selectedCategory as keyof typeof exerciseCategories]}</Select.Value>
                      <Select.Icon className="text-gray-400">
                        <ChevronDownIcon />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content className="z-50 overflow-hidden rounded-md bg-gray-700 border border-gray-600 shadow-lg">
                        <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-gray-700 cursor-default">
                          <ChevronUpIcon className="text-gray-400" />
                        </Select.ScrollUpButton>
                        <Select.Viewport className="p-1">
                          {Object.entries(exerciseCategories).map(([value, name]) => (
                            <SelectItem 
                              key={value} 
                              value={value}
                              className="text-sm"
                            >
                              {name}
                            </SelectItem>
                          ))}
                        </Select.Viewport>
                        <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-gray-700 cursor-default">
                          <ChevronDownIcon className="text-gray-400" />
                        </Select.ScrollDownButton>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="exercise">
                    Exercise
                  </label>
                  <Select.Root 
                    value={selectedExercise} 
                    onValueChange={(value) => {
                      setSelectedExercise(value);
                      if (value !== 'other') {
                        setCustomExercise('');
                      }
                    }}
                  >
                    <Select.Trigger
                      className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-md bg-gray-700 border border-gray-600 text-white hover:bg-gray-600 outline-none focus:ring-2 focus:ring-teal-500"
                      aria-label="Exercise"
                    >
                      <Select.Value placeholder="Select an exercise..." />
                      <Select.Icon className="text-gray-400">
                        <ChevronDownIcon />
                      </Select.Icon>
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content className="z-50 overflow-hidden rounded-md bg-gray-700 border border-gray-600 shadow-lg max-h-[var(--radix-select-content-available-height)]">
                        <Select.ScrollUpButton className="flex items-center justify-center h-6 bg-gray-700 cursor-default">
                          <ChevronUpIcon className="text-gray-400" />
                        </Select.ScrollUpButton>
                        <Select.Viewport className="p-1">
                          {filteredExercises.map((exercise) => (
                            <SelectItem 
                              key={`${exercise.name}-${exercise.category}`}
                              value={exercise.name}
                              className="text-sm"
                            >
                              {exercise.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">
                            <div className="text-sm italic">Other (specify below)</div>
                          </SelectItem>
                        </Select.Viewport>
                        <Select.ScrollDownButton className="flex items-center justify-center h-6 bg-gray-700 cursor-default">
                          <ChevronDownIcon className="text-gray-400" />
                        </Select.ScrollDownButton>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
              </div>

              {(selectedExercise === 'other' || (!selectedExercise && customExercise)) && (
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="customExercise">
                    Custom Exercise Name
                  </label>
                  <input
                    type="text"
                    id="customExercise"
                    value={customExercise}
                    onChange={(e) => setCustomExercise(e.target.value)}
                    placeholder="Enter exercise name"
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="sets">
                    Sets
                  </label>
                  <input
                    type="number"
                    id="sets"
                    value={sets}
                    onChange={(e) => setSets(Number(e.target.value))}
                    min="1"
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="reps">
                    Reps
                  </label>
                  <input
                    type="number"
                    id="reps"
                    value={reps}
                    onChange={(e) => setReps(Number(e.target.value))}
                    min="1"
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={addWeightExercise}
                disabled={!selectedExercise && !customExercise}
                className="flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusIcon /> Add Exercise
              </button>
            </div>

            {weightExercises.length > 0 && (
              <div className="mb-6 flex flex-col gap-2">
                <h3 className="text-lg font-semibold mb-3 text-white">Added Exercises</h3>
                <div className="space-y-3">
                  {weightExercises.map((exercise) => (
                    <div key={exercise.id} className="bg-gray-700 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-white">{exercise.name}</p>
                          <p className="text-sm text-gray-300">
                            {exercise.sets} sets × {exercise.reps} reps
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeWeightExercise(exercise.id)}
                          className="text-red-400 hover:text-red-300 p-1 rounded-full hover:bg-gray-600"
                        >
                          <Cross2Icon />
                        </button>
                      </div>
                      <div className="mt-1">
                        <span className="inline-block bg-teal-900 text-teal-300 text-xs px-2 py-1 rounded">
                          {exerciseCategories[exercise.category as keyof typeof exerciseCategories]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Tabs.Content>
        </Tabs.Root>

        {message && (
          <div className={`mb-4 p-3 rounded-md ${message.includes("success") ? "bg-green-800 text-green-200" : "bg-red-800 text-red-200"}`}>
            {message}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={(cardioExercises.length === 0 && weightExercises.length === 0) || isSubmitting}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Complete Workout"}
        </button>
      </div>
    </div>
  );
}