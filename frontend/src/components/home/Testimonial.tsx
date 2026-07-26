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
    <div className="bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-lg)] p-7 flex flex-col justify-between shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] hover:border-[#d8dcf0] transition-all">
      <p className="text-[14.5px] text-[var(--text-secondary)] leading-relaxed italic mb-6">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="flex items-center gap-3 pt-4 border-t border-[var(--border)]">
        <div
          className="w-[38px] h-[38px] rounded-full flex items-center justify-center font-bold text-white text-[13px]"
          style={{ backgroundColor: color }}
        >
          {initials}
        </div>
        <div>
          <div className="text-[13.5px] font-bold text-[var(--text-primary)]">
            {name}
          </div>
          <div className="text-xs text-[var(--text-muted)]">{role}</div>
        </div>
      </div>
    </div>
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
    <section className="py-16 bg-[var(--card)]">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHead
          kicker="What people say"
          title="Loved by candidates and hiring teams alike"
          align="center"
        />
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
