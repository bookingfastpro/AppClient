---
name: Wellness App
description: A calm, editorial, mobile-first wellness practice app for yoga, meditation, breathing, and sleep.
colors:
  cream: "#faf6ef"
  surface: "oklch(100% 0 0)"
  sand: "oklch(96.5% 0 0)"
  beige: "oklch(91% 0 0)"
  ink-900: "oklch(20% 0.01 155)"
  ink-600: "oklch(46% 0.008 155)"
  ink-300: "oklch(65% 0.006 155)"
  sage-50: "oklch(96% 0.02 150)"
  sage-100: "oklch(92% 0.035 150)"
  sage-300: "oklch(80% 0.05 150)"
  sage-500: "oklch(62% 0.07 150)"
  sage-600: "#5f6b4f"
  sage-700: "#4e583f"
  nav-active: "#b86b4f"
  forest-800: "oklch(32% 0.06 155)"
  forest-900: "oklch(24% 0.045 155)"
  terracotta-500: "oklch(62% 0.13 40)"
  terracotta-600: "oklch(54% 0.14 38)"
  brick-error: "oklch(52% 0.15 25)"
typography:
  display:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(2.125rem, 5.5vw, 3.25rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  wordmark:
    fontFamily: "Playfair Display, Georgia, serif"
    fontWeight: 600
  headline:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 3vw, 1.5rem)"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.005em"
  body:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "Plus Jakarta Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.06em"
rounded:
  xs: "6px"
  sm: "10px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "20px"
  lg: "32px"
  xl: "56px"
  2xl: "96px"
components:
  button-primary:
    backgroundColor: "{colors.sage-600}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.sage-700}"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.pill}"
    padding: "14px 28px"
  premium-badge:
    backgroundColor: "{colors.terracotta-500}"
    textColor: "{colors.cream}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  video-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
  bottom-nav:
    backgroundColor: "{colors.cream}"
    rounded: "{rounded.none}"
---

# Design System: Wellness App

## 1. Overview

**Creative North Star: "Yogella, the Quiet Studio"**

Picture a small, sunlit yoga studio at 7am: raw plaster walls, a linen mat, one low shelf, light coming through linen curtains. Nothing shouts. The room is warm because of materials, not decoration. That is the interface: a calm surface built from a small set of well-chosen warm neutrals, with sage and forest green standing in for the plants at the edge of the room, and terracotta appearing only as rarely as a single ceramic bowl would on that shelf.

This system explicitly rejects the generic SaaS dashboard (sidebar, KPI cards, data tables), the default Tailwind-template look, a website simply narrowed to mobile width, AI-landing-page cliches (gradient hero text, the hero-metric template, a wall of identical cards), and any hint of neon, electric blue, aggressive purple gradients, gaming/crypto aesthetics, or excessive glassmorphism. Nothing here is loud. Distinctiveness comes from restraint, warm material color, and an editorial serif at large sizes, not from extreme weight contrast or saturated color coverage.

**Key Characteristics:**
- Warm neutral surface (cream/sand/beige) that reads as material, not as "white background"
- Sage and forest green carry primary actions and identity; committed enough to be recognizable, never more than a supporting third of any screen
- Terracotta is reserved exclusively for premium/upsell moments — its rarity is what makes it register
- Playfair Display at bold weight for the brand voice; bold Plus Jakarta Sans for section headings, so serif and sans carry two distinct jobs
- Flat-by-default surfaces with tonal layering; shadow only appears for genuinely floating elements

## 2. Colors: The Yogella Palette

Warm, tinted neutrals dominate the surface; sage/forest is the one committed identity color; terracotta is a rare, deliberate spark reserved for premium moments only.

### Primary
- **Sage** (`sage-600`, oklch(52% 0.08 152)): primary buttons, active nav state, links, focus rings, the color of "yes, do this." `sage-700` (oklch(44% 0.075 153)) is its hover/pressed state.
- **Forest** (`forest-800`, oklch(32% 0.06 155)): deep accent for dark surfaces (video player chrome, image overlays, the occasional full-bleed section) — never the default background, only where real depth is needed.

### Tertiary
- **Terracotta** (`terracotta-500`, oklch(62% 0.13 40)): premium badges, the "Start membership" CTA, and nothing else. If terracotta appears more than once per screen, that's a bug, not a design choice.

### Neutral
- **Cream** (`cream`, `#faf6ef`): the ground. Every page background, the app header, the bottom tab bar, the marketing header and the whole back office sit on it.
- **Surface** (`surface`, oklch(100% 0 0)): cards, sheets, inputs. Pure white, one step above the ground, so an elevated surface is legible without needing a shadow.
- **Sand** (`sand`, oklch(96.5% 0 0)): secondary surface / skeleton-loading fill / subtle section dividers.
- **Beige** (`beige`, oklch(91% 0 0)): borders and hairline dividers. Held ~9% below the background so input fields keep a discernible boundary.
- **Ink 900 / 600 / 300**: near-black, mid gray, and placeholder gray, each carrying only a whisper (chroma ≤0.01) of the forest hue so text belongs to the brand without reading as a colour temperature.
- **Ink 900 / 600 / 300** (oklch(28% 0.035 55) / oklch(45% 0.03 55) / oklch(65% 0.02 60)): primary text, secondary text, and disabled/placeholder text. Ink, never pure black — it carries the same warm hue as the neutrals so text never reads as a cold overlay on a warm surface.

### Mood palette (scoped exception)

The "Comment te sens-tu aujourd'hui ?" tiles on the authenticated home screen are the one place where hues outside the warm-neutral/sage system are permitted. That grid is a colour-coded index: seven needs have to be told apart at a glance, and seven shades of sage cannot do that. Tokens live in `globals.css` as `--color-mood-*`.

Constraints that keep it from leaking into the rest of the app:
- Backgrounds sit at ~92-94% lightness with chroma ≤0.055, so they read as soft paper tints; only the glyph carries real saturation.
- No mood hue approaches terracotta's, so the premium spark stays unambiguous.
- These tokens are used by the mood tiles and their destination pages, nowhere else. A mood colour appearing on a video card, a button, or navigation chrome is a bug.

### Named Rules
**The Active-Tab Exception.** `nav-active` (`#b86b4f`) marks the selected tab in the bottom bar, and nothing else. It sits close to terracotta in hue but is a separate token on purpose: terracotta still means "premium" everywhere else, and the two must never be swapped for one another. Because the bar is the one place the two could be confused, the premium badge never appears there.

**The One Spark Rule.** Terracotta is premium-only. It never appears on free content, navigation, or generic UI chrome — the moment a user sees terracotta, they know they're looking at something that requires membership.

**The Two-Ground Rule.** There are exactly two backgrounds: `cream` (`#faf6ef`) is the ground everything sits on, and `surface` (pure white) is what sits on top of it — cards, sheets, inputs. Nothing else introduces a background colour. Fills, borders and shadows stay true grays at chroma 0, and text carries at most 0.01 chroma of the forest hue.

*(This supersedes two earlier rules. The original Warm Neutral Rule tinted every neutral warm, which made the whole interface read as beige. The Clean-White Rule that replaced it pushed the ground to pure white, which left white cards invisible on a white page. The current split keeps the warmth in the ground alone, where it gives the product its character, and reserves white for elevation.)*

## 3. Typography

**Display Font:** Playfair Display (variable), with Georgia as fallback
**Body Font:** Plus Jakarta Sans, with system-ui as fallback

**Character:** Playfair Display is a high-contrast transitional serif: fine hairlines against solid stems, sharp bracketed serifs. At bold weights it reads as confident and editorial, which is what the brand voice needs to carry a screen on its own. Plus Jakarta Sans is humanist and rounded at the terminals, highly legible at small sizes, and explicitly chosen over Inter/Roboto to avoid the default AI-generated-app look.

### Hierarchy
- **Wordmark** (Playfair, weight 600): "Yogella" in the app header, the auth screens, the marketing header, the admin shell. Nothing else.
- **Display** (Jakarta, weight 700, `clamp(2.125rem, 5.5vw, 3.25rem)`, line-height 1.1): the greeting, page-opening titles ("Nos univers", "Ma pratique", "Favoris").
- **Headline** (Jakarta, weight 700, `clamp(1.25rem, 3vw, 1.5rem)`, line-height 1.25): section titles ("Derniers ajouts", "Reprends là où tu t'étais arrêtée").
- **Title** (weight 600, 1.0625rem, line-height 1.35): card titles, video titles in lists.
- **Body** (weight 400, 1rem, line-height 1.6, max 70ch): descriptions, paragraph copy.
- **Label** (weight 600, 0.75rem, letter-spacing 0.06em, uppercase): eyebrows, duration/level metadata, category chips.

### Named Rules
**The Serif-Is-The-Logo Rule.** Playfair Display appears in exactly one place: the "Yogella" wordmark. Every other piece of text in the product, page titles included, is Plus Jakarta Sans. The interface speaks in one voice and the brand signs it; mixing a serif back into page titles blurs which of the two you are reading.

*(This supersedes two earlier rules. The original Restraint-Over-Extremity Rule capped display type at weight 450, which produced a whisper where the reference design calls for a statement. The Two-Voices Rule that briefly replaced it also set page titles in serif; in practice that read as decoration rather than hierarchy, so the serif retreated to the wordmark alone.)*

## 4. Elevation

Flat by default, with tonal layering doing most of the depth work: `cream` → `surface` → `sand` is already a visible step without any shadow. True `box-shadow` is reserved for elements that are genuinely floating above the content plane — sheets, the video player's floating controls, a toast/snackbar — and even then it is warm-tinted (ink-tinted, not gray/black) and soft.

### Shadow Vocabulary
- **ambient-low** (`box-shadow: 0 2px 8px oklch(28% 0.035 55 / 0.06)`): resting elevation for the app-shell header and bottom nav.
- **ambient-md** (`box-shadow: 0 8px 24px oklch(28% 0.035 55 / 0.09)`): sheets, dropdown menus, the floating "favorite" confirmation toast.
- **ambient-lg** (`box-shadow: 0 16px 48px oklch(28% 0.035 55 / 0.12)`): full-screen video player controls overlay only.

### Named Rules
**The Flat-By-Default Rule.** A card at rest never has a shadow. Shadows appear only in response to something being above the base plane (a sheet, a modal, a sticky floating control) — never as decoration on a static card.

## 5. Components

### Buttons
- **Shape:** full pill (`rounded.pill`, 999px) — soft, human, non-institutional.
- **Primary:** `sage-600` background, `cream` text, 14px/28px padding, weight 600 label-style text.
- **Hover / Focus:** background shifts to `sage-700`; focus-visible gets a 2px `sage-500` ring offset 2px from the pill edge, never a harsh browser-default blue outline.
- **Ghost / Secondary:** `surface` background, `ink-900` text, 1px `beige` border — used for "Manage subscription", "Clear search," secondary actions that shouldn't compete with the primary CTA.

### Chips
- **Category chip:** `sand` background, `ink-900` text, pill shape, used for category filters in Explore.
- **Premium badge:** `terracotta-500` background, `cream` text, small lock glyph inline, pill shape — see The One Spark Rule.
- **Level/duration metadata:** no background, `ink-600` label-style text with a small dot separator, not a chip — too many small chips is visual noise.

### Cards / Containers
Cards are used deliberately, not reflexively — the Home screen mixes a large featured hero card, horizontally-scrolling compact video cards, and borderless category rows in the same view, never one repeating grid top to bottom.
- **Featured/hero card:** `rounded.xl` (32px), full-bleed image with a `forest-800` gradient scrim at the bottom third for text legibility, no border.
- **Standard video card:** `rounded.lg` (24px), `surface` background, no border, `ambient-low` shadow only if it's inside a horizontally-scrolling carousel (to separate it from the page background during scroll).
- **Compact list row (e.g. Favorites):** `rounded.sm` (10px), no shadow, a 1px `beige` bottom divider instead — flatter treatment for dense lists.
- **Internal Padding:** `spacing.md` (20px) for featured cards, `spacing.sm` (12px) for standard cards.

### Inputs / Fields
- **Style:** `surface` background, 1px `beige` border, `rounded.md` (16px), 1rem body text, generous 14px vertical padding — large enough to feel comfortable with an on-screen keyboard.
- **Focus:** border shifts to `sage-500`, plus a soft `sage-100` background tint — no harsh glow.
- **Error:** border shifts to `brick-error` (oklch(52% 0.15 25)), helper text below in the same color — never a raw red, kept inside the warm palette family.

### Navigation
- **Bottom tab nav (mobile):** `cream` background, `ambient-low` shadow on the top edge only, fixed height plus `env(safe-area-inset-bottom)` padding. Active tab: icon + label in `sage-600` with a small pill-shaped background behind the icon; inactive: `ink-300` icon + label, no background. Transition on tab change is a quick 150ms color/background fade, never a layout shift.
- **Top header:** `surface` background, `ink-900` title in Title-scale type, transparent-to-solid scroll transition on scrollable screens.
- **Desktop nav:** the bottom tab bar becomes a left-aligned top nav row (not a sidebar — sidebars read as "admin panel," which is an explicit anti-reference); same active/inactive color logic.

### Video Card (signature component)
The core repeating unit of the catalog. Thumbnail (16:9, `rounded.lg` top corners only when part of a card, full corners when standalone in a carousel), a top-right premium badge overlay when `is_premium`, title in Title scale below, and a Label-scale metadata row (duration · level · category) using a middle-dot separator, never separate chips for each.

## 6. Do's and Don'ts

### Do:
- **Do** use `sage-600` as the one committed identity color for every primary action and active state — it should be instantly recognizable as "this app's green," not an arbitrary Tailwind green.
- **Do** vary card treatment by context (featured hero vs. carousel card vs. compact list row) per the Components section — three distinct card treatments minimum across the Home screen.
- **Do** keep terracotta exclusively on premium/upsell surfaces (The One Spark Rule).
- **Do** reserve Playfair Display for the "Yogella" wordmark alone, and set every other heading in bold Plus Jakarta Sans (The Serif-Is-The-Logo Rule).
- **Do** respect `prefers-reduced-motion` on every animation; keep entrance choreography under ~400ms per element with staggered starts, not longer.
- **Do** use only the two grounds (The Two-Ground Rule): `cream` for the page, `surface` for what sits on it. Borders, fills and shadows stay at chroma 0.

### Don't:
- **Don't** build a generic SaaS dashboard: no sidebar, no KPI-card rows, no data-table chrome anywhere in the authenticated app.
- **Don't** use the default Tailwind gray scale or pure black (`#000`) — neutrals must route through the cream/surface/sand/beige/ink tokens, which are now untinted.
- **Don't** use neon colors, electric blue, aggressive purple gradients, gaming or crypto aesthetics, or generic SaaS blue.
- **Don't** use gradient text (`background-clip: text` on a gradient) anywhere — emphasis comes from serif size/weight, never a gradient headline.
- **Don't** use a colored `border-left`/`border-right` stripe as an accent on cards or list items — use a full border, a background tint, or nothing.
- **Don't** repeat the hero-metric SaaS template (big number, small label, gradient accent) anywhere in the product.
- **Don't** stack more than one visually identical card grid in a row on the Home screen — that reads as "a collection of random cards," an explicit anti-reference.
- **Don't** apply a shadow to a card at rest with nothing floating above it (The Flat-By-Default Rule).
