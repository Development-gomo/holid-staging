export default function Loading() {
  return (
    <section className="w-full relative flex flex-col md:flex-row items-center justify-between h-[95vh] overflow-hidden">
      {/* Background (video/image placeholder) */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content container (same structure as your above-fold hero) */}
      <div className="web-width px-6 py-10 relative z-10 flex w-full flex-col md:flex-row md:gap-[10%] animate-pulse">
        {/* Left side (title/subtitle/button placeholders) */}
        <div className="w-full md:w-1/2">
          {/* H1 */}
          <div className="h-10 md:h-12 w-4/5 bg-white/30 rounded" />
          {/* Subheading lines */}
          <div className="mt-4 h-5 w-full bg-white/25 rounded" />
          <div className="mt-3 h-5 w-11/12 bg-white/25 rounded" />
          <div className="mt-3 h-5 w-3/4 bg-white/25 rounded" />

          {/* Button */}
          <div className="mt-10 h-12 w-44 bg-white/35 rounded" />
        </div>

        {/* Right side (3x3 logo grid skeleton) */}
        <div className="w-full md:w-[40%] mt-10 md:mt-0">
          <div className="mt-6 grid grid-cols-3 gap-0">
            {Array.from({ length: 9 }).map((_, index) => {
              const isLastColumn = (index + 1) % 3 === 0;
              const isLastRow = index >= 6; // last row for 3x3

              return (
                <div
                  key={index}
                  className={`flex justify-center items-center p-6 border-dashed border-white/30
                    ${!isLastColumn ? "border-r" : ""} 
                    ${!isLastRow ? "border-b" : ""}`}
                >
                  <div className="h-8 w-20 bg-white/30 rounded" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}