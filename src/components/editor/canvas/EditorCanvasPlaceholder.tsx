"use client";

export function EditorCanvasPlaceholder() {
  return (
    <div className="w-full grid place-items-center">
      <div className="relative w-[820px] h-[540px] bg-black/50 rounded-md overflow-hidden">
        {/* background image stub */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(35,28,60,0.9), rgba(12,8,18,0.6)), url(https://images.unsplash.com/photo-1526401281623-3593f54a5bd8?q=80&w=1600&auto=format&fit=crop) center/cover",
          }}
        />
        {/* "selection" dashed frame */}
        <div className="absolute inset-10 border border-dashed border-white/60 rounded-sm" />
        {/* center headline block */}
        <div className="absolute inset-0 flex items-center justify-center px-12">
          <h1 className="text-white text-6xl font-bold text-center tracking-wide leading-tight">
            THE BEST WAY T<br />PREDICT THE FUT<br />IS IS TO CREATE<br />IT
          </h1>
        </div>
      </div>
    </div>
  );
}
