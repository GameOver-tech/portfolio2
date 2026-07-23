# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# communication
- The user communicates via structured, numbered task bulletins with explicit role-playing ("Act as a Lead Full-Stack Developer") — each sub-task is a concrete, auditable deliverable specifying what to verify (backend audit), build (admin UI), and integrate (frontend binding). Respond with corresponding clear sub-tasks, progress tracking, and a summary of every file changed and why. Confidence: 0.80

# animation
- Add heavy, impressive animations on every page, every interaction, and during loading states — animations should be visible everywhere to impress. Prefer **fast, energetic animation speeds** (not slow/ambient) to create a dynamic, modern tech feel; when increasing animation speed, always pair with performance optimizations (GPU-composited properties like transform/scale/opacity, `will-change`, hardware acceleration) to prevent frame drops at higher velocities. Confidence: 0.85

# backend
- All API routes should have robust try/catch error handling with proper HTTP status codes (400/500) and meaningful error messages returned in the response — never silently swallow errors or return null. Confidence: 0.80
- API keys for external services (AI providers, etc.) should be configurable via a frontend admin UI dashboard, support multiple providers simultaneously, and allow seamless key rotation without system disruption when keys expire or hit rate limits. Confidence: 0.80

# content-management
- Every visible piece of text across all pages (headings, paragraphs, button labels, CTAs, hero content, etc.) must be fetched dynamically from the database — absolutely zero hardcoded text in frontend layout files. The admin panel must give site administrators complete autonomy to edit all site copy, image references, and layouts without requiring code deployments. All CRUD workflows (create, read, update, delete) across admin modules must be fully functional, bug-free, and correctly mapped to their respective frontend views. Confidence: 0.80

# ui
See [ui/taste.md](ui/taste.md)
