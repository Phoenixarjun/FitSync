export default function Banner() {
  return (
    <div
      className="relative z-10 w-full max-w-6xl p-5 mt-5 rounded-3xl overflow-hidden px-10 bg-cover bg-right shadow-md shadow-white select-none"
      style={{ backgroundImage: "url('/gymBanner.jpg')" }}
      aria-label="Background gym image"
    >
      <div className="absolute inset-0 bg-black opacity-40 z-0 pointer-events-none" />

      <div
        className="relative z-10 text-right text-white font-extrabold text-2xl md:text-4xl leading-tight pt-3"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        <span style={{ color: "#ff914d" }}>SHAPE YOUR</span>
        <br />
        BODY
      </div>

      <div
        className="relative z-10 text-left text-white font-extrabold text-2xl md:text-4xl leading-tight"
        style={{ fontFamily: "'Bebas Neue', sans-serif" }}
      >
        <span style={{ color: "#ff914d" }}>STAY</span>
        <br />
        CONSISTENT
      </div>
    </div>
  );
}
