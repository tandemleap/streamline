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

// ─── Hero Section ───────────────────────────────────────────────────────────

function HeroSection() {
  const [wordsVisible, setWordsVisible] = useState(false);
  const lines = ["SOMETHING'S", "SLOWING YOUR", "BUSINESS DOWN."];

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
        <div style={{ maxWidth: "780px" }}>
          <h1
            className="font-black leading-[0.95] mb-6"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              color: "#ffffff",
              fontSize: "clamp(48px, 7vw, 104px)",
              letterSpacing: "-0.03em",
            }}
          >
            {lines.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <span
                  className="hero-word block"
                  style={{
                    animationDelay: wordsVisible ? `${i * 0.15}s` : "9999s",
                    animationPlayState: wordsVisible ? "running" : "paused",
                  }}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="font-semibold"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              color: "#D4A574",
              fontSize: "clamp(18px, 2vw, 24px)",
              letterSpacing: "0.01em",
              opacity: wordsVisible ? 1 : 0,
              transform: wordsVisible ? "translateY(0)" : "translateY(12px)",
              transition: "opacity 0.6s ease 0.65s, transform 0.6s ease 0.65s",
            }}
          >
            Let&apos;s fix it.
          </p>
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
          className="font-bold mb-10 leading-tight"
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            color: "#1a1a1a",
            fontSize: "clamp(32px, 4vw, 52px)",
            letterSpacing: "-0.02em",
          }}
        >
          We&apos;re not a software company.
        </h2>

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
            Running a small business means wearing every hat — owner, scheduler,
            bookkeeper, closer — all before lunch. You&apos;ve heard that AI is
            changing everything. Maybe it is. But if you don&apos;t have time to
            figure out what that means for your business, that&apos;s where we
            come in.
          </p>

          {/* Team photo — floats right on md+, stacks below first para on mobile */}
          <div
            className="md:float-right md:ml-10 mb-4 md:mb-2"
            style={{ width: "clamp(220px, 36%, 360px)" }}
          >
            <div
              className="relative overflow-hidden"
              style={{ aspectRatio: "4/5" }}
            >
              <div
                className="absolute inset-0 z-10 pointer-events-none"
                style={{ background: "rgba(212,165,116,0.1)" }}
              />
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
            <p
              className="mt-3 italic text-center"
              style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                color: "#888",
                fontSize: "13px",
              }}
            >
              Scott and Corazon. Washburn, Wisconsin.
            </p>
          </div>
          <p>
            Streamline Workshop is Scott and Corazon, a foster dad and daughter
            from Washburn, Wisconsin. We listen to what&apos;s slowing your
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
        <div className="clear-both" />
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

// ─── Chatbot Section ────────────────────────────────────────────────────────

function ChatbotSection() {
  const headlineRef = useFadeUp();
  const chatRef = useFadeUp();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [initialized, setInitialized] = useState(false);
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
      className="py-24 md:py-36 px-8 md:px-16"
      style={{ background: "#1a1a1a" }}
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

        {/* Chat window */}
        <div ref={chatRef} className="fade-up stagger-2">
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

          <p
            className="mt-4 text-center"
            style={{
              fontFamily: "var(--font-dm-sans), sans-serif",
              color: "#555",
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
      className="pt-12 md:pt-16 pb-24 md:pb-36 px-8 md:px-16"
      style={{ background: "#f5f1ed" }}
    >
      <div ref={wrapRef} className="fade-up max-w-5xl mx-auto">
        <Eyebrow>WHAT HAPPENS NEXT</Eyebrow>

        <h2
          className="font-bold mb-16 leading-tight"
          style={{
            fontFamily: "var(--font-dm-sans), sans-serif",
            color: "#1a1a1a",
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
                  color: "#1a1a1a",
                  fontSize: "20px",
                }}
              >
                {step.headline}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-dm-sans), sans-serif",
                  color: "#555",
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

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main>
      <HeroSection />
      <WhoWeAreSection />
      <WhatHappensNextSection />
      <ChatbotSection />
      <Footer />
    </main>
  );
}
