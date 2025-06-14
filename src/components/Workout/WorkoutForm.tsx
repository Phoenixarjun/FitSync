"use client";
import React, { useState, useEffect, forwardRef, useRef } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import * as Select from '@radix-ui/react-select';
import { ChevronDownIcon, ChevronUpIcon, CheckIcon, Cross2Icon, PlusIcon } from '@radix-ui/react-icons';
import * as Toast from '@radix-ui/react-toast';
import classNames from 'classnames';
import { useRouter } from "next/navigation";
import { useUser } from '@/context/UserContext';
import { estimateCalories } from '@/lib/caloriesEstimator';
import { v4 as uuidv4 } from 'uuid';

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
  weightUsed: number; 
  restTime: number; 
  customName?: string;
  date: string;
};

type AllWorkouts = {
  cardio: CardioExercise[];
  weight: Record<string, WeightExercise[]>;
  userId?: string;
  createdAt?: Date;
  stats?: {
    currentStreak: number;
    bestStreak: number;
    consistencyScore: number;
    lastWorkoutDate: Date;
  };
  currentWeight?: number; 
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
    { name: "Romanian deadlift", category: "leg" },
    { name: "Leg press machine", category: "leg" },
    { name: "Leg curl machine", category: "leg" },
    { name: "Leg extension machine", category: "leg" },
    { name: "Hack Squat machine", category: "leg" }
  ],
  chest: [
    { name: "Bench press", category: "chest" },
    { name: "Dumbbell flyes", category: "chest" },
    { name: "Push-up", category: "chest" },
    { name: "Wall push-ups", category: "chest" },
    { name: "Floor press", category: "chest" },
    { name: "Alternating floor press", category: "chest" },
    { name: "Low cable crossover", category: "chest" },
    { name: "Chest press machine", category: "chest" },
    { name: "Cable crossover machine", category: "chest" },
    { name: "Smith machine bench press", category: "chest" }
  ],
  fullBody: [
    { name: "Deadlift", category: "fullBody" },
    { name: "Glute bridge", category: "fullBody" },
    { name: "Barbell deadlift", category: "fullBody" },
    { name: "Barbell glute bridge", category: "fullBody" },
    { name: "Power training", category: "fullBody" },
    { name: "Calisthenics", category: "fullBody" },
    { name: "Kettlebell swings", category: "fullBody" },
    { name: "Resistance band circuits", category: "fullBody" }
  ],
  biceps: [
    { name: "Bicep curl", category: "biceps" },
    { name: "Pull-up", category: "biceps" },
    { name: "Pull-down", category: "biceps" },
    { name: "Bent-over row", category: "biceps" },
    { name: "Cable curls", category: "biceps" },
    { name: "Preacher curl machine", category: "biceps" }
  ],
  abs: [
    { name: "Plank", category: "abs" },
    { name: "Crunch", category: "abs" },
    { name: "Russian twist", category: "abs" },
    { name: "Dead bug", category: "abs" },
    { name: "Bird dog exercise", category: "abs" },
    { name: "Roman Chair Back Extension", category: "abs" },
    { name: "Cable crunch", category: "abs" },
    { name: "Ab roller", category: "abs" }
  ],
  back: [
    { name: "Pull-up", category: "back" },
    { name: "Pull-down", category: "back" },
    { name: "Bent-over row", category: "back" },
    { name: "Roman Chair Back Extension", category: "back" },
    { name: "Lat pulldown machine", category: "back" },
    { name: "Seated row machine", category: "back" },
    { name: "T-bar row", category: "back" }
  ],
  shoulders: [
    { name: "Overhead press", category: "shoulders" },
    { name: "Side lateral raise", category: "shoulders" },
    { name: "Arnold press", category: "shoulders" },
    { name: "Overhead triceps extension", category: "shoulders" },
    { name: "Cable lateral raise", category: "shoulders" },
    { name: "Smith machine shoulder press", category: "shoulders" }
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
    { name: "Partial reps", category: "other" },
    { name: "Dumbbells", category: "other" },
    { name: "Barbell", category: "other" },
    { name: "Cable machine", category: "other" },
    { name: "Smith machine", category: "other" },
    { name: "Power rack", category: "other" },
    { name: "Pullup bar", category: "other" },
    { name: "Resistance bands", category: "other" },
    { name: "Weight plates", category: "other" },
    { name: "Adjustable bench", category: "other" },
    { name: "Bench", category: "other" }
  ]
};

const ToastNotification = ({
  open,
  setOpen,
  title,
  description,
  variant = "default",
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description: string;
  variant?: "success" | "error" | "default";
}) => {
  const timerRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const variantClasses = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    default: "bg-white text-slate12",
  };

  return (
    <Toast.Provider swipeDirection="right">
      <Toast.Root
        className={classNames(
          "grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md p-[15px]",
          "shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]",
          "[grid-template-areas:_'title_action'_'description_action']",
          "data-[swipe=cancel]:translate-x-0",
          "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]",
          "data-[state=closed]:animate-hide",
          "data-[state=open]:animate-slideIn",
          "data-[swipe=end]:animate-swipeOut",
          "data-[swipe=cancel]:transition-[transform_200ms_ease-out]",
          variantClasses[variant]
        )}
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className="mb-[5px] text-[15px] font-medium text-slate12 [grid-area:_title]">
          {title}
        </Toast.Title>
        <Toast.Description className="m-0 text-[13px] leading-[1.3] text-slate11 [grid-area:_description]">
          {description}
        </Toast.Description>
        <Toast.Action
          className="[grid-area:_action]"
          asChild
          altText="Close toast"
        >
          <button className="inline-flex h-[25px] items-center justify-center rounded bg-green2 px-2.5 text-xs font-medium leading-[25px] text-green11 shadow-[inset_0_0_0_1px] shadow-green7 hover:shadow-[inset_0_0_0_1px] hover:shadow-green8 focus:shadow-[0_0_0_2px] focus:shadow-green8">
            Close
          </button>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className="fixed bottom-0 right-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
    </Toast.Provider>
  );
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
  const [weightUsed, setWeightUsed] = useState<number>(0);
  const [restTime, setRestTime] = useState<number>(1);
  const [currentWeight, setCurrentWeight] = useState<number>(0);
  const [date, setDate] = useState(() => {
  const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingWorkoutId, setExistingWorkoutId] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastTitle, setToastTitle] = useState("");
  const [toastDescription, setToastDescription] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "error" | "default">("default");
  const [cardioType, setCardioType] = useState<'treadmill' | 'uprightBike' | 'crossTrainer'>('treadmill');
  const [time, setTime] = useState<number>(30);
  const [speed, setSpeed] = useState<number>(8);
  const [distance, setDistance] = useState<number>(5);

  const router = useRouter();
  const { user } = useUser();
  const timerRef = useRef(0);


  useEffect(() => {
  if (typeof window !== 'undefined') {
    document.body.removeAttribute('cz-shortcut-listen');
  }
}, []);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  useEffect(() => {
    if (time && speed) {
      const calculatedDistance = speed * (time / 60);
      setDistance(parseFloat(calculatedDistance.toFixed(2)));
    }
  }, [time, speed]);

useEffect(() => {
    const checkExistingWorkout = async () => {
      if (!user?.userId || !date) return;
      
      try {
        const response = await fetch(`/api/saveworkout?userId=${user.userId}&date=${date}`);
        const data = await response.json();

        console.log("Existing workout data:", data);
        
        if (data.workout) {
          setExistingWorkoutId(data.workout._id);
          
          setCardioExercises([]);
          setWeightExercises([]);
          
          if (data.workout.cardio) {
            const cardioWithIds = data.workout.cardio.map((ex: CardioExercise) => ({
              ...ex,
              id: ex.id || `cardio-${uuidv4()}`
            }));
            setCardioExercises(cardioWithIds);
          }
          
          if (data.workout.weight) {
            const weightExercisesArray = Object.values(data.workout.weight).flat() as WeightExercise[];
            const weightWithIds = weightExercisesArray.map(ex => ({
              ...ex,
              id: ex.id || `weight-${uuidv4()}`
            }));
            setWeightExercises(weightWithIds);
          }
          
          setCurrentWeight(data.workout.currentWeight || 0);
        } else {
          setExistingWorkoutId(null);
          setCardioExercises([]);
          setWeightExercises([]);
          setCurrentWeight(0);
        }
      } catch (error) {
        showToast("Error", "Failed to load workout data", "error");
      }
    };
    
    checkExistingWorkout();
  }, [date, user?.userId]);

  const showToast = (title: string, description: string, variant: "success" | "error" | "default") => {
    setToastOpen(false);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setToastTitle(title);
      setToastDescription(description);
      setToastVariant(variant);
      setToastOpen(true);
    }, 100);
  };

  const addCardioExercise = () => {
    const newExercise: CardioExercise = {
      id: `cardio-${uuidv4()}`,
      type: cardioType,
      time,
      speed,
      distance,
      date,
    };
    setCardioExercises([...cardioExercises, newExercise]);
  };

  const addWeightExercise = () => {
    if (!selectedExercise && !customExercise) {
      showToast("Error", "Please select or enter an exercise name", "error");
      return;
    }
    
    const category = selectedCategory === 'all' 
      ? Object.values(exercisesData).flat().find(ex => ex.name === selectedExercise)?.category || 'other'
      : selectedCategory;
    
    const newExercise: WeightExercise = {
      id: `weight-${uuidv4()}`,
      name: selectedExercise === 'other' ? customExercise : selectedExercise || customExercise,
      category,
      sets,
      reps,
      weightUsed, 
      restTime, 
      date,
      ...(selectedExercise === 'other' && { customName: customExercise })
    };
    
    setWeightExercises([...weightExercises, newExercise]);
    setSelectedExercise('');
    setCustomExercise('');
  };

  const removeCardioExercise = (id: string) => {
    setCardioExercises(cardioExercises.filter(ex => ex.id !== id));
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

    const workoutDate = new Date(date);
    const utcDate = new Date(Date.UTC(
      workoutDate.getFullYear(),
      workoutDate.getMonth(),
      workoutDate.getDate()
    ));
    
    return {
      cardio: [...cardioExercises],
      weight: weightByCategory,
      userId: user?.userId,
      currentWeight: currentWeight, 
      calories: {
        total: totalCalories,
        cardio: cardioCalories,
        weight: weightCalories,
      },
      createdAt: utcDate,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (cardioExercises.length === 0 && weightExercises.length === 0) {
      showToast("Error", "Please add at least one exercise before saving", "error");
      setIsSubmitting(false);
      return;
    }
    
    try {
      const workoutData = prepareWorkoutData();
      
      const response = await fetch('/api/saveworkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...workoutData,
          userId: user?.userId,
          _id: existingWorkoutId || undefined,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save workout');
      }

      showToast("Success", data.message || "Workout saved successfully!", "success");
      
      const isToday = date === new Date().toISOString().split('T')[0];
      if (isToday) {
        setCardioExercises([]);
        setWeightExercises([]);
        setCurrentWeight(0);
      }
  
      setTimeout(() => {
        if (isToday) {
          router.push('/');
        }
      }, 2000);
    } catch (error) {
      showToast("Error", error instanceof Error ? error.message : "An error occurred while saving the workout.", "error");
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
            "data-[highlighted]:bg-orange-500/50 data-[highlighted]:text-white outline-none",
            "data-[highlighted]:outline-none text-gray-300",
            className
          )}
          {...props}
          ref={forwardedRef}
        >
          <Select.ItemText>{children}</Select.ItemText>
          <Select.ItemIndicator className="absolute left-1 inline-flex items-center justify-center w-4">
            <CheckIcon className="text-orange-400" />
          </Select.ItemIndicator>
        </Select.Item>
      );
    }
  );
  SelectItem.displayName = 'SelectItem';

  const isToday = date === new Date().toISOString().split('T')[0];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
      <div className="w-full max-w-3xl rounded-xl shadow-lg p-6 bg-white/10 backdrop-blur-md border border-white/20">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Workout Tracker</h1>
        
        {/* Date Picker */}
        <div className="mb-4">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="date">
            Workout Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            max={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Current Weight */}
        <div className="mb-6">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="currentWeight">
            Current Weight (kg)
          </label>
          <input
            type="number"
            id="currentWeight"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(Number(e.target.value))}
            min="0"
            step="0.1"
            className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Tabs */}
        <Tabs.Root className="flex flex-col" value={tab} onValueChange={(value) => setTab(value as 'cardio' | 'weight')}>
          <Tabs.List className="flex mb-8 bg-gray-700 rounded-lg p-1">
            <Tabs.Trigger
              value="cardio"
              className={classNames(
                "flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all",
                "data-[state=active]:bg-gray-600 data-[state=active]:text-orange-400 data-[state=active]:shadow-sm",
                "text-gray-300 hover:text-white"
              )}
            >
              Cardio
            </Tabs.Trigger>
            <Tabs.Trigger
              value="weight"
              className={classNames(
                "flex-1 py-3 px-4 text-sm font-medium rounded-md transition-all",
                "data-[state=active]:bg-gray-600 data-[state=active]:text-orange-400 data-[state=active]:shadow-sm",
                "text-gray-300 hover:text-white"
              )}
            >
              Weight Training
            </Tabs.Trigger>
          </Tabs.List>

          {/* Cardio Tab Content */}
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
                        ? "bg-orange-500 text-white" 
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
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={addCardioExercise}
                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all"
              >
                <PlusIcon /> Add Cardio Session
              </button>
            </div>

            {cardioExercises.length > 0 && (
              <div className="mb-6 flex flex-col gap-2">
                <h3 className="text-lg font-semibold mb-3 text-white">Added Cardio Sessions</h3>
                <div className="space-y-3">
                  {cardioExercises.map((exercise) => (
                    <div key={`cardio-${exercise.id}`} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
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

          {/* Weight Training Tab Content */}
          <Tabs.Content value="weight" className="outline-none">
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="category">
                    Exercise Category
                  </label>
                  <Select.Root value={selectedCategory} onValueChange={setSelectedCategory}>
                    <Select.Trigger
                      className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-md bg-gray-700 border border-gray-600 text-white hover:bg-gray-600 outline-none focus:ring-2 focus:ring-orange-500"
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
                              key={`category-${value}`}
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
                      className="flex items-center justify-between w-full px-3 py-2 text-sm rounded-md bg-gray-700 border border-gray-600 text-white hover:bg-gray-600 outline-none focus:ring-2 focus:ring-orange-500"
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
                              key={`exercise-${exercise.name}-${exercise.category}`}
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
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
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
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="weightUsed">
                    Weight Used (kg)
                  </label>
                  <input
                    type="number"
                    id="weightUsed"
                    value={weightUsed}
                    onChange={(e) => setWeightUsed(Number(e.target.value))}
                    min="0"
                    step="0.5"
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="restTime">
                    Rest Between Sets (mins)
                  </label>
                  <input
                    type="number"
                    id="restTime"
                    value={restTime}
                    onChange={(e) => setRestTime(Number(e.target.value))}
                    min="0.5"
                    step="0.5"
                    className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-white leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={addWeightExercise}
                disabled={!selectedExercise && !customExercise}
                className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusIcon /> Add Exercise
              </button>
            </div>

            {weightExercises.length > 0 && (
              <div className="mb-6 flex flex-col gap-2">
                <h3 className="text-lg font-semibold mb-3 text-white">Added Exercises</h3>
                <div className="space-y-3">
                  {weightExercises.map((exercise) => (
                    <div key={`weight-${exercise.id}`} className="bg-gray-700 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-white">{exercise.name}</p>
                          <p className="text-sm text-gray-300">
                            {exercise.sets} sets × {exercise.reps} reps
                          </p>
                          <p className="text-sm text-gray-300">
                            Weight: {exercise.weightUsed} kg | Rest: {exercise.restTime} mins
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
                        <span className="inline-block bg-orange-900/30 text-orange-300 text-xs px-2 py-1 rounded">
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

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={(cardioExercises.length === 0 && weightExercises.length === 0) || isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : existingWorkoutId ? "Update Workout" : "Save Workout"}
        </button>
      </div>

      {/* Toast Notification */}
      <ToastNotification
        open={toastOpen}
        setOpen={setToastOpen}
        title={toastTitle}
        description={toastDescription}
        variant={toastVariant}
      />
    </div>
  );
}