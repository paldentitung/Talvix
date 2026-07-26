const STATS = [
  { n: "12,400+", l: "Live job listings" },
  { n: "3,200+", l: "Verified companies" },
  { n: "180k+", l: "Job seekers matched" },
  { n: "4.8/5", l: "Average candidate rating" },
];

export default function StatsBand() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--primary)] to-[#6e63f0] px-10 py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.14),transparent_55%)]" />
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.l} className="text-center text-white">
                <div className="font-display text-[38px] font-extrabold">
                  {s.n}
                </div>
                <div className="text-sm opacity-85 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
