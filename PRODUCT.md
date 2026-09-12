# Product

## Register

product

## Users

People seeking a calm, personal wellness practice: yoga, meditation, breathing, relaxation, sleep, flexibility, and stress reduction. They open the app in quiet, unhurried moments (before bed, first thing in the morning, on a break) expecting something that feels considered and personal, not transactional. Their job to be done is simple: find a session that fits how they feel right now and start practicing within a couple of taps. Some are free users browsing what's available; some are subscribers with full access. Primary usage context is mobile, held in one hand, often with low ambient light.

## Product Purpose

A premium wellness app where users discover and stream yoga, meditation, and relaxation video sessions. Free videos are open to everyone; premium videos are visible (thumbnail, title, description, metadata) but require an active subscription to stream. Success looks like a user feeling, within seconds of opening the app, that this is a considered native product worth paying for, then finding and starting a session with no friction.

## Brand Personality

Calm, natural, elegant, premium, minimal, warm, human, fluid. Editorial, not administrative: the app should read like a thoughtfully art-directed wellness product, never like an internal tool or a SaaS dashboard wearing wellness colors.

## Anti-references

- Generic SaaS dashboard (sidebar + KPI cards + data tables)
- Default Tailwind-template look
- A traditional responsive website simply narrowed to mobile width
- AI-generated landing page cliches (see Absolute bans / hero-metric template)
- A screen that is just a wall of identically-sized cards
- Generic admin panel chrome
- Color: neon, electric blue, aggressive purple gradients, gaming or crypto aesthetics, generic SaaS blue, excessive glassmorphism or gradients
- No specific competitor app was named as a reference or anti-reference; use editorial wellness/lifestyle publishing and nature photography as the implicit mood board instead of any single app's visual system, so the result doesn't converge on a known product's look.

## Design Principles

1. **Native, not web.** A persistent app shell (top header + safe-area-aware bottom tab bar on mobile, adapted nav on desktop) that never feels like a page reflowing at a breakpoint.
2. **Editorial over dashboard.** Every section composes differently — a featured hero, horizontal carousels, category rows, compact lists — never one repeating card grid from top to bottom.
3. **Nature-grounded restraint.** Warm neutrals (cream, sand, beige) carry the surface; sage/forest signal primary actions; terracotta is reserved and rare, used only where premium/upsell needs a spark of warmth. Large imagery and whitespace over ornamentation, shadows, or borders.
4. **Premium clarity, not manipulation.** Premium content is always visible and desirable (thumbnail, title, description, duration, level all shown); the subscription gate is honest and clearly explained, never a dark pattern, and free vs. premium status is legible at a glance.
5. **Motion with intention.** Orchestrated entrance choreography and purposeful micro-interactions (favorite, tab switch, button press) communicate hierarchy and state; nothing animates for decoration alone, and `prefers-reduced-motion` is always respected.

## Accessibility & Inclusion

WCAG 2.1 AA. Sufficient color contrast at every lightness step in the palette, full keyboard navigation, visible focus states, semantic HTML and aria labels throughout, touch targets at least 44x44px, screen-reader-compatible video player and navigation, and `prefers-reduced-motion` honored on every animation.
