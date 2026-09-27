import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import Footer from "../components/layout/Footer";

const CONTACT_DETAILS = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@talvix.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+1 (415) 555-0134",
  },
  {
    icon: MapPin,
    label: "Office",
    value: "148 Market Street, San Francisco, CA",
  },
  {
    icon: Clock,
    label: "Hours",
    value: "Mon–Fri, 9am–6pm PT",
  },
];

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    // Static form for now — no submit action wired up yet.
    e.preventDefault();
  };

  return (
    <>
      {/* Intro */}
      <header className="relative overflow-hidden bg-slate-50 py-20 font-inter">
        <div
          className="pointer-events-none absolute inset-0 z-0 opacity-45"
          style={{
            backgroundImage:
              "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="pointer-events-none absolute -right-[100px] -top-16 z-0 h-[480px] w-[480px] bg-[radial-gradient(circle_at_60%_40%,rgba(20,184,166,0.12)_0%,transparent_65%)]" />

        <div className="relative z-[1] mx-auto max-w-[640px] px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-[7px] rounded-full border border-indigo-600/15 bg-indigo-600/[0.07] px-[13px] py-[5px] text-xs font-semibold text-indigo-600">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
            Get in touch
          </div>

          <h1 className="mb-5 font-sora text-[clamp(32px,4.2vw,48px)] font-extrabold leading-[1.12] tracking-[-0.026em] text-slate-900">
            We'd like to hear from you.
          </h1>

          <p className="mx-auto max-w-[480px] text-base leading-[1.7] text-slate-600">
            Questions about a listing, a partnership, or just want to say hello
            — send us a note and we'll get back to you.
          </p>
        </div>
      </header>

      {/* Details + Form */}
      <section className="bg-white py-20 font-inter">
        <div className="mx-auto grid max-w-[1000px] grid-cols-1 gap-12 px-6 md:grid-cols-[0.85fr_1.15fr]">
          {/* Contact details */}
          <div className="flex flex-col gap-5">
            {CONTACT_DETAILS.map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="flex items-start gap-3.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[9px] bg-indigo-600/10 text-indigo-600">
                  <Icon size={16} />
                </div>
                <div>
                  <div className="text-[11.5px] font-medium text-slate-400">
                    {label}
                  </div>
                  <div className="text-[14px] font-semibold text-slate-900">
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-7"
          >
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="jane@company.com"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">
                Subject
              </label>
              <input
                type="text"
                placeholder="How can we help?"
                className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400"
              />
            </div>

            <div className="mb-6">
              <label className="mb-1.5 block text-[12.5px] font-semibold text-slate-700">
                Message
              </label>
              <textarea
                rows={5}
                placeholder="Tell us a bit more..."
                className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-indigo-400"
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 rounded-[11px] bg-indigo-600 px-5 py-2.5 text-[13.5px] font-semibold text-white shadow-[0_2px_8px_rgba(79,70,229,0.3)] transition-all hover:-translate-y-px hover:bg-indigo-700 hover:shadow-[0_4px_16px_rgba(79,70,229,0.4)] active:translate-y-0"
            >
              <Send size={13} />
              Send message
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </>
  );
}
