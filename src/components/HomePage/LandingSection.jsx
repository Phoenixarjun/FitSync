import Link from "next/link";

export default function LandingSection() {
  return (
    <div className="z-10 flex flex-col items-center justify-center">
      <div className="z-10 flex items-center justify-center">
        <video
          className="w-64 h-64 object-cover rounded-full border-4 border-white animate-spin-slow shadow-lg"
          autoPlay
          loop
          muted
        >

          <source src="/WorkoutVideo2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="z-10 mt-8 text-center text-white space-y-4 px-4">
        <h1 className="text-4xl font-extrabold tracking-wide">Push Your Limits</h1>
        <h2 className="text-2xl font-semibold">Train Hard. Stay Strong. Be Consistent.</h2>
        <h3 className="text-lg font-medium text-gray-200">Your only competition is who you were yesterday.</h3>
      </div>

      <p className="z-10 mt-6 text-white text-center text-lg px-6">
        Add your workout details in the <span className="font-bold text-[#ff914d]">Workout</span> section to keep track of your progress.
      </p>

      <Link href="/workout" className="z-10">
        <button className="z-20 mt-4 flex items-center cursor-pointer justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          Go to Workout Section
        </button>
      </Link>
    </div>
  );
}
