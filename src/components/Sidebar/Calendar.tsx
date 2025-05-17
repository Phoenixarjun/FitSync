"use client";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useUser } from "@/context/UserContext";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];
type Workout = { date: string }; // ✅ Typed API response

export default function WorkoutCalendar() {
  const [value, onChange] = useState<Value>(new Date());
  const [workoutDates, setWorkoutDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const userId = user?.userId;

  useEffect(() => {
    if (!userId) return;

    const fetchWorkoutDates = async () => {
      try {
        const response = await fetch(`/api/workoutProgressInfo?userId=${userId}`);
        if (!response.ok) throw new Error("Failed to fetch workout data");
        const data: Workout[] = await response.json(); // ✅ Use type

        const dates = data.map((workout) => new Date(workout.date));
        setWorkoutDates(dates);
      } catch (error) {
        console.error("Error fetching workout dates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkoutDates();
  }, [userId]);

  const hasWorkout = (date: Date) =>
    workoutDates.some(
      (d) =>
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
    );

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month" && hasWorkout(date) && !isToday(date)) {
      return (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="h-1 w-1 rounded-full bg-green-500"></div>
        </div>
      );
    }
    return null;
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    const classes: string[] = [];
    const now = new Date();

    if (view === "month") {
      if (date.getMonth() !== now.getMonth()) classes.push("prev-month");
      if (date.getDay() === 0 || date.getDay() === 6) classes.push("weekend");
      if (hasWorkout(date)) {
        if (isToday(date)) classes.push("today-workout");
        else classes.push("past-workout");
      }
    }

    return classes.join(" ");
  };

  if (loading) {
    return <div className="text-white text-center">Loading calendar...</div>;
  }

  return (
    <>
      <Calendar
        onChange={onChange}
        value={value}
        tileContent={tileContent}
        tileClassName={tileClassName}
        className="border-0 text-white w-full max-w-xs"
        navigationLabel={({ date, locale }) =>
          date.toLocaleDateString(locale, { month: "long", year: "numeric" })
        }
        prevLabel="‹"
        nextLabel="›"
        prev2Label="«"
        next2Label="»"
      />

      <style jsx global>{`
        .react-calendar {
          background: transparent;
          font-family: inherit;
          border-radius: 0.5em;
        }
        .react-calendar__tile {
          padding: 0.5em 0;
          color: white;
          position: relative;
        }
        .react-calendar__tile--now {
          background: transparent;
          color: white;
        }
        .react-calendar__tile.today-workout {
          background: rgba(59, 130, 246, 0.4);
          border-radius: 50%;
        }
        .react-calendar__tile.past-workout {
          color: #4ade80;
        }
        .react-calendar__tile--active {
          background: rgba(59, 130, 246, 0.4);
          color: white;
          border-radius: 50%;
        }
        .react-calendar__navigation button {
          background: none;
          color: white;
        }
        .react-calendar__navigation button:enabled:hover {
          background: rgba(167, 139, 250, 0.1);
        }
        .react-calendar__month-view__weekdays {
          color: rgba(255, 255, 255, 0.6);
        }
        .react-calendar__tile.weekend {
          color: #f87171;
        }
        .react-calendar__tile.prev-month {
          color: #9ca3af;
        }
      `}</style>
    </>
  );
}
