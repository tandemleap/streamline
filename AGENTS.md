# Next.js Conventions for This Project

This project uses **Next.js 15+ App Router**. Key conventions that differ from older versions:

- **App Router only** — no `pages/` directory. All routes live under `app/`.
- **Server Components by default** — components render on the server unless you add `"use client"` at the top.
- **`"use client"` is explicit** — add it only when you need hooks, browser APIs, or interactivity.
- **Async params** — `params` and `searchParams` in page/layout props are now Promises; `await` them.
- **Metadata API** — use `export const metadata` or `generateMetadata()` in server components instead of `<Head>`.
- **No `getServerSideProps` / `getStaticProps`** — those are Pages Router patterns; use `fetch` with cache options or server component data fetching instead.
- **Route Handlers** — API routes live at `app/api/[route]/route.ts` and export named functions (`GET`, `POST`, etc.).
- **Tailwind CSS v4** — config is minimal; use `@import "tailwindcss"` in globals.css.

**Reference:** https://nextjs.org/docs
