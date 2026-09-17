# Halevora website

Halevora landing page built with Next.js App Router, React, Tailwind CSS, GSAP and Three.js.

## Run locally

Install Node.js and pnpm (package.json specifies pnpm 10.23.0), then:

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:3000.

## Checks

```sh
pnpm build
pnpm lint
```

## Handover

Read HANDOVER.md for the current design, bird journey, pinned interactions, performance fixes and recent changes. Read AGENTS.md before editing; later explicit user decisions documented in HANDOVER.md supersede old colour/background notes.

The current page uses a solid cream background, the original hero video, metallic headings and a desktop scroll-controlled hummingbird. Reduced-motion/mobile fallbacks remain available. Required runtime media and models are committed in public/.

Local reference archives and original unused media (design-references/ and media/) are excluded; they are not needed to build or run the site. Local environment files, dependencies, generated build output and Vercel account settings are excluded too.

## Hosting

Existing Vercel project: halevora-website. Production: https://halevora-website.vercel.app.

Initial production deployment was made directly through Vercel CLI. Creating this repository does not itself enable automatic Vercel deployments; connect it to the existing project in Vercel Project Settings > Git when required.
