export default function UrgencyStrip() {
  return (
    <div className="bg-saffron py-3 overflow-hidden border-y border-saffron-dark relative z-10">
      <div className="flex whitespace-nowrap animate-marquee">
        {/* We repeat the content multiple times to ensure a smooth continuous scroll */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-8 px-4 font-ui font-bold text-forest text-sm tracking-widest uppercase">
            <span>100% Pure Vegetarian</span>
            <span className="w-1.5 h-1.5 rounded-full bg-forest" />
            <span>Made Fresh Daily</span>
            <span className="w-1.5 h-1.5 rounded-full bg-forest" />
            <span>No Artificial Colors</span>
            <span className="w-1.5 h-1.5 rounded-full bg-forest" />
            <span>Secret Spices</span>
            <span className="w-1.5 h-1.5 rounded-full bg-forest" />
          </div>
        ))}
      </div>
    </div>
  );
}
