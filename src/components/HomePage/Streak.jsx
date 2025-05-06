export default function Streak({ streak = 13, best = 585, score = 177255 }) {
  return (
    <div className="bg-gradient-to-br text-white rounded-2xl p-6 w-full max-w-sm shadow-xl space-y-4">
      <h2 className="text-xl font-semibold tracking-wide">🔥 Learning Consistency</h2>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div className="bg-gray-800/60 p-4 rounded-xl">
          <p className="text-sm text-gray-200">Current Streak</p>
          <p className="text-xl font-bold">{streak}</p>
          <div className="border-t border-gray-700 my-2"></div>
          <p className="text-sm text-gray-200">My Best🔥</p>
          <p className="text-xl font-bold">{best}</p>
        </div>
        
        <div className="bg-gray-800/60 p-4 rounded-xl flex flex-col justify-center items-center gap-2">
          <p className="text-sm text-gray-200">Consistency Score</p>
          <p className="text-xl font-bold">{score.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
