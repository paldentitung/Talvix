import { Quote } from "lucide-react";
import SectionHead from "../ui/SectionHead";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  color: string;
  initials: string;
}

function TestimonialCard({
  quote,
  name,
  role,
  color,
  initials,
}: TestimonialCardProps) {
  return (
    <figure className="h-full bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-lg)] p-5 sm:p-7 flex flex-col justify-between shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-[#d8dcf0] transition-all">
      <div>
        <Quote
          size={22}
          aria-hidden
          className="mb-4 -scale-x-100"
          style={{ color }}
          fill="currentColor"
          strokeWidth={0}
        />
        <blockquote className="text-[15px] text-[var(--text-secondary)] leading-relaxed mb-6">
          {quote}
        </blockquote>
      </div>

      <figcaption className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
        <div
          className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-white text-[13px] ring-4 ring-[var(--bg)]"
          style={{ backgroundColor: color }}
          aria-hidden
        >
          {initials}
        </div>
        <div className="min-w-0">
          <div className="text-[13.5px] font-bold text-[var(--text-primary)]">
            {name}
          </div>
          <div className="text-xs text-[var(--text-muted)] leading-snug">
            {role}
          </div>
        </div>
      </figcaption>
    </figure>
  );
}

const TESTIMONIALS = [
  {
    quote:
      "I stopped counting how many job boards I'd tried before Talvix. The matches were actually relevant, and I heard back within a week.",
    name: "Jamie Kwan",
    role: "Product Designer, hired at Nimbus",
    color: "#4f46e5",
    initials: "JK",
  },
  {
    quote:
      "Our time-to-hire dropped by 40% after switching to Talvix. The applicant quality is night and day compared to other boards.",
    name: "Maya Reyes",
    role: "Head of Talent, Fractal Labs",
    color: "#14b8a6",
    initials: "MR",
  },
  {
    quote:
      "The application tracker alone is worth it — I always knew exactly where I stood instead of just waiting in silence.",
    name: "Sam Lindqvist",
    role: "Backend Engineer, hired at Horizon",
    color: "#d97706",
    initials: "SL",
  },
];

export default function Testimonials() {
  return (
    <section className="py-12 sm:py-14 lg:py-16 bg-[var(--card)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionHead
          kicker="What people say"
          title="Loved by candidates and hiring teams alike"
          align="center"
        />

        {/* Swipeable row on mobile/tablet, 3-column grid on desktop */}
        <div
          className="-mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="list"
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              role="listitem"
              className="snap-center shrink-0 w-[85%] sm:w-[60%] lg:w-auto lg:shrink"
            >
              <TestimonialCard {...t} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
