export default function Loader() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      <p className="text-lg font-medium text-gray-100 animate-pulse">Loading, kindly wait...</p>
    </div>
  );
}
