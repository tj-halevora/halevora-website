# Halevora project requirements

- Stack: Next.js App Router, Tailwind CSS, pnpm, Vercel. GSAP for desktop effects; React Bits components. Supabase is tentative.
- Build only what is requested in the current task. The complete September 2026 redesign includes hero, about, all eight service panels and six core services, platform network, reach, distribution, paid media, approach, Creator House, application/contact and footer.
- Single-page creator agency showcase. Wow factor, speed and responsiveness are priorities; SEO and conversion optimisation are not objectives.
- No OnlyFans references or associations in public-facing content.
- GSAP effects must be disabled on mobile and tablet, with content fully visible and usable. Respect reduced motion on desktop too.
- Brand: muted amethyst #A995C9, cream #F7F5EF, fallback #121212, deep aubergine silk shader #58436F (updated 13 September 2026). Use --h-accent for brand accents; preserve platform brand colours. Preserve the immediate logo intro, Georgia serif font family (updated 14 September 2026), and silk effects.
- Current design reference: https://auramngt.com/ interpreted through Halevora branding. Content and network figures come from https://halevora.com/. Do not copy Aura revenue/roster claims or present illustrative graphics as measured historical data.
- Preserve original media, including all Creator House photos and both videos. The earlier source backup and reference screenshots are in design-references/.
- Styles are consolidated in app/globals.css with the redesign compositions in app/redesign.css. Avoid stacking contradictory overrides.
- Application submission uses mailto:support@halevora.com. Do not imply a backend submission. Deploy only when explicitly requested; development uses pnpm dev and validation uses pnpm build.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

- Redesign typography: use the hero’s shared --section-title-size and --section-copy-size for main section titles and descriptions. Keep sizing consistent as sections are redesigned; retain smaller navigation labels and service item headings.
