# OBSIDIAN — Design System v2

**Status:** Specification only. No code changed. This is the source of truth for the Phase‑2 visual unification.
**Goal:** one coherent, premium visual language at Apple / Linear / Stripe / Awwwards fidelity, derived from the existing UI and unified into clean token scales.

This document has three layers:
1. **Principles** — the rules that make choices for us.
2. **Foundations** — token scales (color, space, type, radius, glass, elevation, motion, icon).
3. **Components** — button / input / card systems built from foundations.
4. **Audit → Resolution** — the concrete inconsistencies found in the current UI and their v2 value.

---

## 0. Principles

1. **Depth through light, not lines.** Surfaces separate via soft inner highlights, blur, and shadow — borders stay near‑invisible (≤16% white). Obsidian base, light pulled forward.
2. **One accent at a time.** `ion` (cool) is the system interactive color. `ember` (warm) is reserved for the founder/flagship and the conversion finale. Never both in one component. `violet/magenta/nebula` are *decorative depth only* (canvas, glows) — never text or controls.
3. **Restraint is the premium signal.** Calm spacing, few weights, slow confident motion. If an effect doesn't earn its frame cost or attention, it's removed.
4. **Motion is choreography, not decoration.** One signature reveal curve, consistent stagger, entrance once. Hovers are fast and physical; reveals are slow and cinematic.
5. **Type carries the brand.** Unbounded for display moments only; Manrope does the reading; mono is the technical "label" voice. Tight tracking on display, wide tracking on labels.
6. **Accessibility is part of premium.** Text meets WCAG AA, focus is always visible, motion respects `prefers-reduced-motion`.

---

## 1. Color System

### 1.1 Base / surface ramp
| Token | Hex | Role |
|---|---|---|
| `bg/void` | `#05060a` | Page base (html) |
| `bg/abyss` | `#0a0c14` | Raised base / alt section |
| `bg/surface` | `#0e1018` | Solid raised surface |
| `depth/violet` | `#3b1e6e` | Decorative depth only |
| `depth/nebula` | `#2a1a4a` | Decorative depth only |
| `depth/nebula-deep` | `#1b1036` | Decorative depth only |

### 1.2 Glass fills & borders (alpha on white)
| Token | Value | Use |
|---|---|---|
| `glass/fill-1` | `rgba(255,255,255,0.025)` | Nav (rest) |
| `glass/fill-2` | `rgba(255,255,255,0.04)` | Cards / panels (rest) |
| `glass/fill-3` | `rgba(255,255,255,0.06)` | Hover / selected |
| `border/hairline` | `rgba(255,255,255,0.08)` | Default separation |
| `border/strong` | `rgba(255,255,255,0.16)` | Hover / emphasis |
| `highlight/top` | `rgba(255,255,255,0.07)` | Inner top highlight (`inset 0 1px`) |

### 1.3 Text ramp
| Token | Hex | Role | Contrast on void |
|---|---|---|---|
| `text/primary` | `#eaf0ff` (starlight) | Headings, key text | ~16:1 ✅ |
| `text/secondary` | `#8a93ad` (dust) | Body, descriptions | ~6.3:1 ✅ |
| `text/muted` | **`#7c8398`** *(new)* | Small meta/labels that must read | ~4.6:1 ✅ |
| `text/decorative` | `#565d72` (dust-dim) | **Decorative only** — large/non‑essential | ~3.4:1 ⚠️ |

> **v2 fix:** small functional text (step counters, hints, footer ©) moves from `dust-dim` → **`text/muted #7c8398`** to pass AA. `dust-dim` is retained only for large or purely decorative marks.

### 1.4 Accents
| Token | Hex | Meaning |
|---|---|---|
| `accent/ion` | `#5ee6ff` | **Primary interactive** — links, primary CTA, focus, default accent |
| `accent/ion-soft` | `#9af1ff` | Ion highlight / gradient stop |
| `accent/ember` | `#ff6a3d` | **Reserved** — founder/flagship, final CTA only |
| `accent/magenta` | `#ff3d7f` | Decorative gradient depth only |

**Accent tint scale (applies to ion *or* ember):**
| Token | Value | Use |
|---|---|---|
| `accent/tint-bg` | `8%` | Selected/featured fill |
| `accent/tint-bg-soft` | `6%` | Subtle fill |
| `accent/border` | `45%` | Control border (rest) |
| `accent/border-strong` | `60%` | Control border (hover/selected) |
| `accent/ring` | `18%` | 1px accent ring on elevated hover |

### 1.5 Accent usage rules
- **Default everything interactive to `ion`.** Switch a whole context to `ember` only for: founder (Rashid), AI engineer (Mubashshir) flagship cards, and the Final‑CTA section.
- Numerals/stats use the **silver gradient** (see §3.5), not an accent.
- Decorative gradients (HeroWave, glows) may use blue→violet→magenta; these never touch text or controls.

---

## 2. Spacing System

**Base unit = 4px.** All spacing is a multiple. Use the named steps; avoid arbitrary px.

| Token | px | Token | px |
|---|---|---|---|
| `space/1` | 4 | `space/8` | 32 |
| `space/2` | 8 | `space/10` | 40 |
| `space/3` | 12 | `space/12` | 48 |
| `space/4` | 16 | `space/16` | 64 |
| `space/5` | 20 | `space/20` | 80 |
| `space/6` | 24 | `space/28` | 112 |
| `space/7` | 28 | `space/32` | 128 |

### 2.1 Section rhythm (unified)
| Context | Vertical padding | Horizontal |
|---|---|---|
| Standard section | `py-28` (112) → `sm:py-32` (128) | `px-6` (24) |
| Hero | full‑height `min-h-[100svh]`, content bottom‑anchored | `px-6` |
| Finale (CTA) | `py-28` → `sm:py-36` (144) — one step more air | `px-6` |

- **Eyebrow → title:** `space/4` (16) · **Title → intro:** `space/4` (16) · **Header → content grid:** `space/16` (64).
- **Grid gaps:** cards `space/6` (24); dense grids (stats) `space/5` (20) → `space/6`.
- **Container widths:** `content` 72rem (`max-w-6xl`), `prose/header` 48rem (`max-w-3xl`), `narrow/form` 36rem (`max-w-xl`), `stats` 64rem (`max-w-5xl`).

---

## 3. Typography Scale

**Families:** `display` = Unbounded · `sans` = Manrope · `mono` = JetBrains Mono. Subsets: latin + cyrillic.

### 3.1 Ramp
| Token | Family / Weight | Size (clamp) | Line | Tracking |
|---|---|---|---|---|
| `type/display` (Hero h1) | Unbounded 600 | `clamp(2.5rem, 5.5vw, 5rem)` † | 1.05 | -0.02em |
| `type/h2` (Section) | Unbounded 600 | `clamp(2rem, 4.5vw, 3.25rem)` | 1.1 | -0.01em |
| `type/h3` (Card title) | Unbounded 600 | `1.125rem → 1.25rem` | 1.2 | -0.01em |
| `type/title` (Form Q) | Unbounded 500 | `1.5rem → 1.75rem` | 1.25 | -0.01em |
| `type/stat` (Numeral) | Unbounded 600 | `clamp(2.25rem, 6vw, 3.5rem)` | 1.0 | -0.01em, `tabular-nums` |
| `type/body-lg` | Manrope 400 | `1.0625rem` (17) | 1.6 | 0 |
| `type/body` | Manrope 400 | `0.9375rem` (15) | 1.6 | 0 |
| `type/body-sm` | Manrope 400 | `0.8125rem` (13) | 1.55 | 0 |
| `type/label` (Eyebrow) | Mono 500 | `0.6875rem` (11) | 1 | **0.28em**, uppercase |
| `type/meta` (Counter/hint) | Mono 500 | `0.6875rem` (11) | 1 | 0.2em |

† **Hero display min exception** — see §3.6 (Hero uses a `2.3rem` clamp min, not `2.5rem`).

### 3.2 Tracking rule (unified)
All uppercase mono **eyebrows/labels = `0.28em`** (replaces the current 0.2/0.22/0.25/0.3/0.32 spread). Inline mono meta (counters, "Enter ↵") = `0.2em`.

### 3.3 Color pairing
Headings → `text/primary`; body/intro → `text/secondary`; eyebrows → accent (`ion` default, `ember` in flagship/finale); meta/hints → `text/muted`.

### 3.4 Display reveal & LCP rule
The Hero `h1` is the LCP element. **It must be painted immediately** — entrance uses a clip/translate mask reveal with text already at full opacity (no `opacity:0` gate). Reveal duration ≤ 0.9s. (Spec note from the perf audit; implementation later.)

### 3.5 Numeral (stat) treatment
Silver vertical gradient text: `linear-gradient(180deg,#f3f6ff,#b6c2d8)`, `tabular-nums`, weight 600. No accent color on numerals.

### 3.6 Display min — multilingual exception (Hero) †
The **Hero display text uses a clamp minimum of `2.3rem`, not the `type/display` `2.5rem`.** Everything else stays DS: `5.5vw` scaling and the `5rem` max are kept.

- **Reason:** at `2.5rem` the longest Russian word — **"маркетплейсов."** — clips on **390–406px** mobile widths (measured ~7px per side; the word renders ~404px wide and is cut by `overflow-x: hidden`). At `2.3rem` it fits with margins.
- **Effective Hero token:** `clamp(2.3rem, 5.5vw, 5rem)`, line `1.05`, tracking `-0.02em`. Desktop is identical to `type/display` (the `vw`/max terms dominate above mobile, so this only affects the smallest screens).
- **Classification:** this is a **documented multilingual typography exception, not design drift.** The base `type/display` token remains `2.5rem` for any non-Hero use; only the Hero overrides the minimum, and the override is recorded in-code on the Hero `h1`.

### 3.7 Multilingual verification rule (applies to all display tokens)
**Before applying any display/heading token globally, verify the longest UZ *and* RU words at 390px mobile width.** Cyrillic compounds (e.g. "маркетплейсов.") and long Uzbek terms can exceed a clamp minimum that looks fine in English. A token only passes once the longest word in every shipped locale fits at 390px without clipping or horizontal overflow.

---

## 4. Border Radius Scale

| Token | px | Applied to |
|---|---|---|
| `radius/sm` | 12 | Inputs, choice chips, inner frames |
| `radius/md` | 16 | Small cards |
| `radius/lg` | 20 | Stat cards, option cards |
| `radius/xl` | 24 | Feature cards (Team, Services) |
| `radius/2xl` | 28 | Panels / consoles |
| `radius/pill` | 9999 | Buttons, nav, language switcher |

> **v2 fix:** collapses the current ad‑hoc `14 / 16 / 18 / 22 / 28` into the scale above. Feature cards standardize to **24** (`radius/xl`); inner frames to **12** (`radius/sm`).

---

## 5. Glass System

Three glass tiers. Each = fill + blur + border + inner highlight. Never exceed tier‑3 blur (cost + over‑frost).

| Tier | Use | Fill | Blur | Border | Inner highlight |
|---|---|---|---|---|---|
| `glass/1` | Nav (rest) | `fill-1` 2.5% | 12px (`md`) | `hairline` 8% | `inset 0 1px white/7%` |
| `glass/2` | Cards | `fill-2` 4% | 18px (`xl`) | `hairline` 10% | `inset 0 1px white/6%` |
| `glass/3` | Panels / consoles | `fill-2` 4% | 24px (`2xl`) | `hairline` 10% | `inset 0 1px white/7%` |

**State transitions**
- Nav scrolled: fill → `bg/void 70%`, blur → `xl`, border → 10%.
- Card hover: fill → `fill-3` 6%, border → `border/strong` 16–18%.

> **v2 fix:** unifies the current fill spread (2.5 / 3 / 4 / 5 / 5.5%) to **three values (2.5 / 4 / 6%)** and blur (`md / xl / 2xl`) to the tiers above.

---

## 6. Shadow / Elevation System

A 4‑step ladder. Shadows are deep, soft, and far‑offset (premium "floating" feel); accent rings communicate interactivity.

| Token | Definition | Use |
|---|---|---|
| `elev/0` | `inset 0 1px 0 rgba(255,255,255,0.06)` | Flat surfaces, rest hairline |
| `elev/1` | `inset 0 1px 0 rgba(255,255,255,0.06), 0 30px 60px -34px rgba(0,0,0,0.85)` | Card rest |
| `elev/2` | `inset 0 1px 0 rgba(255,255,255,0.10), 0 46px 90px -36px rgba(0,0,0,0.9), 0 0 0 1px var(--accent-ring)` | Card hover (accent ring: ion or ember @ 18%) |
| `elev/3` | `inset 0 1px 0 rgba(255,255,255,0.07), 0 36px 100px -44px rgba(0,0,0,0.85)` | Panels / consoles |

**Accent glows (separate, for buttons/featured):**
- `glow/ion` = `0 0 40px -8px rgba(94,230,255,0.45)`
- `glow/ember` = `0 0 40px -8px rgba(255,106,61,0.50)`

> **v2 fix:** standardizes the hover accent ring to a single **18%** opacity (replaces the current 0.14 / 0.2 mix) and formalizes the four elevations used ad‑hoc today.

---

## 7. Hover System

Hover is **fast + physical**; reveals (§8) are slow + cinematic. Per‑family rules:

| Element | Lift | Border | Fill | Shadow | Accent | Timing |
|---|---|---|---|---|---|---|
| Feature/stat/option **card** | `translateY -6px` | →16–18% | →6% | `elev/1 → elev/2` | bottom accent line scale‑x 0.75→1; ring in | 400ms `ease/standard` |
| **Button** (primary/ghost) | none | →brighter | gradient/bg up | glow up | — | 300ms `ease/standard`, `active: scale .97` |
| **Image** (portrait) | none | — | — | — | `scale 1.06` | 1200ms `ease/standard` |
| **Choice chip** | none | →25% (rest) / accent (selected) | →accent tint | — | — | 300ms |
| **Text/mono link** | none | — | — | — | color `muted → primary`/accent | 300ms |

> **v2 fix:** all card lifts unify to **‑6px** (replacing the ‑1/‑1.5/‑2 mix). Hover sheen sweep (current Team card) becomes optional, reserved for flagship cards only.

---

## 8. Animation Timing & Transition Curves

### 8.1 Easing tokens
| Token | cubic‑bezier | Use |
|---|---|---|
| `ease/reveal` | `0.16, 1, 0.3, 1` | **Signature** entrance/reveal (expo‑out) |
| `ease/standard` | `0.4, 0, 0.2, 1` | Hover / state / UI transitions |
| `ease/exit` | `0.4, 0, 1, 1` | Elements leaving |
| Lenis scroll | `1.001 - 2^(-10t)` | Smooth scroll (expo‑out, matches `ease/reveal` feel) |

### 8.2 Duration scale
| Token | ms | Use |
|---|---|---|
| `dur/instant` | 100 | Press feedback |
| `dur/fast` | 200 | Small state |
| `dur/base` | 300 | Hovers, color/border |
| `dur/slow` | 500 | Card lift, accent line |
| `dur/reveal` | 700 | Section/card entrance |
| `dur/cinematic` | 1200 | Image zoom, hero subtitle |

### 8.3 Entrance (reveal) pattern — unified
```
initial:  { opacity: 0, y: 24 }
inView:   { opacity: 1, y: 0 }
transition: { duration: 0.7, ease: ease/reveal }
viewport: { once: true, margin: "-80px" }
stagger:  delay = (index % columns) * 0.08
```
- **Unify `viewport.margin` to `-80px`** (replaces ‑60/‑70/‑80) and **stagger to 0.08** (replaces 0.07/0.08/0.09).
- Entrance offset `y` ≤ 24px for content, ≤ 44px allowed for hero‑scale cards.
- **Reduced motion:** `MotionConfig reducedMotion="user"` — transforms drop, opacity remains; HeroWave renders a single static frame; Lenis disables wheel smoothing.

### 8.4 Ambient motion budget
- HeroWave: one rAF, **pauses when off‑screen** (spec requirement) and on tab‑hidden / reduced‑motion.
- No more than the two existing rAF loops (HeroWave + Lenis). New ambient animation must justify its frame cost.

---

## 9. Icon Style

One coherent line‑icon language; **no mixed unicode glyphs as icons.**

| Property | Value |
|---|---|
| Grid | 24×24 (also 20, 16) |
| Stroke | 1.5px (1.75 at 16px) |
| Caps / joins | round / round |
| Fill | none (stroke only) |
| Color | `currentColor` (inherits text/accent) |
| Source | single set — custom 1.5px or Lucide normalized to 1.5 |

- Required set: `arrow-down`, `arrow-right`, `arrow-left`, `chevron`, `check`, `return/enter`, `globe`/lang, `close`.
- **v2 fix:** replace inline `→ ← ↵` text arrows in buttons/cards with the SVG set (mono arrows allowed *only* inside mono‑label text like "Back", where they read as typography, not iconography).
- Success check keeps the heavier `2.2` stroke as an intentional "confirmation" accent (documented exception).

---

## 10. Button System

**Shape:** pill (`radius/pill`). **Font:** Manrope 500, `text-sm`, `tracking-wide`. Gap to icon `space/2.5` (10px).

### 10.1 Variants
| Variant | Border | Fill | Text | Shadow | Use |
|---|---|---|---|---|---|
| **Primary** | `ion/45` → `ion/70` hover | `linear-gradient(180deg, ion/16, ion/7)` | `primary` | `inset 0 1px white/16% + glow/ion` | Main CTA |
| **Secondary / Ghost** | `white/15` → `white/30` | `white/2%` → `white/6%` | `primary` | `inset 0 1px white/6%` | Alt action |
| **Tertiary / Text** | none | none | `muted → primary` | none | Back / low‑emphasis |
| **Ember (finale)** | `ember/45` → `ember/70` | `linear-gradient(180deg, ember/16, ember/7)` | `primary` | `inset 0 1px white/16% + glow/ember` | Final‑CTA primary only |

### 10.2 Sizes
| Size | Padding | Text |
|---|---|---|
| `sm` | `px-5 py-2.5` | 13px |
| `md` | `px-6 py-3.5` | 14px |
| `lg` | `px-8 py-4` | 14px (default for hero/CTA) |

### 10.3 States
- **Hover:** border + glow up (per variant), `dur/base` `ease/standard`.
- **Active:** `scale 0.97`.
- **Focus‑visible:** `ring-2 ring-accent/50 ring-offset-2 ring-offset-#05060a`.
- **Disabled:** `opacity 0.4`, no pointer, no glow.
- **Magnetic** (optional): `lg` primary only; content eases ≤ `strength 0.4` toward cursor via motion values (no React re‑render). Disabled under reduced‑motion / touch.

---

## 11. Input System

### 11.1 Variant A — Underline (display input)
For the questionnaire's single‑field, large moments.
- `border-b white/15`, transparent bg, **Unbounded** `text-[26px] → 3xl`.
- Focus: `border-b ion/70`. Placeholder: `text/decorative @ 50%`.

### 11.2 Variant B — Boxed (standard fields)
For any future multi‑field form.
- `radius/sm` (12), `border white/10`, `fill white/3%`, `px-4 py-3`, Manrope 15.
- Hover `border white/18`; Focus `border ion/55 + ring ion/20%`.

### 11.3 States (both)
| State | Treatment |
|---|---|
| Default | border `hairline`/15% |
| Hover | border → 18% |
| Focus | accent border (`ion/55–70`) + ring (boxed) |
| Filled | `text/primary` |
| Error | border `ember` + helper text (mono 11px `ember`) |
| Disabled | `opacity 0.4`, no caret |

### 11.4 Choice chip (single‑select)
- `radius/sm`, `border white/10`, `fill white/2%`, `px-4 py-4`, `text-sm`.
- Selected: `border ion/55`, `fill ion/8%`, `text/primary`, `aria-pressed`.
- Hover: `border white/25`, `fill white/4%`.
- **v2 fix:** add `focus-visible: ring ion/50` (currently missing — keyboard users can't see focus).

### 11.5 Progress (form stepper)
- Track segments: `h-[3px] rounded-full`; done = `ion/70`, todo = `white/10`; `dur/slow` color transition.
- Counter: `type/meta`, `text/muted`, `tabular-nums`.

---

## 12. Card System

All cards = a glass tier + radius + elevation + hover family. Four roles:

| Role | Glass | Radius | Rest → Hover | Notes |
|---|---|---|---|---|
| **Feature card** (Team, Services) | `glass/2` | `radius/xl` (24) | `elev/1 → elev/2` + lift ‑6px | bottom accent line; inner `radius/sm` hairline frame optional; ember ring for flagship, ion otherwise |
| **Stat card** (Results) | `glass/2` | `radius/lg` (20) | `elev/1 → elev/2` + lift ‑6px | centered; silver numeral; top‑light reveal on hover; `min-h` 150→176 |
| **Option card** (Final CTA, choices) | `glass/2` | `radius/lg` (20) | lift ‑6px + border up | left‑aligned; "select →" affordance (mono label); featured = ember tint + ring + `glow/ember` |
| **Panel / Console** (Questionnaire, Final CTA) | `glass/3` | `radius/2xl` (28) | static (`elev/3`) | padding `p-8 → sm:p-10`; optional top hairline accent + soft ambient glow (single radial, no particles) |

**Shared card anatomy**
- Inner top highlight (`inset 0 1px white/6–7%`) on every card.
- Accent line (bottom) reveal: `scale-x 0.75 → 1`, `dur/slow`.
- Corner index/eyebrow uses `type/label` + accent tick.
- Padding: feature/option `p-6` (`sm:p-7`); panel `p-8` (`sm:p-10`).

> **v2 fix:** card padding collapses to **`p-6/p-7`** (cards) and **`p-8/p-10`** (panels), replacing the current `6/7/8/10/12` spread. Panel max blur capped at `glass/3` (24px).

---

## 13. Audit → Resolution (what v2 unifies)

| Property | Current (inconsistent) | v2 (unified) |
|---|---|---|
| Border radius | 14 / 16 / 18 / 22 / 28 + full | scale: 12 / 16 / 20 / 24 / 28 / pill |
| Eyebrow tracking | 0.20 / 0.22 / 0.25 / 0.30 / 0.32 em | **0.28em** (labels), 0.2em (meta) |
| Glass fill | 2.5 / 3 / 4 / 5 / 5.5 % | **2.5 / 4 / 6 %** (3 tiers) |
| Backdrop blur | md / xl / 2xl (mixed by element) | tiered: `glass/1=md`, `/2=xl`, `/3=2xl` |
| Card hover lift | ‑1 / ‑1.5 / ‑2 (4/6/8px) | **‑6px** (cards) |
| Hover accent ring | 0.14 / 0.20 | **0.18** |
| Card padding | p‑6 / 7 / 8 / 10 / 12 | cards **6/7**, panels **8/10** |
| Section padding | py‑28 / 32 / 36 / 40 | standard **28→32**, finale **28→36** |
| `whileInView` margin | ‑60 / ‑70 / ‑80 px | **‑80px** |
| Stagger delay | 0.07 / 0.08 / 0.09 | **0.08** |
| Small text color | `dust-dim` (~3.4:1 ⚠️) | `text/muted #7c8398` (AA ✅) |
| Focus on chips/options | missing | `ring ion/50` required |
| Arrows | mixed SVG + unicode `→←↵` | single SVG icon set (1.5px) |
| Hero h1 reveal | `opacity:0` (delays LCP) | mask/translate reveal, text painted |

---

## 14. Token naming (for implementation later)

Recommend exposing these as Tailwind v4 `@theme` tokens + CSS variables, e.g. `--ds-radius-xl: 24px`, `--ds-ease-reveal`, `--ds-glow-ion`, `--ds-text-muted`. Component classes (`.ds-card`, `.ds-btn-primary`, `.ds-panel`) compose foundations so a single token change propagates everywhere.

**Out of scope for this document:** implementation, refactors, and any UI change. Those await explicit approval.
