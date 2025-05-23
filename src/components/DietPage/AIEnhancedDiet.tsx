import React, { useState, useEffect, useRef } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useUser } from "@/context/UserContext";

interface Meal {
  time: string;
  name: string;
  calories: number;
  description?: string;
}

interface DayPlan {
  day: string;
  meals: Meal[];
}

interface AIEnhancedDietProps {
  preferences: {
    native: string;
    cuisine: string;
    customNative: string;
    customCuisine: string;
  };
  onError: () => void;
}

export default function AIEnhancedDiet({ preferences, onError }: AIEnhancedDietProps) {
  const { user } = useUser();
  const [weeklyDiet, setWeeklyDiet] = useState<DayPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchedKeyRef = useRef('');


useEffect(() => {
  if (!user || !preferences.native || !preferences.cuisine) return;

  const finalNative = preferences.native === 'Others'
    ? preferences.customNative
    : preferences.native;
  const finalCuisine = preferences.cuisine === 'Others'
    ? preferences.customCuisine
    : preferences.cuisine;

  const currentKey = `${user.username}-${finalNative}-${finalCuisine}`;
  if (fetchedKeyRef.current === currentKey) return; 

  const fetchDietPlan = async () => {
    try {
      setLoading(true);
      fetchedKeyRef.current = currentKey;

      const response = await fetch('/api/diet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userData: user,
          preferences: {
            native: finalNative,
            cuisine: finalCuisine
          }
        }),
      });

      const data = await response.json();
      if (data.success) {
        setWeeklyDiet(data.dietPlan);
      } else {
        throw new Error(data.error || 'Failed to generate AI diet plan');
      }
    } catch (err) {
      console.error('Error fetching AI diet plan:', err);
      onError();
      fetchedKeyRef.current = ''; // reset to allow retry
    } finally {
      setLoading(false);
    }
  };

  fetchDietPlan();
}, [user, preferences, onError]);


  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-xl">Please log in to view your AI-enhanced diet plan</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-xl">Creating your AI-enhanced diet plan...</p>
      </div>
    );
  }

  if (weeklyDiet.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-xl">No diet plan generated yet. Please submit your preferences.</p>
      </div>
    );
  }

  const maintenanceCalories = Math.round(user.weight * 2.2 * 14);
  const proteinIntake = Math.round(user.weight * 1.5);

  return (
    <div className="z-10 w-full bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 text-white">
      <h1 className="text-3xl font-bold text-center mb-6 text-white">
        AI-Enhanced Diet for <span style={{ color: "#ff914d" }}>{user.name}</span>
      </h1>

      <div className="mb-4 grid grid-cols-2 gap-4 text-center">
        <div className="bg-blue-900/30 p-3 rounded-lg">
          <p className="text-sm text-blue-200">Daily Calories</p>
          <p className="text-xl font-bold">{maintenanceCalories} kcal</p>
        </div>
        <div className="bg-green-900/30 p-3 rounded-lg">
          <p className="text-sm text-green-200">Protein Target</p>
          <p className="text-xl font-bold">{proteinIntake}g</p>
        </div>
      </div>

      <div className="">
        <Carousel
          showArrows={true}
          showStatus={false}
          showThumbs={false}
          infiniteLoop={true}
          autoPlay={false}
          stopOnHover={true}
          swipeable={true}
          dynamicHeight={false}
          renderIndicator={(onClickHandler, isSelected, index, label) => {
            const defStyle = {
              marginLeft: 20,
              color: "white",
              cursor: "pointer",
              fontSize: "24px"
            };
            const style = isSelected
              ? { ...defStyle, color: "#3B82F6" }
              : { ...defStyle };
            return (
              <span
                style={style}
                onClick={onClickHandler}
                onKeyDown={onClickHandler}
                key={index}
                role="button"
                tabIndex={0}
                aria-label={`${label} ${index + 1}`}
              >
                •
              </span>
            );
          }}
        >
          {weeklyDiet.map((dayData, index) => {
            const totalCalories = dayData.meals.reduce((sum, meal) => sum + meal.calories, 0);

            return (
              <div key={index} className="p-4 text-white">
                <h2 className="text-2xl font-semibold mb-4 text-center text-blue-400">{dayData.day}</h2>
                <div className="space-y-3">
                  {dayData.meals.map((meal, mealIndex) => (
                    <div key={mealIndex} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-700/50 rounded-lg">
                      <div className="text-blue-200 font-medium text-sm sm:text-base">{meal.time}</div>
                      <div className="flex-1 px-2 sm:px-4 py-1 sm:py-0">
                        <p className="font-medium">{meal.name}</p>
                        {meal.description && (
                          <p className="text-xs text-gray-300">{meal.description}</p>
                        )}
                      </div>
                      <div className="text-yellow-300 font-medium">{meal.calories} kcal</div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-3 bg-gray-800 rounded-lg border border-blue-500/30">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Calories:</span>
                    <span className="text-xl font-bold text-blue-300">
                      {totalCalories} kcal
                      <span className="ml-2 text-sm font-normal">
                        ({Math.round((totalCalories / maintenanceCalories) * 100)}% of target)
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </Carousel>
      </div>
    </div>
  );
}
