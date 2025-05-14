import React from 'react';
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


const defaultWeeklyDiet: DayPlan[] = [
  {
    day: 'Monday',
    meals: [
      { time: '7:00 AM', name: 'Masala dosa with sambar', calories: 350, description: 'South Indian fermented crepe with lentil soup' },
      { time: '10:00 AM', name: 'Fruit salad with yogurt', calories: 180 },
      { time: '12:30 PM', name: 'Chicken biryani with raita', calories: 450 },
      { time: '3:30 PM', name: 'Sprouts salad', calories: 200 },
      { time: '6:30 PM', name: 'Dal tadka with roti and vegetables', calories: 500 },
      { time: '9:00 PM', name: 'Turmeric milk', calories: 120 }
    ]
  },
  {
    day: 'Tuesday',
    meals: [
      { time: '7:00 AM', name: 'Scrambled eggs with whole grain toast', calories: 320 },
      { time: '10:00 AM', name: 'Protein smoothie with spinach and banana', calories: 250 },
      { time: '12:30 PM', name: 'Turkey wrap with whole wheat tortilla and side salad', calories: 400 },
      { time: '3:30 PM', name: 'Cottage cheese with cucumber slices', calories: 150 },
      { time: '6:30 PM', name: 'Lean beef stir-fry with brown rice and broccoli', calories: 550 },
      { time: '9:00 PM', name: 'Warm milk with turmeric', calories: 120 }
    ]
  },
  {
    day: 'Wednesday',
    meals: [
      { time: '7:00 AM', name: 'Chia pudding with almond milk and mango', calories: 300 },
      { time: '10:00 AM', name: 'Hard-boiled eggs with carrot sticks', calories: 180 },
      { time: '12:30 PM', name: 'Grilled fish with couscous and roasted vegetables', calories: 420 },
      { time: '3:30 PM', name: 'Dark chocolate and walnuts', calories: 220 },
      { time: '6:30 PM', name: 'Lentil curry with basmati rice', calories: 480 },
      { time: '9:00 PM', name: 'Herbal tea', calories: 5 }
    ]
  },
  {
    day: 'Thursday',
    meals: [
      { time: '7:00 AM', name: 'Avocado toast with poached eggs', calories: 380 },
      { time: '10:00 AM', name: 'Mixed nuts and dried fruits', calories: 200 },
      { time: '12:30 PM', name: 'Chicken salad with mixed greens and olive oil dressing', calories: 350 },
      { time: '3:30 PM', name: 'Protein bar and green tea', calories: 210 },
      { time: '6:30 PM', name: 'Shrimp pasta with whole wheat noodles and garlic sauce', calories: 520 },
      { time: '9:00 PM', name: 'Almond milk', calories: 60 }
    ]
  },
  {
    day: 'Friday',
    meals: [
      { time: '7:00 AM', name: 'Pancakes with peanut butter and banana', calories: 400 },
      { time: '10:00 AM', name: 'Fresh fruit salad', calories: 150 },
      { time: '12:30 PM', name: 'Grilled vegetable and hummus wrap', calories: 380 },
      { time: '3:30 PM', name: 'Rice cakes with almond butter', calories: 180 },
      { time: '6:30 PM', name: 'Baked chicken with mashed cauliflower and green beans', calories: 450 },
      { time: '9:00 PM', name: 'Warm lemon water', calories: 5 }
    ]
  },
  {
    day: 'Saturday',
    meals: [
      { time: '8:00 AM', name: 'Smoothie bowl with granola', calories: 350 },
      { time: '11:00 AM', name: 'Whole grain crackers with cheese', calories: 220 },
      { time: '1:30 PM', name: 'Beef burger with sweet potato fries', calories: 600 },
      { time: '4:30 PM', name: 'Trail mix', calories: 250 },
      { time: '7:30 PM', name: 'Grilled shrimp with quinoa salad', calories: 450 },
      { time: '10:00 PM', name: 'Sleepy time tea', calories: 5 }
    ]
  },
  {
    day: 'Sunday',
    meals: [
      { time: '8:00 AM', name: 'French toast with maple syrup', calories: 420 },
      { time: '11:00 AM', name: 'Yogurt parfait with granola', calories: 280 },
      { time: '1:30 PM', name: 'Roast chicken with roasted vegetables', calories: 500 },
      { time: '4:30 PM', name: 'Protein shake', calories: 200 },
      { time: '7:30 PM', name: 'Vegetable stir-fry with tofu', calories: 380 },
      { time: '10:00 PM', name: 'Warm chamomile tea', calories: 5 }
    ]
  }
];

export default function PersonalizedDiet() {
  const { user } = useUser();
  const maintenanceCalories = user ? Math.round(user.weight * 2.2 * 14) : 2000;
  const proteinIntake = user ? Math.round(user.weight * 1.5) : 100;

  if (!user) {
    return (
      <div className="text-center py-8">
        <p className="text-xl">Please log in to view your diet plan</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6">
        Standard Diet Plan for <span className="text-orange-400">{user.name}</span>
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
      
      <Carousel
        showArrows={true}
        showStatus={false}
        showThumbs={false}
        infiniteLoop={true}
        className="carousel-container"
      >
        {defaultWeeklyDiet.map((dayData) => {
          const totalCalories = dayData.meals.reduce((sum, meal) => sum + meal.calories, 0);
          const percentage = Math.round((totalCalories / maintenanceCalories) * 100);

          return (
            <div key={dayData.day} className="p-4">
              <h2 className="text-xl font-semibold mb-4 text-center text-blue-400">{dayData.day}</h2>
              
              <div className="space-y-3">
                {dayData.meals.map((meal) => (
                  <div key={`${dayData.day}-${meal.time}`} 
                    className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                    <span className="text-blue-200 font-medium">{meal.time}</span>
                    <div className="flex-1 px-4">
                      <p className="font-medium">{meal.name}</p>
                      {meal.description && (
                        <p className="text-xs text-gray-300">{meal.description}</p>
                      )}
                    </div>
                    <span className="text-yellow-300 font-medium">{meal.calories} kcal</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-gray-800 rounded-lg border border-blue-500/30">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Calories:</span>
                  <span className="font-bold text-blue-300">
                    {totalCalories} kcal ({percentage}%)
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </Carousel>
    </div>
  );
}