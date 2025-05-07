"use client";
import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const attendanceDates = [
  new Date(2023, 5, 15),
  new Date(2023, 5, 18),
  new Date(2023, 5, 20),
  new Date(2023, 5, 22),
  new Date(2023, 5, 25),
];

export default function WorkoutCalendar() {
  const [value, onChange] = useState<Value>(new Date());

  const hasWorkout = (date: Date) =>
    attendanceDates.some(
      (d) =>
        d.getDate() === date.getDate() &&
        d.getMonth() === date.getMonth() &&
        d.getFullYear() === date.getFullYear()
    );

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && hasWorkout(date)) {
      return (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
        </div>
      );
    }
    return null;
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    const now = new Date();
    const classes = [];

    if (view === 'month') {
      if (date.getMonth() !== now.getMonth()) {
        classes.push('prev-month');
      }
      if (date.getDay() === 0 || date.getDay() === 6) {
        classes.push('weekend');
      }
    }

    return classes.join(' ');
  };

  return (
    <>
      <Calendar
        onChange={onChange}
        value={value}
        tileContent={tileContent}
        tileClassName={tileClassName}
        className="border-0 text-white w-full max-w-xs"
        navigationLabel={({ date, locale }) =>
          date.toLocaleDateString(locale, { month: 'long', year: 'numeric' })
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
          background: rgba(147, 197, 253, 0.2); /* Light Blue */
          border-radius: 50%;
        }

        .react-calendar__tile--active {
          background: rgba(59, 130, 246, 0.4); /* Darker Blue */
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
