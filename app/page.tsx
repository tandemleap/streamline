"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

interface Message {
  role: "user" | "assistant";
  content: string;
}

// ─── Scroll-fade hook ───────────────────────────────────────────────────────

function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return ref;
}

// ─── Eyebrow ────────────────────────────────────────────────────────────────

function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p
      className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-4"
      style={{
        fontFamily: "var(--font-dm-sans), sans-serif",
        color: light ? "#D4A574" : "#888",
      }}
    >
      {children}
    </p>
  );
}

// ─── Hero Rotating Phrase ───────────────────────────────────────────────────

const ENTITY_PHRASES = ["business", "non-profit", "organization"];

function HeroEntityPhrase({ visible }: { visible: boolean }) {
  const [index, setIndex] = useState(0);
  const [entityVisible, setEntityVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;
    // Offset by 1.4s so entity and phrase rotations stay out of sync
    const delay = setTimeout(() => {
      const cycle = setInterval(() => {
        setEntityVisible(false);
        setTimeout(() => {
          setIndex((i) => (i + 1) % ENTITY_PHRASES.length);
          setEntityVisible(true);
        }, 600);
      }, 6800); // Not a multiple of 2.8s — naturally drifts apart
      return () => clearInterval(cycle);
    }, 1400);
    return () => clearTimeout(delay);
  }, [visible]);

  return (
    <span
      style={{
        opacity: visible && entityVisible ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    >
      {ENTITY_PHRASES[index]}
    </span>
  );
}

const HERO_PHRASES = [
  "slowing you down.",
  "still being done by hand.",
  "getting in the way of growth.",
  "stealing your best hours.",
  "getting between you and your craft.",
  "making you feel like you're always behind.",
  "eating your time.",
  "driving you crazy.",
  "making you less efficient.",
  "still running on clunky spreadsheets.",
];

function HeroRotatingPhrase({ visible }: { visible: boolean }) {
  const [index, setIndex] = useState(0);
  const [phraseVisible, setPhraseVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;
    const cycle = setInterval(() => {
      setPhraseVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % HERO_PHRASES.length);
        setPhraseVisible(true);
      }, 600);
    }, 2800);
    return () => clearInterval(cycle);
  }, [visible]);

  return (
    <span
      style={{
        color: "#D4A574",
        fontSize: "clamp(22px, 3.2vw, 52px)",
        opacity: visible && phraseVisible ? 1 : 0,
        transition: phraseVisible ? "opacity 0.6s ease" : "opacity 0.6s ease",
      }}
    >
      {HERO_PHRASES[index]}
    </span>
  );
}

// ─── Hero Section ───────────────────────────────────────────────────────────

function HeroSection() {
  const [wordsVisible, setWordsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setWordsVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Full-width background image */}
      <Image
        src="/slowdown.png"
        alt="Something's slowing your business down"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Dark overlay for readability */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: "rgba(0,0,0,0.58)" }}
      />

      {/* Nav */}
      <nav
        className="relative z-20 flex items-center justify-between px-8 md:px-16 py-6"
        style={{
          opacity: wordsVisible ? 1 : 0,
          transition: "opacity 0.6s ease 0.1s",
        }}
      >
        <Image
          src="/logo.png"
          alt="Streamline Workshop"
          width={360}
          height={96}
          className="object-contain"
          style={{ maxHeight: "96px", width: "auto" }}
        />
      </nav>

      {/* Content — anchored to bottom-left */}
      <div className="relative z-20 flex-1 flex items-end px-8 md:px-16 pb-20 md:pb-28">
        <div style={{ maxWidth: "1000px" }}>
          <h1
            className="font-black mb-6"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              letterSpacing: "-0.03em",
              lineHeight: "1.15",
            }}
          >
            <span className="block overflow-hidden" style={{ paddingBottom: "0.12em" }}>
              <span
                className="hero-word block"
                style={{
                  color: "#ffffff",
                  fontSize: "clamp(22px, 3vw, 43px)",
                  animationDelay: wordsVisible ? "0s" : "9999s",
                  animationPlayState: wordsVisible ? "running" : "paused",
                }}
              >
                In every small <HeroEntityPhrase visible={wordsVisible} />, something is
              </span>
            </span>
            <span
              className="block"
              style={{
                minHeight: "clamp(26px, 3.8vw, 62px)",
                marginTop: "0.1em",
                opacity: wordsVisible ? 1 : 0,
                transition: "opacity 0.5s ease 0.3s",
              }}
            >
              <HeroRotatingPhrase visible={wordsVisible} />
            </span>
          </h1>

          <a
            id="hero-cta"
            href="#chat"
            className="inline-block font-semibold"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              background: "#D4A574",
              color: "#1a1a1a",
              fontSize: "clamp(15px, 1.5vw, 18px)",
              letterSpacing: "0.01em",
              padding: "0.6em 1.6em",
              opacity: wordsVisible ? 1 : 0,
              transform: wordsVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.6s ease 0.65s, transform 0.6s ease 0.65s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#c49060";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#D4A574";
            }}
          >
            Let&apos;s fix it.
          </a>

        </div>
      </div>

      {/* Scroll indicator */}
      <div className="relative z-20 flex justify-center pb-8 scroll-indicator-wrap">
        <div className="scroll-indicator">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            style={{ color: "#D4A574" }}
          >
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}

// ─── Who We Are Section ─────────────────────────────────────────────────────

function WhoWeAreSection() {
  const ref = useFadeUp();

  return (
    <section
      className="pt-24 md:pt-36 pb-12 md:pb-16 px-8 md:px-16"
      style={{ background: "#f5f1ed" }}
    >
      <div ref={ref} className="fade-up max-w-4xl mx-auto">
        <Eyebrow>WHAT WE DO</Eyebrow>

        <h2
          className="font-bold mb-5 leading-tight"
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            color: "#1a1a1a",
            fontSize: "clamp(22px, 2.8vw, 32px)",
            letterSpacing: "-0.02em",
          }}
        >
          You already know what&apos;s slowing you down.
        </h2>

        {/* Grid: text left, image right — image drives row height */}
        <div className="grid grid-cols-1 md:grid-cols-[42%_58%] gap-10 items-stretch">

          {/* Text — fills the same height as the image */}
          <div
            className="flex flex-col justify-between"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              color: "#2a2a2a",
              fontSize: "16px",
              lineHeight: "1.65",
            }}
          >
            <p>
              You&apos;re probably handling it the same way you always have — a
              spreadsheet, a notebook, a system that lives mostly in your head. It
              works, mostly. But it&apos;s eating your time and you know it.
            </p>
            <p>
              Here&apos;s something worth knowing: <strong>for the first time in history,
              a genuine mom and pop shop can afford a custom built solution.</strong> Not
              a software subscription that almost fits. Something built
              specifically around the way your business actually works.
            </p>
            <p>
              That&apos;s what we do. You tell us what&apos;s making you crazy.
              We listen, figure out if we can help, and build something that fixes
              it. And if your problem isn&apos;t something we can solve,
              we&apos;ll tell you that straight and won&apos;t waste your time.
            </p>
          </div>

          {/* Image — natural 3:2 aspect ratio drives the row height */}
          <div>
            <Image
              src="/what-we-do.png"
              alt="The contrast between a cluttered small business office and a clean modern workspace"
              width={1536}
              height={1024}
              style={{ width: "100%", height: "auto", display: "block" }}
              className="rounded-sm"
            />
            <p
              className="mt-2 italic"
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                color: "#888",
                fontSize: "12px",
                lineHeight: "1.5",
              }}
            >
              If your office looks like the right side of this photo, we should talk.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Rotating Phrase ────────────────────────────────────────────────────────

const PHRASES = [
  "what's slowing you down.",
  "what's driving you crazy.",
  "where the friction is.",
  "what's not working.",
  "about a problem you haven't known how to solve.",
  "what's eating your time.",
  "what makes you want to throw your laptop.",
  "where you're stuck.",
  "what should take minutes but takes hours.",
  "what's broken.",
  "what's the most annoying part of your week.",
];

const STOPPED_PHRASE = "what's not working.";
const STOPPED_INDEX = PHRASES.indexOf(STOPPED_PHRASE);

function RotatingPhrase({ stopped }: { stopped: boolean }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (stopped) {
      setVisible(false);
      const t = setTimeout(() => {
        setIndex(STOPPED_INDEX);
        setVisible(true);
      }, 600);
      return () => clearTimeout(t);
    }

    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % PHRASES.length);
        setVisible(true);
      }, 600);
    }, 2800);
    return () => clearInterval(cycle);
  }, [stopped]);

  return (
    <span
      style={{
        color: "#D4A574",
        display: "inline",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}
    >
      {PHRASES[index]}
    </span>
  );
}

// ─── Intake Form ────────────────────────────────────────────────────────────

function IntakeForm() {
  const [fields, setFields] = useState({
    name: "",
    businessType: "",
    painPoints: "",
    value: "",
    contact: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFields((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!fields.name.trim() || !fields.contact.trim()) {
      setError("Please fill in your name and how Scott can reach you.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/intake-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    fontFamily: "var(--font-dm-sans), sans-serif",
    background: "#1a1a1a",
    color: "#f0f0f0",
    border: "1px solid #2a2a2a",
    borderRadius: "2px",
    fontSize: "15px",
    padding: "10px 14px",
    width: "100%",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "var(--font-dm-sans), sans-serif",
    color: "#888",
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    display: "block",
    marginBottom: "6px",
  };

  if (submitted) {
    return (
      <div
        className="rounded-sm p-8 text-center"
        style={{ background: "#0d0d0d", border: "1px solid #2a2a2a" }}
      >
        <p
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            color: "#D4A574",
            fontSize: "18px",
            fontWeight: 600,
            marginBottom: "10px",
          }}
        >
          Got it. Thanks for reaching out.
        </p>
        <p
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            color: "#888",
            fontSize: "14px",
            lineHeight: "1.65",
          }}
        >
          Scott will personally review what you shared and be in touch within 48
          hours.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "#0d0d0d", border: "1px solid #2a2a2a" }}
    >
      <div className="p-6 space-y-5">
        {/* Name */}
        <div>
          <label style={labelStyle}>Your name</label>
          <input
            type="text"
            name="name"
            value={fields.name}
            onChange={handleChange}
            placeholder="First name is fine"
            style={inputStyle}
          />
        </div>

        {/* Business type */}
        <div>
          <label style={labelStyle}>Type of business</label>
          <input
            type="text"
            name="businessType"
            value={fields.businessType}
            onChange={handleChange}
            placeholder="e.g. landscaping company, dental practice, online store..."
            style={inputStyle}
          />
        </div>

        {/* Pain points */}
        <div>
          <label style={labelStyle}>
            Think about your typical week. What tasks feel repetitive,
            frustrating, or harder than they should be?
          </label>
          <textarea
            name="painPoints"
            value={fields.painPoints}
            onChange={handleChange}
            placeholder="Don't filter — the unglamorous stuff is often exactly what we're best at."
            rows={4}
            style={{ ...inputStyle, resize: "vertical", lineHeight: "1.65" }}
          />
        </div>

        {/* Value */}
        <div>
          <label style={labelStyle}>
            If this problem was solved, what would that be worth? Time saved,
            money recovered, sanity restored — whatever fits.
          </label>
          <input
            type="text"
            name="value"
            value={fields.value}
            onChange={handleChange}
            placeholder="e.g. 5 hours a week, $500/month in mistakes, just a lot of stress..."
            style={inputStyle}
          />
        </div>

        {/* Contact */}
        <div>
          <label style={labelStyle}>Best way for Scott to reach you</label>
          <input
            type="text"
            name="contact"
            value={fields.contact}
            onChange={handleChange}
            placeholder="Phone, email, whatever works for you"
            style={inputStyle}
          />
        </div>

        {error && (
          <p
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              color: "#e07070",
              fontSize: "13px",
            }}
          >
            {error}
          </p>
        )}
      </div>

      {/* Submit */}
      <div
        className="px-6 pb-6"
        style={{ borderTop: "1px solid #1a1a1a" }}
      >
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full py-3 font-semibold text-sm transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg"
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            background: "#D4A574",
            color: "#1a1a1a",
            fontSize: "14px",
            marginTop: "16px",
          }}
          onMouseEnter={(e) => {
            if (!(e.currentTarget as HTMLButtonElement).disabled)
              (e.currentTarget as HTMLButtonElement).style.background = "#c49060";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#D4A574";
          }}
        >
          {submitting ? "Sending..." : "Send it to Scott"}
        </button>
      </div>
    </div>
  );
}

// ─── Modal ──────────────────────────────────────────────────────────────────

function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      style={{ background: "rgba(0,0,0,0.8)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-xl"
        style={{ background: "#f5f1ed" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full z-10 transition-colors duration-150"
          style={{ background: "#e0dbd5", color: "#555", fontSize: "20px", lineHeight: 1 }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#d0cac4"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#e0dbd5"; }}
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}

// ─── Who We Are Content ──────────────────────────────────────────────────────

function WhoWeAreContent() {
  return (
    <div className="p-8 md:p-10">
      <p
        className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-4"
        style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#888" }}
      >
        WHO WE ARE
      </p>
      <h2
        className="font-bold mb-6 leading-tight"
        style={{
          fontFamily: "var(--font-dm-sans), sans-serif",
          color: "#1a1a1a",
          fontSize: "clamp(26px, 3.5vw, 40px)",
          letterSpacing: "-0.02em",
        }}
      >
        We&apos;re not a software company.
      </h2>

      {/* Team photo */}
      <div className="relative w-full mb-6 overflow-hidden rounded-lg">
        <Image
          src="/team-photo.jpg"
          alt="Scott and Corazon"
          width={800}
          height={600}
          style={{ width: "100%", height: "auto", display: "block" }}
          className="object-cover object-top"
        />
        <div
          className="absolute bottom-0 left-0 right-0 pb-3 px-3 pt-8"
          style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.55))" }}
        >
          <p
            className="italic text-center"
            style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#ddd", fontSize: "12px" }}
          >
            Scott and Corazon. Washburn, Wisconsin.
          </p>
        </div>
      </div>

      <div
        className="space-y-4"
        style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#2a2a2a", fontSize: "16px", lineHeight: "1.65" }}
      >
        <p>
          Running a small business means wearing every hat — owner, scheduler,
          bookkeeper, closer — all before lunch. You&apos;ve heard that AI is
          changing everything. Maybe it is. But if you don&apos;t have time to
          figure out what that means for your business, that&apos;s where we come in.
        </p>
        <p>
          Streamline Workshop is Scott and Corazon, a foster dad and daughter
          from Washburn, Wisconsin. We listen to what&apos;s slowing your business
          down — or just making you crazy — and build something that fixes it.
          Custom, not off the shelf. Built around how you actually work.
        </p>
        <p>
          What we&apos;re doing is genuinely new. Custom built solutions for small
          businesses weren&apos;t really possible a year ago. The tools have changed
          dramatically and we&apos;re learning by building real things for real
          people — not running experiments in a vacuum. We won&apos;t take on work
          we can&apos;t deliver. If your problem isn&apos;t something we can solve,
          we&apos;ll tell you upfront and won&apos;t waste your time.
        </p>
        <p>
          We have zero overhead and no investors to answer to. That means we can
          work with real small business budgets and still deliver genuine value.
          We&apos;re also taking on a handful of clients for free while we build
          our portfolio — so tell us your story.
        </p>
        <p>
          Scott has always believed you learn by building — get in a little over
          your head, figure it out, finish it. This business isn&apos;t just
          helping Corazon become the first person in her family to go to college,
          it&apos;s part of her education, helping her build skills she&apos;ll
          need no matter what the future looks like.
        </p>
      </div>
    </div>
  );
}

// ─── What We Can Build Content ───────────────────────────────────────────────

const EXAMPLES = [
  {
    category: "Service Business",
    headline: "The Never-Ending Reminder Loop",
    problem: "Owner manually texts appointment reminders, follows up on unpaid invoices, and chases no-shows — every single week, by hand.",
    fix: "Automated system sends reminders on schedule, tracks responses, and flags overdue accounts. Set it up once, stop thinking about it.",
  },
  {
    category: "Retail / Wellness / Fitness",
    headline: "The Software That Almost Fits",
    problem: "Paying $150/month for a bloated platform that does 90% more than needed — and still doesn't quite work the way the business does.",
    fix: "A lightweight custom tool built around the actual workflow. No subscription. No features nobody uses. Just what you need.",
  },
  {
    category: "Professional Services",
    headline: "The Document Chase",
    problem: "Clients send the wrong documents, in the wrong format, at the wrong time. Hours wasted every week chasing people by email.",
    fix: "Client intake portal with guided uploads, status tracking, and automatic acknowledgments. Staff stops chasing. Clients know what to send.",
  },
  {
    category: "Non-Profit / Community Org",
    headline: "The Paper Sign-In Sheet",
    problem: "Client visits tracked on paper or a spreadsheet. Every grant report means manually counting rows and hoping nothing got lost.",
    fix: "Simple digital check-in captures name, date, and service provided. Auto-generates monthly summaries ready for funders — no counting required.",
  },
  {
    category: "Non-Profit / Program Org",
    headline: "The Registration Email Avalanche",
    problem: "Families register via email or PDF. Staff manually enters data, sends confirmations, tracks capacity — and still misses things.",
    fix: "Online registration feeds a database, sends confirmations automatically, notifies staff, and shows real-time capacity. No more inbox triage.",
  },
  {
    category: "Any Business or Org",
    headline: "The FAQ Inbox",
    problem: "Staff answering the same 10 questions over and over — by email, phone, or Facebook message. Every single day.",
    fix: "AI assistant on the website handles common questions, qualifies real inquiries, and only escalates what actually needs a human.",
  },
];

function WhatWeCanBuildContent() {
  return (
    <div className="p-6 md:p-8">
      <p
        className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-4"
        style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#888" }}
      >
        WHAT WE CAN BUILD
      </p>
      <h2
        className="font-bold mb-2 leading-tight"
        style={{
          fontFamily: "var(--font-dm-sans), sans-serif",
          color: "#1a1a1a",
          fontSize: "clamp(24px, 3vw, 36px)",
          letterSpacing: "-0.02em",
        }}
      >
        Problems we&apos;re good at solving.
      </h2>
      <p
        className="mb-6"
        style={{ fontFamily: "var(--font-dm-sans), sans-serif", color: "#666", fontSize: "14px", lineHeight: "1.6" }}
      >
        <span className="hidden md:inline">Hover a card to see the full picture. </span>These are the kinds of problems we hear most — and fix best.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EXAMPLES.map((ex) => (
          <div
            key={ex.headline}
            className="example-card rounded-xl p-5 flex flex-col"
            style={{ background: "#111" }}
          >
            {/* Amber top accent */}
            <div
              style={{
                height: "2px",
                background: "linear-gradient(90deg, #D4A574, transparent)",
                marginBottom: "14px",
                borderRadius: "1px",
              }}
            />

            {/* Category tag */}
            <p
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                color: "#D4A574",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: "8px",
              }}
            >
              {ex.category}
            </p>

            {/* Headline */}
            <h3
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                color: "#ffffff",
                fontSize: "17px",
                fontWeight: 700,
                lineHeight: "1.3",
                letterSpacing: "-0.01em",
              }}
            >
              {ex.headline}
            </h3>

            {/* Hover hint — desktop only, fades out on hover */}
            <p
              className="card-hint mt-3"
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                color: "#444",
                fontSize: "12px",
              }}
            >
              — more —
            </p>

            {/* Reveal content */}
            <div className="card-reveal">
              <p
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  color: "#D4A574",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "5px",
                }}
              >
                The Problem
              </p>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  color: "#999",
                  fontSize: "14px",
                  lineHeight: "1.6",
                  marginBottom: "14px",
                }}
              >
                {ex.problem}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  color: "#D4A574",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: "5px",
                }}
              >
                The Fix
              </p>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  color: "#d0d0d0",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                {ex.fix}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Chatbot Section ────────────────────────────────────────────────────────

function ChatbotSection() {
  const headlineRef = useFadeUp();
  const chatRef = useFadeUp();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showWhoWeAre, setShowWhoWeAre] = useState(false);
  const [showWhatWeCanBuild, setShowWhatWeCanBuild] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Scroll within the chat container (not the page) when messages change
  useEffect(() => {
    if (messages.length === 0) return;
    const el = chatScrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isLoading]);

  const sendMessage = useCallback(async (userMessages: Message[]) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: userMessages }),
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const text: string = data.text || "";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: text },
      ]);

      if (data.conversationComplete) {
        setIsComplete(true);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, something went wrong. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize chatbot when section becomes visible
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || initialized) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !initialized) {
          setInitialized(true);
          sendMessage([]);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [initialized, sendMessage]);

  const handleSend = () => {
    if (!input.trim() || isLoading || isComplete) return;
    if (input.trim().toLowerCase() === "form") {
      setShowForm(true);
      setInput("");
      return;
    }
    const userMsg: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    sendMessage(updatedMessages);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section
      id="chat"
      ref={sectionRef}
      className="pt-12 md:pt-16 pb-24 md:pb-36 px-8 md:px-16"
      style={{ background: "#4A3929" }}
    >
      <div className="max-w-5xl mx-auto">

        {/* Mobile-only: question buttons above headline */}
        <div className="flex gap-3 mb-8 md:hidden">
          {[
            { label: "Who We Are", onClick: () => setShowWhoWeAre(true) },
            { label: "What We Can Build", onClick: () => setShowWhatWeCanBuild(true) },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={btn.onClick}
              className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-150"
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                background: "transparent",
                color: "#c9a87c",
                border: "1px solid #6b4e35",
                fontSize: "13px",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#c9a87c"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#6b4e35"; }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Desktop: sidebar + chat grid */}
        <div className="md:grid md:grid-cols-[200px_1fr] md:gap-12 md:items-start">

          {/* Sidebar — desktop only */}
          <div className="hidden md:flex md:flex-col md:pt-2">
            <p
              className="mb-5 leading-snug"
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                color: "#c9a87c",
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >
              Questions before you dive in?
            </p>
            {[
              { label: "Who We Are", onClick: () => setShowWhoWeAre(true) },
              { label: "What We Can Build", onClick: () => setShowWhatWeCanBuild(true) },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={btn.onClick}
                className="mb-3 py-2.5 px-4 rounded-lg text-left font-medium transition-colors duration-150"
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  background: "transparent",
                  color: "#e8d5be",
                  border: "1px solid #6b4e35",
                  fontSize: "14px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#c9a87c";
                  (e.currentTarget as HTMLButtonElement).style.color = "#D4A574";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#6b4e35";
                  (e.currentTarget as HTMLButtonElement).style.color = "#e8d5be";
                }}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Chat column */}
          <div>
        {/* Headline */}
        <div ref={headlineRef} className="fade-up mb-12">
          <Eyebrow light>GET STARTED</Eyebrow>
          <h2
            className="font-black leading-none"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              fontSize: "clamp(30px, 4.25vw, 54px)",
              letterSpacing: "-0.03em",
              minHeight: "calc(2.2 * clamp(30px, 4.25vw, 54px))",
            }}
          >
            <span style={{ color: "#ffffff" }}>Tell us </span><RotatingPhrase stopped={messages.some(m => m.role === "user")} />
          </h2>
        </div>

        {/* Chat window or intake form */}
        <div ref={chatRef} className="fade-up stagger-2">
          {showForm ? (
            <IntakeForm />
          ) : (
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: "#0d0d0d",
              border: "1px solid #2a2a2a",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
            }}
          >
            {/* Header bar */}
            <div
              className="flex items-center gap-3 px-5 py-3 border-b"
              style={{ background: "#111", borderColor: "#2a2a2a" }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: "#D4A574" }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#1a1a1a",
                    letterSpacing: "0.05em",
                  }}
                >
                  SW
                </span>
              </div>
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "#f0f0f0",
                    lineHeight: 1,
                    marginBottom: "3px",
                  }}
                >
                  Streamline Workshop
                </p>
                <div className="flex items-center gap-1.5">
                  <span
                    className="online-dot w-1.5 h-1.5 rounded-full inline-block"
                    style={{ background: "#4ade80" }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      fontSize: "11px",
                      color: "#666",
                    }}
                  >
                    Online
                  </span>
                </div>
              </div>
            </div>

            {/* Message area */}
            <div
              ref={chatScrollRef}
              className="chat-scroll overflow-y-auto px-5 py-5"
              style={{ minHeight: "320px", maxHeight: "480px" }}
            >
              <div className="space-y-2">
              {messages.map((msg, i) => {
                const isUser = msg.role === "user";
                const prevMsg = messages[i - 1];
                const nextMsg = messages[i + 1];
                const isFirstInGroup = !prevMsg || prevMsg.role !== msg.role;
                const isLastInGroup = !nextMsg || nextMsg.role !== msg.role;

                // iMessage-style asymmetric corners
                const borderRadius = isUser
                  ? isLastInGroup
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 18px"
                  : isLastInGroup
                    ? "18px 18px 18px 4px"
                    : "18px 18px 18px 18px";

                return (
                  <div
                    key={i}
                    className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
                    style={{ marginTop: isFirstInGroup && i > 0 ? "12px" : undefined }}
                  >
                    {/* Bot avatar — only on last bubble in group */}
                    {!isUser && (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{
                          background: isLastInGroup ? "#D4A574" : "transparent",
                          marginBottom: "2px",
                        }}
                      >
                        {isLastInGroup && (
                          <span
                            style={{
                              fontFamily: "var(--font-dm-sans), sans-serif",
                              fontSize: "8px",
                              fontWeight: 700,
                              color: "#1a1a1a",
                            }}
                          >
                            SW
                          </span>
                        )}
                      </div>
                    )}

                    <div
                      className="max-w-[78%] px-4 py-2.5"
                      style={{
                        fontFamily: "var(--font-dm-sans), sans-serif",
                        background: isUser
                          ? "linear-gradient(135deg, #D4A574 0%, #c08040 100%)"
                          : "#1e1e1e",
                        color: isUser ? "#1a1a1a" : "#e8e8e8",
                        fontSize: "15px",
                        lineHeight: "1.6",
                        whiteSpace: "pre-wrap",
                        borderRadius,
                        border: isUser ? "none" : "1px solid #2e2e2e",
                        boxShadow: isUser
                          ? "0 2px 8px rgba(212,165,116,0.25)"
                          : "0 1px 4px rgba(0,0,0,0.3)",
                      }}
                    >
                      {msg.content}
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex items-end gap-2 justify-start" style={{ marginTop: "12px" }}>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: "#D4A574", marginBottom: "2px" }}
                  >
                    <span style={{ fontFamily: "var(--font-dm-sans), sans-serif", fontSize: "8px", fontWeight: 700, color: "#1a1a1a" }}>SW</span>
                  </div>
                  <div
                    className="px-4 py-3 flex gap-1 items-center"
                    style={{
                      background: "#1e1e1e",
                      border: "1px solid #2e2e2e",
                      borderRadius: "18px 18px 18px 4px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                    }}
                  >
                    <span className="typing-dot w-1.5 h-1.5 rounded-full" style={{ background: "#D4A574" }} />
                    <span className="typing-dot w-1.5 h-1.5 rounded-full" style={{ background: "#D4A574" }} />
                    <span className="typing-dot w-1.5 h-1.5 rounded-full" style={{ background: "#D4A574" }} />
                  </div>
                </div>
              )}
              </div>
            </div>

            {/* Input area */}
            {!isComplete && (
              <div
                className="px-4 py-3 border-t"
                style={{ background: "#111", borderColor: "#222" }}
              >
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-full"
                  style={{ background: "#1e1e1e", border: "1px solid #333" }}
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={initialized ? "Type your message..." : "One moment..."}
                    disabled={isLoading || !initialized}
                    className="flex-1 bg-transparent outline-none disabled:opacity-40"
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      color: "#f0f0f0",
                      fontSize: "15px",
                    }}
                  />
                  <button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim() || !initialized}
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-150 disabled:opacity-30 disabled:cursor-not-allowed"
                    style={{ background: "#D4A574" }}
                    onMouseEnter={(e) => {
                      if (!(e.currentTarget as HTMLButtonElement).disabled)
                        (e.currentTarget as HTMLButtonElement).style.background = "#c49060";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.background = "#D4A574";
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {isComplete && (
              <div
                className="px-5 py-4 border-t text-center"
                style={{
                  background: "#111",
                  borderColor: "#222",
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  color: "#D4A574",
                  fontSize: "14px",
                }}
              >
                Conversation complete. Scott will be in touch soon.
              </div>
            )}
          </div>
          )}

          <p
            className="mt-4 text-center"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              color: "#c9a87c",
              fontSize: "13px",
            }}
          >
            Tell us your story. Let&apos;s see if we can help.
          </p>
        </div>
          </div> {/* end chat column */}
        </div> {/* end desktop grid */}
      </div>

      {/* Modals */}
      <Modal open={showWhoWeAre} onClose={() => setShowWhoWeAre(false)}>
        <WhoWeAreContent />
      </Modal>
      <Modal open={showWhatWeCanBuild} onClose={() => setShowWhatWeCanBuild(false)}>
        <WhatWeCanBuildContent />
      </Modal>

    </section>
  );
}

// ─── What Happens Next Section ──────────────────────────────────────────────

function WhatHappensNextSection() {
  const wrapRef = useFadeUp();

  const steps = [
    {
      number: "01",
      headline: "Have a real conversation.",
      body: "The AI assistant below will ask you a few questions about your business and what's making you crazy. Not a form. An actual back-and-forth that takes about five minutes.",
    },
    {
      number: "02",
      headline: "Scott reads everything.",
      body: "When the conversation wraps up, Scott personally reviews the full transcript. Within 48 hours he'll reach out directly — no middleman, no sales pitch.",
    },
    {
      number: "03",
      headline: "You get a straight answer.",
      body: "Scott will tell you honestly whether this is something we can build, roughly what it might look like, and what it would cost. If it's not in our wheelhouse, he'll tell you that too.",
    },
  ];

  return (
    <section
      className="pt-12 md:pt-16 pb-12 md:pb-16 px-8 md:px-16"
      style={{ background: "#1a1a1a" }}
    >
      <div ref={wrapRef} className="fade-up max-w-5xl mx-auto">
        <Eyebrow light>WHAT HAPPENS NEXT</Eyebrow>

        <h2
          className="font-bold mb-16 leading-tight"
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            color: "#ffffff",
            fontSize: "clamp(32px, 4vw, 52px)",
            letterSpacing: "-0.02em",
          }}
        >
          Here&apos;s exactly how it works.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
          {steps.map((step) => (
            <div key={step.number}>
              <div
                className="font-black leading-none mb-5"
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  color: "#D4A574",
                  fontSize: "clamp(52px, 6vw, 80px)",
                }}
              >
                {step.number}
              </div>
              <h3
                className="font-bold mb-2"
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  color: "#ffffff",
                  fontSize: "20px",
                }}
              >
                {step.headline}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  color: "#999",
                  fontSize: "17px",
                  lineHeight: "1.65",
                }}
              >
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer
      className="py-20 px-8 md:px-16 text-center"
      style={{ background: "#1a1a1a" }}
    >
      <div className="max-w-lg mx-auto">
        <div className="flex justify-center mb-6">
          <Image
            src="/logo.png"
            alt="Streamline Workshop"
            width={440}
            height={120}
            className="object-contain"
            style={{ maxHeight: "60px", width: "auto" }}
          />
        </div>
        <p
          className="mb-6"
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            color: "#ffffff",
            fontSize: "18px",
          }}
        >
          Custom solutions for the people doing the real work.
        </p>
        <p
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            color: "#444",
            fontSize: "12px",
          }}
        >
          &copy; 2025 Streamline Workshop
        </p>
      </div>
    </footer>
  );
}

// ─── Sticky CTA ─────────────────────────────────────────────────────────────

function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const heroBtn = document.getElementById("hero-cta");
    if (!heroBtn) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(heroBtn);
    return () => obs.disconnect();
  }, []);

  return (
    <a
      href="#chat"
      className="fixed bottom-6 right-6 z-50 font-semibold"
      style={{
        fontFamily: "var(--font-dm-sans), sans-serif",
        background: "#D4A574",
        color: "#1a1a1a",
        fontSize: "15px",
        letterSpacing: "0.01em",
        padding: "0.65em 1.4em",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = "#c49060";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = "#D4A574";
      }}
    >
      Let&apos;s fix it.
    </a>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main>
      <HeroSection />
      <WhoWeAreSection />
      <WhatHappensNextSection />
      <ChatbotSection />
      <Footer />
      <StickyCTA />
    </main>
  );
}
