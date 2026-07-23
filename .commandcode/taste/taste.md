# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# workflow
- When fixing a mobile responsiveness or layout issue on one page, proactively audit and fix ALL other pages that have the same class of issue in a single pass — do not fix pages individually one at a time. The user expects comprehensive, cross-page fixes rather than repeated per-page requests. Confidence: 0.8

- When debugging layout/styling bugs, perform a **systematic, exhaustive audit** following a structured methodology: (1) scan every component file; (2) inspect every CSS file for problematic properties (position, z-index, overflow, transform, clip-path, negative margins, backdrop-filter, height: 100vh); (3) inspect every parent container for document flow correctness; (4) check all responsive breakpoints (320px, 375px, 425px, 768px, 1024px, 1440px, 1920px); (5) check animations for layout-shifting side effects; (6) inspect the full z-index hierarchy across the app; (7) explain why each dangerous CSS usage is safe or unsafe; (8) fix every issue. Do not stop until every overlap and blur issue is eliminated. Confidence: 0.85

- When debugging blurry text or mobile rendering issues, search systematically for ALL these CSS properties on text-containing elements: `filter: blur()`, `backdrop-filter`, `transform: translateZ()`, `transform: scale()`, `opacity` (sub-1), `mix-blend-mode`, `will-change`, `perspective`, `overflow: hidden`, and `z-index`. Enforce a strict CSS separation: every heading and paragraph must have `filter: none; backdrop-filter: none; transform: none; opacity: 1; position: relative; z-index: 2;` while every decorative glow/blob element must have `position: absolute; z-index: 0; pointer-events: none;`. Content containers should use `position: relative; z-index: 10;` to ensure they render above background effects. Confidence: 0.85

- When debugging layout issues, **preserve the existing visual design exactly** — do not change colors, fonts, spacing, animations, cards, or buttons. Only repair layout problems (overlaps, z-index conflicts, overflow, blur from covering layers, inconsistent spacing, positioning bugs). Confidence: 0.85

# communication
- The user communicates via structured, numbered task bulletins with explicit role-playing ("Act as a Lead Full-Stack Developer") — each sub-task is a concrete, auditable deliverable specifying what to verify (backend audit), build (admin UI), and integrate (frontend binding). Respond with corresponding clear sub-tasks, progress tracking, and a summary of every file changed and why. Confidence: 0.80
- When reporting production bugs, the user provides raw browser console log output (full stack traces, HTTP status codes, React error numbers) verbatim — not natural-language descriptions of symptoms. Respond by tracing the error from the stack trace/source maps, identifying the root cause, and fixing it systematically. Confidence: 0.85

- When reporting debugging/fix results, deliver a structured audit report with: per-issue tables (File Name, Line Number, Problem, Reason, Old Code, New Code, Explanation), a complete z-index hierarchy table, a positions/overflow audit table, and a final checklist (✔ Layout Issues Found, ✔ Files Modified, ✔ Responsive Tests Passed, ✔ Overlapping Fixed, ✔ Blur Issues Fixed, ✔ Mobile Fixed, ✔ Desktop Fixed, ✔ No Console Errors, ✔ Production Ready). Confidence: 0.85

# animation
- Add heavy, impressive animations on every page, every interaction, and during loading states — animations should be visible everywhere to impress. Prefer **fast, energetic animation speeds** (not slow/ambient) to create a dynamic, modern tech feel; when increasing animation speed, always pair with performance optimizations (GPU-composited properties like transform/scale/opacity, `will-change`, hardware acceleration) to prevent frame drops at higher velocities. Use Framer Motion with a custom `easeOut` cubic-bezier easing (`[0.25, 0.46, 0.45, 0.94]`), durations of 0.4s–0.8s, and **no excessive bouncing** or spring overshoot for a polished, professional feel. Use `useInView` for scroll-triggered reveals (fade up, slide, scale, stagger reveal) with `once: true` so animations play only on first scroll entry. Confidence: 0.85

# backend
- All API routes should have robust try/catch error handling with proper HTTP status codes (400/500) and meaningful error messages returned in the response — never silently swallow errors or return null. Confidence: 0.80
- In the client-side catch blocks, always convert error values to strings before storing in React state (e.g., `setError(typeof raw === 'string' ? raw : String(raw))`). React throws error #31 when trying to render an object (`{code, message}`) as a JSX child, so defensive string coercion prevents this crash. Also provide specific user-facing messages for common HTTP errors (500 → "Server error. Check env vars on Vercel.", ERR_NETWORK → "Cannot reach server.") rather than blindly displaying the raw error. Confidence: 0.85
- API keys for external services (AI providers, etc.) should be configurable via a frontend admin UI dashboard, support multiple providers simultaneously, and allow seamless key rotation without system disruption when keys expire or hit rate limits. Confidence: 0.80

# deployment
- When deploying a Vite + Express app to Vercel (or similar serverless platforms), server runtime env vars must NOT use the `VITE_` prefix — that prefix is exclusively for Vite build-time client injection. The server config should check both the non-prefixed name (for Vercel/production) and the `VITE_` prefixed name (for local dev compatibility) as fallbacks, so the same code works in both environments without duplicate env var setup. Confidence: 0.85
- On Vercel (or any serverless platform), wrap `dotenv.config()` in try/catch — the `.env` file is typically gitignored and won't exist in the deployed environment. An unguarded `dotenv.config()` that tries to load a non-existent file can crash the serverless function on cold start. Add startup logging (`console.log`) to print which env vars are present before serving requests, so missing vars are visible in the platform's function logs. Confidence: 0.85

- When VITE_ prefixed env vars (e.g., `VITE_SUPABASE_URL`) are needed by both the Vite build and the Express server at runtime, use a **build-time env var injection pipeline**: create a `scripts/generate-env.js` script that snapshots the build-available `VITE_` vars into a file deployed alongside the serverless function (e.g., `api/server.env`); run this script as the last step of `vercel.json`'s `buildCommand` (`cd client && npm run build && cd .. && node scripts/generate-env.js`); and have the server config load it via a secondary `dotenv.config()` fallback. This bridges the gap because Vercel injects `VITE_` vars only during the build step, not at serverless runtime. Add the generated file to `.gitignore`. Confidence: 0.85

# content-management
- Every visible piece of text across all pages (headings, paragraphs, button labels, CTAs, hero content, etc.) must be fetched dynamically from the database — absolutely zero hardcoded text in frontend layout files. The admin panel must give site administrators complete autonomy to edit all site copy, image references, and layouts without requiring code deployments. All CRUD workflows (create, read, update, delete) across admin modules must be fully functional, bug-free, and correctly mapped to their respective frontend views. Confidence: 0.80

# ui
See [ui/taste.md](ui/taste.md)

# accessibility
- Pages must follow proper heading hierarchy (h1 → h2 → h3), include ARIA labels on interactive elements, support keyboard navigation, maintain sufficient color contrast for readability, and use semantic HTML elements. Also respect `prefers-reduced-motion` so users with motion sensitivity are not overwhelmed by animations — animations should degrade gracefully (fade transitions instead of slide/scale/stagger) rather than being disabled entirely. Confidence: 0.75

# secrets-management
- Never hardcode API keys, secrets, or credentials in source/config files that get committed to git — use environment variable placeholders (e.g., `${VARIABLE_NAME}`) in committed code and provide actual values via environment variables, runtime configuration, or admin UI settings. If secrets are accidentally committed, use `git filter-branch` (or `git filter-repo`) to purge them from all historical commits, then force push. Confidence: 0.90

# coding-style
- When building or redesigning pages, refactor them into small, focused reusable sub-components (e.g., dedicated files for hero, cards, timeline, stats, section titles) rather than one monolithic page component. Each sub-component should have a single responsibility. Avoid duplicate logic across these components. Confidence: 0.75
