export default function WorkoutInfo({ setIsWorkoutDone }: { setIsWorkoutDone: (status: boolean) => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold text-white">Workout Completed!</h1>
      <p className="text-lg text-gray-300">Great job on completing your workout!</p>
      <button
        onClick={() => setIsWorkoutDone(false)}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Start New Workout
      </button>
    </div>
  );
}