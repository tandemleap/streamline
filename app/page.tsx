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

const HERO_PHRASES = [
  "slowing your business down.",
  "still being done by hand.",
  "getting in the way of growth.",
  "getting in the way of what you're good at.",
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
              fontSize: "clamp(41px, 5.95vw, 88px)",
              letterSpacing: "-0.03em",
              lineHeight: "1.1",
            }}
          >
            <span className="block overflow-hidden" style={{ paddingBottom: "0.12em" }}>
              <span
                className="hero-word block"
                style={{
                  color: "#ffffff",
                  animationDelay: wordsVisible ? "0s" : "9999s",
                  animationPlayState: wordsVisible ? "running" : "paused",
                }}
              >
                Something is
              </span>
            </span>
            <span
              className="block"
              style={{
                minHeight: "clamp(26px, 3.8vw, 62px)",
                marginTop: "-0.15em",
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
        <Eyebrow>WHO WE ARE</Eyebrow>

        <h2
          className="font-bold mb-5 leading-tight"
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            color: "#1a1a1a",
            fontSize: "clamp(32px, 4vw, 52px)",
            letterSpacing: "-0.02em",
          }}
        >
          We&apos;re not a software company.
        </h2>

        {/* First paragraph — full width above the grid */}
        <p
          className="mb-6"
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            color: "#2a2a2a",
            fontSize: "16px",
            lineHeight: "1.65",
          }}
        >
          Running a small business means wearing every hat — owner, scheduler,
          bookkeeper, closer — all before lunch. You&apos;ve heard that AI is
          changing everything. Maybe it is. But if you don&apos;t have time to
          figure out what that means for your business, that&apos;s where we
          come in.
        </p>

        {/* Grid: text left, image right — bottoms align via items-stretch */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_36%] gap-10 items-stretch">
          <div
            className="space-y-4"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              color: "#2a2a2a",
              fontSize: "16px",
              lineHeight: "1.65",
            }}
          >
            <p>
              Meet Scott and Corazon, a foster dad and daughter team.
              We listen to what&apos;s slowing your
              business down — or just making you crazy — and build something that
              fixes it. Custom, not off the shelf. Built around how you actually
              work.
            </p>
            <p>
              What we&apos;re doing is genuinely new. Custom built solutions for
              small businesses weren&apos;t really possible a year ago. The tools
              have changed dramatically and we&apos;re learning by building real
              things for real people — not running experiments in a vacuum. We
              won&apos;t take on work we can&apos;t deliver. If your problem
              isn&apos;t something we can solve, we&apos;ll tell you upfront and
              won&apos;t waste your time.
            </p>
            <p>
              We have zero overhead and no investors to answer to. That means we
              can work with real small business budgets and still deliver genuine
              value. We&apos;re also taking on a handful of clients for free while
              we build our portfolio — so tell us your story.
            </p>
            <p>
              Scott has always believed you learn by building — get in a little
              over your head, figure it out, finish it. This business isn&apos;t
              just helping Corazon become the first person in her family to go to
              college, it&apos;s part of her education, helping her build skills
              she&apos;ll need no matter what the future looks like.
            </p>
          </div>

          {/* Image fills the full height of the text column */}
          <div className="relative overflow-hidden min-h-[280px]">
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "rgba(212,165,116,0.1)", zIndex: 1 }}
            />
            {/* Caption overlay */}
            <div
              className="absolute bottom-0 left-0 right-0 pb-3 px-3 pt-8"
              style={{
                background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.55))",
                zIndex: 2,
              }}
            >
              <p
                className="italic text-center"
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  color: "#ddd",
                  fontSize: "12px",
                }}
              >
                Scott and Corazon. Washburn, Wisconsin.
              </p>
            </div>
            <Image
              src="/team-photo.jpg"
              alt="Scott and Corazon"
              fill
              className="object-cover object-top"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                img.src =
                  "https://placehold.co/520x640/1a1a1a/D4A574?text=Scott+%26+Corazon";
              }}
            />
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
      className="rounded-sm overflow-hidden"
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
          className="w-full py-3 font-semibold text-sm transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed rounded-sm"
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
      <div className="max-w-2xl mx-auto">
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
            className="rounded-sm overflow-hidden"
            style={{ background: "#0d0d0d", border: "1px solid #2a2a2a" }}
          >
            {/* Message area */}
            <div
              ref={chatScrollRef}
              className="chat-scroll overflow-y-auto p-5 space-y-4"
              style={{ minHeight: "320px", maxHeight: "480px" }}
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[82%] px-4 py-3 rounded-sm"
                    style={{
                      fontFamily: "var(--font-dm-sans), sans-serif",
                      background: msg.role === "user" ? "#D4A574" : "#2a2a2a",
                      color: msg.role === "user" ? "#1a1a1a" : "#f0f0f0",
                      fontSize: "15px",
                      lineHeight: "1.65",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className="px-4 py-3 rounded-sm flex gap-1 items-center"
                    style={{ background: "#2a2a2a" }}
                  >
                    <span
                      className="typing-dot w-1.5 h-1.5 rounded-full"
                      style={{ background: "#D4A574" }}
                    />
                    <span
                      className="typing-dot w-1.5 h-1.5 rounded-full"
                      style={{ background: "#D4A574" }}
                    />
                    <span
                      className="typing-dot w-1.5 h-1.5 rounded-full"
                      style={{ background: "#D4A574" }}
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Input area */}
            {!isComplete && (
              <div
                className="flex border-t"
                style={{ background: "#222", borderColor: "#2a2a2a" }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    initialized ? "Type your message..." : "One moment..."
                  }
                  disabled={isLoading || !initialized}
                  className="flex-1 bg-transparent px-4 py-4 outline-none disabled:opacity-40"
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    color: "#f0f0f0",
                    fontSize: "15px",
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim() || !initialized}
                  className="px-6 py-4 font-medium text-sm transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    fontFamily: "var(--font-dm-sans), sans-serif",
                    background: "#D4A574",
                    color: "#1a1a1a",
                    fontSize: "14px",
                  }}
                  onMouseEnter={(e) => {
                    if (!(e.currentTarget as HTMLButtonElement).disabled)
                      (e.currentTarget as HTMLButtonElement).style.background =
                        "#c49060";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background =
                      "#D4A574";
                  }}
                >
                  Send
                </button>
              </div>
            )}

            {isComplete && (
              <div
                className="px-5 py-4 border-t text-center"
                style={{
                  background: "#222",
                  borderColor: "#2a2a2a",
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
      </div>
    </section>
  );
}

// ─── What Happens Next Section ──────────────────────────────────────────────

function WhatHappensNextSection() {
  const wrapRef = useFadeUp();

  const steps = [
    {
      number: "01",
      headline: "You talk.",
      body: "Tell us what's slowing you down in a short conversation.",
    },
    {
      number: "02",
      headline: "We assess.",
      body: "We'll figure out quickly whether this is something we can fix.",
    },
    {
      number: "03",
      headline: "We build.",
      body: "You get something custom that actually fits your business.",
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
          Simple as it gets.
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
          We find the friction. We fix it.
        </p>
        <a
          href="mailto:hello@streamlineworkshop.com"
          className="block mb-8 transition-colors duration-200"
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            color: "#999",
            fontSize: "14px",
            textDecoration: "none",
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color = "#D4A574")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.color = "#999")
          }
        >
          hello@streamlineworkshop.com
        </a>
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
