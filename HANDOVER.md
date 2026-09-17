# Halevora: CURRENT new-chat handover
Updated 17 September 2026. Supersedes all older handovers/prototype notes.

## Start here / latest status
Continue the existing landing page. Read this file and AGENTS.md, then follow the user's next request. No rebuild, deployment or asset generation is pending. The user requested this document to continue in a fresh chat.
Latest completed change: the first coloured title (More possibilities) now enlarges 12% and flashes brighter cyan/lilac on bird impact, then returns to normal. Build passed. Do not ask about the OLD unfinished bird-motion direction: it has now been implemented and iterated extensively.

## Project/runtime
- ACTUAL PROJECT: C:/Users/tjwil/OneDrive/Desktop/Halevvora/halevora-landing
- Default Codex cwd C:/Users/tjwil/OneDrive/Documents/ChatGPT/Halevora - Landing is NOT the project. Always set explicit workdir.
- Windows PowerShell, pnpm, Next.js16.3.4 App Router, React19, GSAP/ScrollTrigger, Three/R3F.
- Local http://localhost:3000/ was running at final verification. Check before starting another pnpm dev server.
- Production https://halevora-website.vercel.app ; linked Vercel project halevora-website.
- Recent changes are LOCAL ONLY. Deploy only on explicit request.
- No Git repo was available earlier; inspect before assuming history/rollback.
- Read AGENTS.md and relevant Next docs in node_modules/next/dist/docs. Validate with pnpm build.

## Intent / constraints
Glass hummingbird is the central brand character. User wants a continuous cinematic journey: arrive next to heading, physically STOP, visibly peck, word reacts, section releases, fly onward. Subtle automatic glows were rejected because users scrolled past them. Current interactions pin sections and are controlled by scroll, like the hero.
Preserve Georgia, cream lettering, #A995C9 violet, purple silk, original hero mountain video/intro, Creator House media and existing metallic headings/icons. User likes strong visible glow and impact but readable words. Do not remove silk unasked for performance. Desktop >=1280px + hover + fine pointer + no reduced motion only for bird/pins. Mobile/tablet/reduced motion stay usable without effects.

## Current site
- Hero uppercase HALEVORA: custom SVG H plus ALEVORA.
- Original About section retained: purple background, floating platform trail, Represent/Engineer/Distribute cards.
- Wide generated three-stage video experiment was REJECTED/REVERTED; not mounted. Do not bring it back.
- BirdJourney mounted once in app/page.jsx AFTER main as sibling (avoid transformed ancestors).
- /bird-journey renders Home; do not add another bird.
- Service tabs/3D cards, platform network, reach, distribution, paid media, approach, Creator House/contact/footer remain.

## Latest edited files
- components/bird-journey.jsx: wings, flight/turning, hero fracture, section holds and word reactions.
- components/site-entrance.jsx: bird joins title entrance at timeline1.3s, duration1s; query actual DOM element instead of scoped string selector.
- components/hero.jsx: h-hero-wordmark class for glow.
- app/globals.css: bird/art layers, violet glow, wordmark outline, reaction overlays, mask margin.

## Bird / entrance / wings
- Setup immediate (old2.8s timer REMOVED); intro controls visible entrance with title.
- Clean sequence public/bird-journey/frames-clean/manifest.json and97 WebP frames512x512, 4 concurrent decoding workers.
- Source design-references/bird-journey/bird-hover.mp4. Reproducible cleaner extraction extract-clean-frames.py in that directory. Originals retained.
- Fallback public/bird-journey/bird-master.webp.
- Independent wing loop even without scrolling:36 source frames/sec ping-pong, max24 canvas updates/sec. Slowed from48 on request. Pauses offscreen/hidden tab.
- Strong violet four-shadow halo:2px pale edge,7/16/26px amethyst.
- TWO canvases/art layers drawing same frame, one mirrored. Short opacity blend changes facing; positive uniform sprite scale.
- NEVER restore signed scaleX interpolation through zero. That made bird collapse into the thin streak shown by user.
- This is2D animation, not a true3D model; real multi-angle turns require new views/model.

## Hero
- Pin4.8 viewport heights; four slow pecks.
- Normalized peck starts .08,.23,.38,.53; each .115 duration. Fourth contact .5875 triggers fracture over .35 progress.
-36 deterministic Voronoi clipped copies of actual wordmark. Irregular fragments, left-to-right fracture propagation, depth/tumble/gravity/fade. Copies displayed ONLY during burst. Reverses on scrolling up.
- Cream title now has violet glowing outline; hero mask overflow-clip-margin26px.
- DOM fracture, NOT the studio glass-shatter movie: that movie has baked background and different typography. Kept as reference rather than inserted.

## Route / flight
All main headings through Approach:
1 about-title (More possibilities)
2 services-title (business)
3 platform-network-title (More potential)
4 impact-title (10B+ reach metric: visit only, no peck/pin)
5 distribution-title (beyond borders)
6 paid-title (go further)
7 approach-title (Real momentum)
Fade out after Approach; no extension into Creator House/contact requested.
Anchors beside coloured word, alternating sides/facing inward, scaled for available side space. Curved flight, bank ~8deg. Exponential position easing .24s; speed capped min(680px/s,viewportWidth*.45); direction blend .07s, dt cap .05s. Flight RAF ends when settled; wings remain independent. Reverse scroll supported.

## AUTHORITATIVE current interactions: section holds
Earlier automatic GSAP reaction timelines were REPLACED with scroll-driven applyInteraction().
- Six entire sections pin at top90px ('top 90px'). Length viewportHeight*(1.1+taps*.45).
- First18% settling, middle64% taps, final release. Scrolling advances the actions; stopping scroll freezes pose/effect while wings continue.
- Bird advances up to36px, banks6deg, contacts at .48 within each tap, then fully recoils.
- Word gets a4px physical recoil and visible contact-triggered glow, then resets.
- Section remains stationary until sequence completes, then releases and bird flies onward.
- Stops store arrival/release/hold. screenY compensates pin offsets. Departure must use previous RELEASE, not arrival.

Recipes:
- More possibilities:1 tap, cyan sweep PLUS newest enlargement/colour treatment below.
- business:2 taps, warm gold pulses.
- More potential:1 tap, pink reveal/ripple.
- beyond borders:1 tap, icy-blue sweep.
- go further:1 tap, gold bloom; overlay up to1.018 scale.
- Real momentum:3 taps, building emerald intensity .55/.775/1.

Implementation: generated aria-hidden .bird-word-reaction span inside .liquid-heading, copies .liquid-heading-text. Transparent fill,1px coloured outline, glow. Feathered CSS mask via --reveal and --sweep-direction. Do NOT restore hard rectangular clipping (looked visibly boxed). Effects/inline styles reset on leave and media cleanup. Pins/listeners/overlays removed on reduced motion/unmount.

## VERY LATEST: first word impact WOW
User liked first stop but requested enlargement + colour. ONLY About received the stronger treatment; other recipes unchanged.
- Actual word scales to1.12 at peak, returns to1.
- Origin at beak-side edge (right when bird on right), grows AWAY from contact so it fits and stays anchored.
- Peak filter brightness(1.2) saturate(1.3) hue-rotate(32deg).
- Glow colour shifts cyan toward lilac; sweep spreads over .16 tap phase.
- Resets scale/filter/translation/origin after leaving interaction.
- Tested1600x1000: left368/right1232 -> peak left261/right1228 -> original bounds. No clipping at that tested viewport.
- Screenshot design-references/bird-journey/about-impact-swell.png.
- Latest pnpm build passed; no further design change pending.

## CRITICAL pin ordering fix: preserve
Platform icons stopped assembling because their timeline ran while section was4500px below screen. Hero spacer was being measured after downstream triggers.
- Hero refreshPriority100.
- Six section pins refreshPriority90-index, created in DOM order.
- ScrollTrigger.sort(); ScrollTrigger.refresh(); measure(); after pins exist.
- Downstream animations MUST measure after upstream pin spacers. Keep this on new pins.
- NetworkEngine's original80-particle platform assembly remains. Earlier verified cards hidden until arrival, particles visible in viewport, final cards visible afterward and reverse scroll resets.

## Validation and limitations
- Latest pnpm build passed after word enlargement.
- Browser checked all six pinned stops: heading same screenY at two scroll positions, glow0 before contact / positive on contact; About release resumes scrolling.
- Reduced-motion switch removed all pin spacers and reaction overlays.
- No pageerrors in pinned sequence tests.
- Four hero peck peaks/recoils verified; title intact before fourth contact.
- Forward/reverse turning verified without scale collapse.
- Final enlargement checked1600x1000; other tests1440x1000. No promise all viewport combinations perfect.
- Headless Chromium uses software renderer, not evidence of actual GPU FPS. Large scroll jumps can still outrun the eased bird briefly; inspect if reported.
- Some old screenshots/README files show obsolete states. Current source + this document are authoritative.
- QA screenshots in design-references/bird-journey/: pinned-peck.png, about-impact-swell.png, route-approach-title.png, title-violet-glow.png.
- Playwright require path: C:/Users/tjwil/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright
- ffmpeg/ffprobe and Python Pillow/OpenCV/numpy available.

## Preserved systems and historical context
Below is background; any older movement instructions are superseded above.

## Performance fix — KEEP
Files: components/liquid-icon-viewer.js and components/liquid-heading-viewer.js.
- Headings and icons share a single WebGL studio. Previously they alternated renderer dimensions, e.g. a 439x111 heading vs 373x260 icons.
- Observed 76 canvas width/height setter calls in a 3-second sample when the heading and first icon row were visible. Equal-size icons alone produced zero resizing.
- resizeLiquidRenderer now grows the backing buffer only when needed, then uses renderer.setViewport(0,0,width,height) for each viewer.
- Each destination canvas uses its own pixel dimensions. drawImage copies the correct lower-left viewport region using source Y = renderer.domElement.height - destination.height. Do not restore copying the entire shared buffer.
- Post-change same mixed-view sample: zero dimension resets. Window-resize follow-up also zero steady-state resets. No browser errors; gold heading visually checked; pnpm build/lint passed.
- Profiling used headless Chromium SwiftShader (software graphics). Counts confirm the resizing fix; do NOT claim user-GPU FPS or that all lag is solved.
- Remaining costs: WebGL-to-2D canvas copies, 30fps visible icon/heading animation, full-screen Silk Canvas frameloop always. User previously wanted silk kept; do not remove background unasked.

## Important site files
- app/page.jsx — page composition + bird overlay.
- components/hero.jsx — uppercase wordmark, original hero video.
- components/bird-journey.jsx — current bird, peck, shatter, flight.
- components/about.jsx — restored three-card section; AboutImageTrail and LiquidHeading.
- components/about-image-trail.jsx — original floating platform imagery.
- components/services.jsx / service-showcase.jsx — service tabs and 6 icon cards.
- components/liquid-icon-viewer.js — shared WebGL studio, metallic model render/melt/rotation.
- components/liquid-heading-viewer.js — heading rendering/reflection animation.
- components/liquid-heading.jsx / liquid-service-icon.jsx — loading, visibility and responsive wrappers.
- components/creator-journey.jsx — UNUSED experimental video scrubber; do not assume mounted.
- app/globals.css — base styles, bird overlay classes.
- app/redesign.css — section compositions. Experimental h-creator CSS was removed on revert.
- public/models/liquid-icons and public/models/liquid-headings — 3D assets.

## Existing visual features and preferences
- Georgia typography, cream text, amethyst brand accents, purple silk background.
- Six metallic colored service icons; actual 3D GLBs, draggable, 8-second rotation, 4-second melt/reform cycle. Card borders match icons; cards animate together on entry.
- Metallic headings use fixed 3D geometry and moving reflected light. A previous dripping text treatment was rejected because it distorted readability.
- Platform network H is filled cream-white 3D with melt/drag, no purple square backing.
- Preserve hero intro/video and original Creator House imagery.
- User wants cinematic scroll progression and strong hummingbird continuity, dislikes obvious boxed video panels, oversized soft footage, long dead scroll, random abstract metaphors and AI portraits.
- Do not casually claim “perfect” or “lag-free”; check the result.

## Rejected video-section experiment (history, not current scope)
- User generated one wide scene: bird connects creator/brand panels, guides content to camera/calendar, then to three phones.
- Original 10-second version: C:\Users\tjwil\OneDrive\Desktop\hf_20260917_064815_a362d366-8030-4317-ba05-a3eb88d8ac12.mp4
- Five-second version with AI woman portraits: C:\Users\tjwil\OneDrive\Desktop\new.mp4
- User disliked portraits. Connected Higgsfield Seedance video_edit removed them, replacing images with lilac play tiles; also simplified left plaques.
- Clean generated source: design-references/bird-journey/no-portraits-source.mp4
- Job: 3f9f96c4-6412-4fa8-a31e-13fa16e7e580 ; estimate 32.77 credits.
- Site copies: public/videos/creator-journey-clean.mp4 and creator-journey-clean.webp. Original variants also retained.
- Several layouts were tried: boxed -> full width -> compact -> slow pinned scrub (121 source frames, 24fps, >=3600px scroll, ~30px/frame).
- User ultimately requested “revert this section.” Restored original cards/background and detached video. The later request to freeze full section was superseded by revert; do not implement it now.
- All source media retained. Do not delete them just because unused.

## Higgsfield and assets
User authorized connected Higgsfield for necessary assets earlier. Later often generated clips themselves with prompts. Only generate again for an actual current need; do not spend credits merely to explore.
- Approved source bird photo: C:\Users\tjwil\OneDrive\Desktop\photo_2026-09-16_23-41-22.jpg
- Original bird peck/logo movie: C:\Users\tjwil\OneDrive\Desktop\IMG_0078.MP4 (12.57s, 848x464 compressed copy).
- Inspiration machine/butterfly clip: C:\Users\tjwil\OneDrive\Desktop\clip-d.mp4 (5.04s,1280x716).
- Generated bird master: design-references/bird-journey/bird-master.png (RGBA2048).
- Accepted wing-motion source: design-references/bird-journey/bird-hover.mp4.
- First bird-motion.mp4 test rejected: stationary wings and beak opening. Do not use.
- Prompts/job IDs: design-references/bird-journey/generations.json. README there reflects EARLIER prototype status and can be stale; this handover/current code take precedence.
- Bird master job a95c1085-2879-4123-a51f-762c9c752b47; wingbeat job e5820813-3059-42a4-90ef-c4e247413851.
- Uploaded new.mp4 media ID: f6238abb-1815-4507-94d1-e15862d31864.
- Tools available by discovery in ALL_TOOLS: higgsfield_models_search, generate_video, estimate_video_cost, media_upload_and_confirm, jobs_wait.
- Seedance 2.5 supports mode video_edit; editing prompts in Create Video can be rejected. Use actual edit mode for localized correction.
- Models may change text and anatomy; never promise exact frame-for-frame preservation from a prompt.


## Next-chat instruction
Read this handover and current code, acknowledge continuity briefly, then follow the next user instruction. No new generation or deployment is authorized by this handover request.

## Latest background override (after handover creation)
User explicitly requested cream wave background instead of violet. SilkBackground default is now #F7F5EF, preserving wave motion and dark shading. CSS page/intro fallbacks are neutral warm gradients instead of violet imagery. This supersedes earlier purple-silk colour requirements; violet brand accents/bird glow stay. Local only.

## Latest override: SOLID CREAM, NO WAVES
User now requests the exact header cream #F7F5EF throughout the page, removing waves entirely. Removed SilkBackground from Home and intro; preserved intro logo animation. Body/html/intro solid cream, exposed text charcoal, existing dark panels retain cream copy. Supersedes all previous silk colour requests. Bird journey and interactions unchanged. Local only.


## Reverted conversation experiments
User requested reverting all title-effect changes from this conversation. Restored the original scroll-driven pinned About peck, whole-word 12% enlargement and cyan/lilac colour/glow. Removed individual glyph deformation, automatic playback, shortened pin, extra glow canvas and beak spark. Original hummingbird route, other title recipes and solid cream background preserved. No deployment.


## Latest requested change: large individual letters, strictly scroll-driven
About now pulses letters individually up to 2x size after the pinned peck. Scroll progress from contact through 96% of the original full section hold drives the right-to-left wave. Stopping scroll freezes the pulse; reverse scroll reverses it. No timers, auto playback, spark or extra violet border/glow. The metallic face colour remains. Other title recipes unchanged. heading-letter-pulse.js recovers 18 glyphs (including joined i dots) and supplies shader anchors; liquid-heading-viewer.js pads the About canvas for enlargement. Original pin duration and ordering preserved.
Validation: build passed, desktop browser confirmed fixed pulse on pause, decreasing progress on reverse, wave=1 before release, stationary section throughout; reduced-motion removed pins and wave state. No browser errors. Screenshot about-large-scroll-letters.png. Local only.


## Latest refinement: 2.5x letters with violet contour
About glyph peak increased from 2x to 2.5x. Broader cosine pulse (1.4 glyph radius) softens the handoff between letters; active pulse rendering targets 60Hz, idle reflections remain 30Hz. Strict scroll control and original pins remain. A separate cached canvas draws a 1.5px violet glyph contour with a tight 2px/5px halo ONLY during enlargement; face colour unchanged. Border pass updates only when wave progress or canvas dimensions change. Extra canvas padding prevents render clipping. Large glyphs intentionally extend beyond the original text line.
Validated build and browser: frozen pulse/outline at fixed scroll, reverse progress, outline clears completely at end and under reduced motion, no browser errors. Screenshot about-large-violet-contour.png. This is not a measurement of user GPU frame rate. Local only.


## Latest override: automatic loop until the next scroll
About now waits for the bird to settle and arrival scrolling to pause (180ms), then automatically repeats the peck and 2.5x violet-outlined letter wave. Each cycle lasts 4.4 seconds: contact at 0.55s, letter wave over 3.1s, then a rest. Next actual scroll movement stops the loop and clears enlargement/outline; it remains stopped for that visit. Leaving/re-entering rearms it. Hidden tabs pause the timer, reduced motion cleans up loop state. Original pins and other sections unchanged. No beak spark reintroduced.
Validation: build passed; browser confirmed automatic start, second cycle without scrolling, stop on next scroll, stays stopped, re-entry restarts, reduced-motion removes pins/state; no page errors. Local only.


## Latest colour refinement: dark idle, logo amethyst while enlarged
About / More possibilities now uses flat dark #232323 faces at rest (including fallback/mobile text). Each pulsing glyph smoothly changes to the shared logo --h-accent #A995C9 and back as it shrinks. Uses untone-mapped basic material for exact brand colour. Existing 2.5x automatic loop, violet contour and stop-on-next-scroll behaviour preserved. Other titles unchanged.
Build and browser checks passed: active canvas contains logo-purple and dark pixels; after scrolling stops the loop, purple pixels clear and title returns dark. No browser errors. Screenshot about-dark-purple-loop.png. Local only.


## Latest override: fast single pass, violet stays
About interaction now plays only once per mounted page session. Peck contact at 0.32s, letter wave 1.15s (previously 3.1s), then completes without looping. Letters retain logo #A995C9 as the wave passes; all remain violet at normal size afterward. Scroll interruption completes the colour change; leaving/returning does not replay. Refresh begins dark again. Enlarged-glyph outline remains temporary. Verified build and browser: final normal-size canvas has logo-purple pixels, zero dark face pixels, stays completed and violet on return. Local only.


## Latest change: same effect across every coloured section title
All seven LiquidHeading instances now start dark and use the same fast one-time 2.5x glyph pulse, temporary violet contour, and lasting logo-amethyst colour. Includes possibilities, business, potential, borders, further, momentum and final contact next. Bird route now extends to contact-title (added to apply-contact.jsx), with a matching final pin. 10B+ remains visit-only. Existing earlier pins/order preserved. Per-title state replaces the About-only timer; each plays independently once per mounted session. Wave direction follows the beak side via a shader direction uniform. Scrolling mid-animation finishes that title in violet; revisiting does not replay. Reduced motion remains static with pins removed.
Validation: all seven desktop stops completed with loaded glyph counts 18/9/14/14/10/13/11 and correct alternating directions; reduced-motion cleared pins, no browser errors on final contact check; production build passed. Screenshot business-violet-completed.png. Local only, no deployment.


## Latest change: presentation scroll gates at every unfinished title
Desktop bird-enabled mode now fully holds document scroll at each unfinished title's pin arrival until its peck and 1.15s letter-colour wave finish (plus 120ms final-frame allowance). Forward wheel input is checked before crossing; scroll events/programmatic jumps/scrollbar or keyboard movement are clamped to the FIRST unfinished stop, so a huge gesture cannot skip several titles. Wheel, scroll keys and touch movement are blocked while held. No queued overscroll is replayed. The bird settles, animation runs independently of input, then the gate releases; completed titles do not lock/replay on revisits. Original pins and hero remain. Mobile/tablet/reduced-motion stay unrestricted; all listeners and gate state clean up on media change/unmount. Resize remeasures the locked arrival. This supersedes the old behaviour that scrolling completed/interrupted the wave immediately.
Validation: production build passed. At 1440x1000, repeated page-bottom jumps caught all seven stops in order; wheel + Page Down left scrollY unchanged at each; each released only with letterWave=1. Reduced-motion toggled during a lock removed both lock and pin spacers. No browser page errors. Local only.


## Latest repair: visible animation and clean viewport stops
Presentation pins now align to actual .site-header height (76px desktop), replacing hardcoded 90px which exposed a strip of the previous section. Each presentation section gets an opaque cream background and min-height of viewport minus header; vertical padding is responsive. Larger content sections continue naturally after the introductory stop. Pin scroll length reduced to 32px because animation completion is time-gated; removed old 1.55-2.45 viewport dead scroll. Flight settling wait now has a 1s bounded arrival fallback, and title readiness is checked before playing (2.5s fallback if renderer unavailable). The automatic animation and scroll gate remain independent; no input is needed to finish.
Verified at 1440x900: all seven gates showed intermediate wave progress AND nonempty rendered violet outlines, aligned section tops at header bottom (~76px), completed under wheel input, and no page/console errors. Reduced motion removed all presentation classes and pins. Build passed. Screenshots presentation-fixed-active.png and presentation-fixed-done.png. Local only.


## Latest fix: refresh stays at hero start
Reproduced reload jumping from scrollY=0 to 1080 then 6264 without input while pin spacers rebuilt. Added beforeInteractive initialization in root layout: normal landing-page loads/reloads without URL hash use manual scroll restoration and instant top=0 before hydration. Explicit hash entries and back_forward navigation are excluded from that reset. Disabled CSS scroll anchoring on html so spacer layout changes cannot move the viewport. Presentation gate ignores ScrollTrigger.isRefreshing measurement passes.
Validation: production build passed. Three repeated return-to-top + reload tests at 1920x1080 stayed at scrollY=0 with no scroll events; first title gate/animation still completed afterward. No browser errors. Local only.


## Latest hero refinement: one peck only
Hero now performs a single scroll-controlled peck, replacing the four-beat sequence. Peck spans normalized progress .08-.32, contact at .20 triggers the original wordmark fracture, burst spans .20-.85. Hero pin shortened from 4.8 to 1.8 viewport heights to remove the discarded beats. Original video, entrance, glow, fracture style and later section effects preserved. Verified one forward/recoil peak, shatter on contact, reverse restores title; no browser errors; build passed. Local only.


## Latest hero timing: release at shatter contact
Hero now unpins at the single peck contact (0.36 viewport of scroll). The existing 1.8-viewport animation progress span remains separate, allowing fragments to continue breaking apart while the page scrolls and bird departs. Departure begins at the contact x-position to avoid jumping backward. Reverse scrolling restores the intact title. Browser verified: hero stays at top before contact; at +60 and +240px after contact hero moves up with fragments still visible and bird moving onward. Build passed. Local only.


## Latest intro logo colour
Loading/entrance logo now uses the same SVG mask and --h-accent (#A995C9) as the header, replacing the dark brightness-filtered image. Intro motion and cream background preserved. Browser computed colour verified; build passed. Local only.


## Latest hero override: two pecks, move on second contact
Hero now pecks twice: progress .08-.32 (first peak .20), then .38-.62 (second peak .50). Pin releases and fracture begins at second contact, 0.9 viewport of scroll. Fracture continues during page/bird departure. Progress is no longer capped at 1, allowing the shifted fracture to finish fully. Verified first peak/recoil/second peak and page release after second contact; build passed. Local only.


## Latest platform tile styling
Removed dark backgrounds from the eight platform-network tiles. Transparent cream-page backdrop, charcoal labels, and dark Halevora monogram; subtle violet borders/hover and platform icons/assembly preserved. Build and browser computed styles checked. Local only.


## Latest platform assembly glow
Replaced black drop-shadow on .h-engine-particle with centered 12px logo-amethyst #A995C980 glow. Applies to the animated icon copies during assembly; brand icon artwork and cream tiles unchanged. Computed style verified; build passed. Local only.


## Latest platform auto-selection and glow
Platform network cycles through all eight tile selections every 2 seconds, wrapping continuously when visible after assembly. Manual click/hover/focus selects immediately and pauses automatic changes for 4 seconds; keyboard focus-visible holds selection. Hidden tabs, offscreen tiles, mobile/tablet and reduced motion do not auto-cycle. Active tiles have stronger amethyst borders, inner/outer glow and icon halo; active connector brighter with a violet glow. Verified full 8-item wrap, manual Reddit selection and reduced-motion stop; build passed. Screenshot platform-auto-violet.png. Local only.


## Latest central network logo colour
The 3D Halevora hub now uses logo-amethyst #A995C9 metal instead of cream-white. Original rotation/melt animation preserved. Static/mobile fallback uses the same violet SVG mask; accessibility finish label updated. Build passed and rendered hub visually checked (violet-network-hub.png). Local only.


## Latest platform layout: single desktop row
All eight platform tiles now occupy one equal-width desktop row (>=1280px), second four beside the first four. Machine spans existing page content width. Eight SVG connector paths align to the eight column centres and track individual active tile; smaller screens retain 4x2 with four shared column routes. Auto-selection/glow preserved. Verified one row at 1440 and 1280, 2 rows on mobile; build passed. Screenshot platform-single-row.png. Local only.


## Latest network reveal timing
Platform assembly now runs automatically once on entry (machine top at 95% viewport), completing in about 0.8s instead of scrubbing across the full machine height. Icons/cards, connectors, violet hub and result panel reveal together around 0.48-0.52s. No extra scrolling is needed to reveal the lower elements. 80 original particles preserved with shortened trajectories. Central 3D logo preloads at 1100px viewport margin. Verified all four layers opacity=1 and model ready while still at platform title stop; no page errors; build passed. Local only.


## Latest cursor trail colour
BackgroundGlowCursor now uses amethyst #A995C9 to deeper violet #8B5CC0 instead of a cream secondary colour. White hotspot disabled; normal blending preserves violet over both hero footage and cream. Trail motion/fade unchanged. Build passed. Local only.


## Latest cursor compositing fix
Removed leftover mix-blend-mode:screen from .glow-cursor.background-glow-cursor in GlowCursor.css. The container was washing violet toward white on cream even though the renderer already used normal blending. Container now normal, still fixed z-index60 and pointer-events none. Browser computed blend/layer verified; build passed. Local only.


## Latest map contrast fix
Distribution map no longer has a semiopaque black panel (which appeared grey over cream). Uses cream background, pale lavender continent fill with violet outlines and stronger darker dots, darker violet markers with cream rims, clearer routes, and charcoal country/stat labels. Violet figures and data remain unchanged. Removed distribution panel from dark-panel text rule. Build passed and rendered map visually checked: map-clear-violet.png. Local only.


## Latest Approach reveal speed
Audit/Architect/Amplify/Scale now reveal automatically together on section entry, 0.35s fade/move with 0.07s stagger (0.56s total). Process line fills alongside them. Replaces the long scroll-scrub reveal; no extra scrolling needed to uncover later stages. Layout/content preserved. All four opacity=1 and settled at Approach title stop in browser check; build passed. Local only.

### Latest navigation pause bypass
- Explicit same-page links, service menu selection, hash navigation and history navigation now clear/bypass the bird presentation scroll gate, so navigation reaches its requested destination without stopping at preceding headings.
- The next genuine wheel, scroll key or touch-scroll restores normal presentation pauses from the current position. An interrupted active lettering animation resolves to its final violet state.
- Verified in desktop Chromium: normal fast scroll pauses at About; selecting YouTube escapes the pause and activates the YouTube service; subsequent normal scrolling pauses at Platform Network; clicking Apply escapes that pause and reaches Contact. `pnpm build` passes. Local only; no deployment.

### Latest Reach cleanup
- Removed the distribution CTA bar (Connect your content / Discuss your distribution) from components/reach.jsx at user request. Build passes; local only.


### Latest bird return to logo
- Bird journey ends after Approach: before Creator House, the bird arcs toward the actual header logo, shrinks into it and disappears. Scrolling upward reverses this path. Contact is removed from the bird route and presentation pins; its title stays violet without a peck.
- Verified desktop browser docking/hiding at Creator House, remaining hidden at Contact, and returning toward Approach on upward scroll. Build passes. Local only.


### Latest peck contact ripple
- Added a violet circular impact ripple at the hero wordmark for both pecks and at each section-title contact. The ripple expands and fades in 520ms independently of continued scrolling, uses the existing overlay, and respects the desktop/reduced-motion gate. Build passes; local only.


### Latest navigation alignment and destination animation
- Desktop navigation now aligns bird-enabled sections to their exact ScrollTrigger arrival beneath the header, bypassing intermediate stops. Destination peck/ripple/letter wave is reset and plays on each explicit visit; only the destination holds during playback.
- Service navigation still selects the requested tab before alignment. Contact/Creator House retain their bird-free behavior. Verified About and Distribution at header y=76 with completed violet lettering and YouTube selected at Services y=76. Build passes; local only.


### Larger peck impact
- Increased contact ripple from 46px to 96px with a stronger violet glow, thicker outer ring and bright inner ring. Expands to 1.8x and fades over 700ms for greater visibility at hero and section pecks. Local only.


### Production deployment September 17
- User authorized production deployment. Direct Vercel deployment succeeded: dpl_zhH8dvKjrKvv87BJzzqoGWe6L9St, aliased to https://halevora-website.vercel.app (HTTP 200, Ready). No Git repository/remote exists in this directory, so no Git push was possible.
- Local Next dev server stopped at user request; port 3000 confirmed closed. Deployment had already continued remotely when the user interrupted to request stopping localhost first.


## Deployment 17 September 2026
Published current workspace including user's other-chat changes to production. Local and Vercel builds passed. Alias: https://halevora-website.vercel.app . Deployment: https://halevora-website-9916i6wzj-halevoradeveloper-1963s-projects.vercel.app . Supersedes previous local-only notes for files present at this deployment.

## GitHub handoff
Project now initialized as a Git repository on main. Origin: https://github.com/tj-halevora/halevora-website.git . Required runtime assets are in public/. Local reference archives, media/, .env files, .vercel, dependencies and build output are ignored. Supersedes earlier notes saying no Git repository. GitHub publication alone does not connect Vercel Git integration.
