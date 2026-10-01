const STATS = [
  { n: "12,400+", l: "Live job listings" },
  { n: "3,200+", l: "Verified companies" },
  { n: "180k+", l: "Job seekers matched" },
  { n: "4.8/5", l: "Average candidate rating" },
];

export default function StatsBand() {
  return (
    <section className="py-10 sm:py-14 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-[var(--radius-xl)] bg-gradient-to-br from-[var(--primary)] to-[#6e63f0] px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(255,255,255,0.14),transparent_55%)]" />
          <dl className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-8 sm:gap-y-10 lg:gap-8">
            {STATS.map((s) => (
              <div
                key={s.l}
                className="flex flex-col-reverse items-center text-center text-white"
              >
                <dt className="mt-1 max-w-[16ch] text-balance text-xs leading-snug opacity-85 sm:max-w-none sm:text-sm">
                  {s.l}
                </dt>
                <dd className="font-display text-[28px] font-extrabold leading-tight tabular-nums sm:text-[34px] lg:text-[38px]">
                  {s.n}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
