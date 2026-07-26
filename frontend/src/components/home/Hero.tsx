import { useEffect, useState } from "react";
import { Search, MapPin, TrendingUp, CheckCircle2 } from "lucide-react";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

const ROTATING_WORDS = [
  "talk about",
  "excited to start",
  "proud of",
  "worth the leap",
];

export default function Hero() {
  const [wordIndex, setWordIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setWordIndex((i) => (i + 1) % ROTATING_WORDS.length);
        setVisible(true);
      }, 220);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative overflow-hidden pt-[88px] pb-16">
      <div className="absolute -top-[180px] -right-[160px] w-[620px] h-[620px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(79,70,229,0.16),rgba(20,184,166,0.10)_55%,transparent_72%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <div>
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--primary-light)] text-[var(--primary-dark)] text-[13px] font-semibold border border-[#e0e7ff] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
            3,200+ companies hiring now
          </span>

          <h1 className="font-display text-[52px] font-extrabold leading-[1.08] text-[var(--text-primary)] mb-6 tracking-tight">
            Find work you&apos;re
            <br />
            proud to{" "}
            <span
              className={`inline-block text-[var(--primary)] transition-opacity duration-200 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
            >
              {ROTATING_WORDS[wordIndex]}
            </span>
            .
          </h1>

          <p className="text-[17.5px] text-[var(--text-secondary)] max-w-[480px] mb-8">
            Talvix connects ambitious people with fast-growing teams. No noise,
            no spam applications — just roles worth applying to.
          </p>

          <div className="bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] p-2.5 flex flex-col sm:flex-row gap-2 max-w-[640px] mb-8">
            <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-[var(--radius-md)]">
              <Search className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" />
              <input
                type="text"
                placeholder="Job title or keyword"
                className="border-none outline-none text-[14.5px] w-full bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
            </div>
            <div className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-[var(--radius-md)] sm:border-l border-t sm:border-t-0 border-[var(--border)]">
              <MapPin className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" />
              <input
                type="text"
                placeholder="Remote or city"
                className="border-none outline-none text-[14.5px] w-full bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
              />
            </div>
            <Button variant="primary" icon={<Search className="w-4 h-4" />}>
              Search
            </Button>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex">
              {[
                { i: "JK", c: "#4f46e5" },
                { i: "MR", c: "#14b8a6" },
                { i: "SL", c: "#d97706" },
                { i: "+", c: "#0f172a" },
              ].map((a, idx) => (
                <span
                  key={idx}
                  style={{
                    backgroundColor: a.c,
                    marginLeft: idx === 0 ? 0 : -10,
                  }}
                  className="w-8 h-8 rounded-full border-[2.5px] border-[var(--bg)] flex items-center justify-center text-[11px] font-bold text-white"
                >
                  {a.i}
                </span>
              ))}
            </div>
            <small className="text-[13.5px] text-[var(--text-secondary)] font-medium">
              Joined by 48,000+ job seekers this month
            </small>
          </div>
        </div>

        <div className="relative h-[460px] hidden md:block">
          <div className="absolute top-0 right-10 w-[220px] bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] p-6 animate-[float_6s_ease-in-out_infinite]">
            <div className="font-display text-[30px] font-extrabold text-[var(--primary)]">
              92%
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-0.5">
              Interview response rate on Talvix
            </div>
            <div className="flex items-center gap-1 mt-2 text-[var(--success)] text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" /> +18% vs. last quarter
            </div>
          </div>

          <div className="absolute bottom-10 left-0 w-[280px] bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] p-6 animate-[float_7s_ease-in-out_infinite_0.4s]">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-10 h-10 rounded-[10px] bg-[var(--accent-light)] flex items-center justify-center text-[var(--accent)] font-bold text-[15px]">
                N
              </div>
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)]">
                  Senior Product Designer
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  Nimbus · Remote
                </div>
              </div>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <Badge>Full-time</Badge>
              <Badge>Design</Badge>
              <Badge variant="success">Actively hiring</Badge>
            </div>
          </div>

          <div className="absolute top-[190px] left-8 w-[168px] bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] p-6 flex flex-col items-center text-center gap-1.5 animate-[float_5.5s_ease-in-out_infinite_0.8s]">
            <div className="w-[34px] h-[34px] rounded-full bg-[var(--primary-light)] flex items-center justify-center text-[var(--primary)]">
              <CheckCircle2 className="w-[18px] h-[18px]" />
            </div>
            <div className="text-[13px] font-bold">Verified employers</div>
            <div className="text-[11.5px] text-[var(--text-muted)]">
              Every listing reviewed
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
