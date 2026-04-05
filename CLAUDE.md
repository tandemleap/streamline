@AGENTS.md

# Streamline Workshop — Project Guide

## What This Is
A single-page marketing and intake site for Streamline Workshop, a small custom-solutions business run by Scott and Corazon (a foster dad and daughter). The site introduces the business, explains what they do, and collects leads via an AI-powered chat intake that emails a summary to Scott.

## Tech Stack
- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4** (via `@import "tailwindcss"` in globals.css — no tailwind.config.ts)
- **Anthropic SDK** — powers the chat intake bot
- **Resend** — sends conversation summary emails
- **Deployment target:** Vercel

## Project Structure
```
app/
  layout.tsx          # Google Fonts via <link> tags, metadata
  globals.css         # CSS custom properties, animations, scrollbar styles
  page.tsx            # Entire single-page site (all sections in one file)
  api/
    chat/route.ts     # POST — Anthropic chat, returns {text}
    send-summary/route.ts  # POST — Resend email to scott@tandemleap.com
public/
  logo.png            # Logo shown in nav and footer
  team-photo.jpg      # Scott and Corazon — shown in "Who We Are" section
  slowdown.png        # Hero section image alongside the main headline
.env.local.example    # Lists required env vars (never commit .env.local)
```

## Environment Variables
```
ANTHROPIC_API_KEY=    # from console.anthropic.com
RESEND_API_KEY=       # from resend.com
```
Set these in `.env.local` for local dev. Set them in Vercel dashboard for production.

## Design System

**Colors:**
- Dark background: `#1a1a1a`
- Darker (chatbot): `#0d0d0d`
- Light/cream background: `#f5f1ed`
- Accent amber: `#D4A574`
- Body text (on light): `#2a2a2a`
- Muted text: `#888` / `#555`

**Fonts (loaded via Google Fonts `<link>` at runtime):**
- Headlines: `'Playfair Display'` — use `fontFamily: "var(--font-playfair), serif"`
- Body/UI: `'DM Sans'` — use `fontFamily: "var(--font-dm-sans), sans-serif"`
- Eyebrow labels: DM Sans, 11px, `tracking-[0.15em]`, uppercase

**Section alternation:** dark (#1a1a1a) → cream (#f5f1ed) → dark → cream → dark (footer)

## Page Sections (in order)
1. **Hero** — dark, logo in nav, animated headline, `slowdown.png` right column
2. **Who We Are** — cream, two-column: copy left / `team-photo.jpg` right
3. **Chatbot** — dark, auto-initializes greeting on scroll into view
4. **What Happens Next** — cream, three numbered steps (01/02/03)
5. **Footer** — dark, logo centered, tagline, email

## Chatbot Behavior
- Sends `[]` (empty array) on first load → API seeds a "Hello" user message to get the greeting
- `CONVERSATION_COMPLETE` marker in assistant response triggers:
  1. Marker stripped from displayed text
  2. Fire-and-forget POST to `/api/send-summary`
  3. Input replaced with a "complete" message
- Model: `claude-sonnet-4-20250514`, max 1000 tokens

## Key Conventions
- **No `<form>` tags** — all interactions use React state and onClick/onKeyDown
- **No hardcoded API keys** — always use `process.env.*`
- **Animations** via CSS classes in `globals.css`: `.fade-up` + `.visible` (Intersection Observer), `.hero-word`, `.typing-dot`, `.scroll-indicator`
- **Images** use Next.js `<Image>` with `fill` + `object-cover` for editorial crops
- Resend client initialized **inside** the POST handler (not at module level) to avoid build-time errors

## Running Locally
```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # verify production build
```

## Email
- FROM: `onboarding@resend.dev` (temporary — swap for verified domain when ready)
- TO: `scott@tandemleap.com`
- Parses name, business type, and pain points from conversation before sending
