import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function DietChart() {
  // Sample diet data for 7 days with timings and calories
  const weeklyDiet = [
    {
      day: 'Monday',
      meals: [
        { time: '7:00 AM', name: 'Oatmeal with berries and nuts', calories: 350 },
        { time: '10:00 AM', name: 'Greek yogurt with flaxseeds', calories: 180 },
        { time: '12:30 PM', name: 'Grilled chicken with quinoa and steamed vegetables', calories: 450 },
        { time: '3:30 PM', name: 'Handful of almonds and an apple', calories: 200 },
        { time: '6:30 PM', name: 'Baked salmon with sweet potato and asparagus', calories: 500 },
        { time: '9:00 PM', name: 'Chamomile tea', calories: 5 }
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

  return (
    <div className="flex flex-col items-center justify-center w-screen min-h-screen py-8 px-4 bg-gray-900">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-white">Personalized Diet Chart</h1>
        
        <div className="backdrop-blur-sm bg-gray-700/30 rounded-xl p-4">
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
                  <div className="space-y-4">
                    {dayData.meals.map((meal, mealIndex) => (
                      <div key={mealIndex} className="flex justify-between items-center p-3 bg-gray-700/50 rounded-lg">
                        <div className="text-blue-200 font-medium">{meal.time}</div>
                        <div className="flex-1 px-4">{meal.name}</div>
                        <div className="text-yellow-300 font-medium">{meal.calories} kcal</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-3 bg-gray-800 rounded-lg border border-blue-500/30">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Calories:</span>
                      <span className="text-xl font-bold text-blue-300">{totalCalories} kcal</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </Carousel>
        </div>
      </div>
    </div>
  );
}