# TrustRida

**Know who is coming before you pay.**

TrustRida is a trust layer for small-trade deliveries in Nigeria. An independent seller
(Instagram, WhatsApp, a market stall) sends their buyer **one link**. That link shows who is
delivering the order, what has been verified about them, and where the order has reached.
One record, readable by the seller, the rider and the buyer.

This repository is the **marketing and explainer website** — static HTML and CSS, no build
step, no framework.

---

## Table of contents

1. [What problem this solves](#1-what-problem-this-solves)
2. [Quick start](#2-quick-start)
3. [Deploying to Vercel](#3-deploying-to-vercel)
4. [Project structure](#4-project-structure)
5. [Page map](#5-page-map)
6. [The design system](#6-the-design-system)
7. [Responsive strategy](#7-responsive-strategy)
8. [Accessibility](#8-accessibility)
9. [JavaScript](#9-javascript)
10. [Full changelog — what was rebuilt and why](#10-full-changelog--what-was-rebuilt-and-why)
11. [How this was verified](#11-how-this-was-verified)
12. [Known limitations and next steps](#12-known-limitations-and-next-steps)
13. [Conventions to follow when extending](#13-conventions-to-follow-when-extending)

---

## 1. What problem this solves

Every online sale between strangers starts with the same standoff: **someone has to go first.**

- The buyer will not pay a stranger.
- The seller will not ship to one.

So the sale dies in the chat, or one side takes a risk they should not have to. The honest
seller loses most — they are judged by whoever scammed that buyer last, and screenshots,
testimonials and "trust me" do not help, because that is exactly what a scammer sends too.

TrustRida's answer is narrow and deliberately unglamorous:

| The gap | What TrustRida does |
| --- | --- |
| Nobody knows who is riding | Shows checked identity, registration and bike plate, tied to that order |
| Three chats, no single story | One record all three parties open |
| Proof that can be faked | A live page, not an image — a screenshot cannot update |
| Silence after handover | Status moves as the order moves |
| Disputes with no evidence | Timestamped pickup and delivery |

### The honesty rule (important for the copy)

The site **never promises an outcome.** It says what was checked and what was not.
`energy.html` has a whole section titled *"Verified does not mean risk-free"* listing what we
explicitly do **not** guarantee.

This is a product decision, not just a legal one: a trust product that overpromises is simply
another thing to be scammed by. When you write new copy for this site, keep that voice —
plain, specific, and willing to state its own limits.

---

## 2. Quick start

No build tools, no dependencies, no `npm install`. It is static HTML.

```bash
# clone, then serve the folder
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` directly with `file://` mostly works, but use a server so root-relative
paths and the Google Fonts request behave normally.

**Deploying:** this is a plain static folder, so any static host works — GitHub Pages, Netlify,
Cloudflare Pages or ordinary shared hosting. Step-by-step Vercel instructions are in
[the next section](#3-deploying-to-vercel).

---

## 3. Deploying to Vercel

There is **no build step**, so Vercel just serves the folder. Deployment takes a couple of
minutes and the free Hobby plan is enough for this site.

### Option A — connect a Git repository (recommended)

Best for real use: every push deploys automatically.

1. Push this project to GitHub, GitLab or Bitbucket.
2. Sign in at [vercel.com](https://vercel.com) with that Git account.
3. Click **Add New… → Project**, then **Import** next to this repository.
4. On the configure screen, leave everything at its default:

   | Setting | Value |
   | --- | --- |
   | Framework Preset | **Other** |
   | Root Directory | `./` |
   | Build Command | *leave empty* (there is nothing to build) |
   | Output Directory | *leave empty* (files are served from the repo root) |
   | Install Command | *leave empty* (there are no dependencies) |

   If Vercel guesses a framework, change it to **Other**. A build command on a site with no
   build step is the single most common way to get a failed deploy here.
5. Click **Deploy**. You will get a live `your-project.vercel.app` URL in under a minute.

From then on: every push to your default branch updates production, and every pull request
gets its own **preview URL** you can share before merging.

### Option B — the Vercel CLI

Best for a quick one-off deploy without a Git repo.

```bash
npm i -g vercel        # install once

cd TrustRida-website
vercel                 # first run: log in, answer the prompts, deploy a preview
vercel --prod          # promote to the production URL
```

At the prompts, accept the defaults. When asked to override the build settings, answer **no** —
`vercel.json` and the absent build command already describe this project correctly.

### What `vercel.json` does

The repo ships a `vercel.json` so the hosted site behaves properly. It is worth reading, since
each block exists for a reason:

```json
{
  "trailingSlash": false,
  "headers": [ … ]
}
```

**Security headers** (applied to every response):

| Header | Why |
| --- | --- |
| `X-Content-Type-Options: nosniff` | Stops the browser guessing a file's type and running it as something else |
| `X-Frame-Options: SAMEORIGIN` | Stops another site iframing TrustRida to impersonate it — which matters a lot for a product about not being impersonated |
| `Referrer-Policy: strict-origin-when-cross-origin` | Does not leak full URLs of delivery records to third-party sites |
| `Permissions-Policy` | Explicitly denies camera, microphone and location, none of which this site uses |

**Cache headers.** Note the deliberately modest values:

| Path | `Cache-Control` |
| --- | --- |
| `*.html` | `max-age=0, must-revalidate` |
| `/css/*`, `/js/*` | `max-age=3600, must-revalidate` |
| `/assets/*` | `max-age=86400, must-revalidate` |

The obvious instinct is `max-age=31536000, immutable` on CSS and JS. **Do not do that here.**
That is only safe when filenames contain a content hash (`brand.a91f3e.css`), so a change
produces a *new* filename. These filenames are stable, so an aggressive immutable cache would
leave visitors staring at last week's stylesheet for a year with no way to force an update.
Short revalidating caches are the correct trade-off until a build step adds hashing.

### The 404 page

Vercel automatically serves a root-level `404.html` for any unknown path, so `404.html` in this
repo is picked up with no configuration. It uses the same header, footer and design as the rest
of the site, is marked `noindex`, and — because this is a product about fraud — it tells anyone
who arrives from a broken "delivery link" not to continue with payment.

### Adding a custom domain

1. Project → **Settings → Domains → Add**.
2. Enter your domain (e.g. `trustrida.com`).
3. Point your registrar at Vercel with the records it shows you — usually an `A` record to
   `76.76.21.21` for the apex, and a `CNAME` to `cname.vercel-dns.com` for `www`.
4. HTTPS is provisioned automatically once DNS resolves. Do not add your own certificate.

### Optional: extensionless URLs

Vercel can serve `/contact` instead of `/contact.html`. Add to `vercel.json`:

```json
"cleanUrls": true
```

It is **off by default here**, on purpose. With it on, every internal link (which points at
`contact.html`) costs a `308` redirect hop, and opening the files locally with `file://` no
longer matches production. Turn it on only when you also update the `href`s across all pages —
ideally at the same time as [renaming the non-semantic files](#12-known-limitations-and-next-steps).

### Deployment checklist

Before pointing anyone at the URL:

- [ ] All 9 pages load, including `404.html` (visit a nonsense path like `/nope`)
- [ ] CSS and the logo load — a 404 on `/css/brand.css` means the Output Directory is wrong
- [ ] The mobile menu opens on a real phone, not just a narrow desktop window
- [ ] Forms show their "not yet connected to a mailbox" note, or are wired to a real endpoint
- [ ] `Daelxsa.html` resolves. **Vercel's filesystem is case-sensitive**, unlike macOS and
      Windows, so `daelxsa.html` would 404 in production while working fine on your laptop.
      Every link in this repo already matches its file's exact casing — keep it that way.

---

## 4. Project structure

```
TrustRida-website/
├── index.html              Home
├── Daelxsa.html            Why TrustRida
├── how-it-works.html       How It Works
├── oluwatoks.html          The Details (sample record)
├── energy.html             Verification
├── okakamushunu.html       Guide & FAQ
├── contact.html            Contact
├── erikah.html             Get Started (form)
├── 404.html                Not found (Vercel serves this automatically)
│
├── css/
│   ├── brand.css           Design tokens, reset, typography, buttons, form controls
│   ├── components.css      Header, nav, footer, cards, accordion, tables, notices
│   └── pages.css           Page-specific layouts (hero, proof card, contact, FAQ)
│
├── js/
│   └── main.js             Mobile nav, accordion, form handling, footer year
│
├── assets/
│   ├── logo-mark.svg       Brand mark
│   └── favicon.svg         Browser tab icon
│
├── vercel.json             Hosting config: security + cache headers
└── README.md
```

### Why the CSS is split into three files

This is the part most worth learning from. The three files are ordered by **how widely each
rule applies**, and they must be linked in this order:

```html
<link rel="stylesheet" href="css/brand.css">      <!-- 1. foundation -->
<link rel="stylesheet" href="css/components.css"> <!-- 2. reusable blocks -->
<link rel="stylesheet" href="css/pages.css">      <!-- 3. specific layouts -->
```

| File | Contains | Rule of thumb |
| --- | --- | --- |
| `brand.css` | Variables, reset, `h1`–`h5`, `.btn`, `.card`, `.badge`, `.field` | Used on *every* page |
| `components.css` | `.site-header`, `.site-footer`, `.feature-card`, `.accordion` | Used on *several* pages |
| `pages.css` | `.hero`, `.proof-card`, `.contact-layout`, `.faq-layout` | Used on *one or two* pages |

If you add a style, ask "how many pages need this?" and put it in the matching file. This
prevents the single-giant-stylesheet problem where nobody can tell what is safe to delete.

> **Note on filenames.** `Daelxsa.html`, `oluwatoks.html`, `energy.html`, `okakamushunu.html`
> and `erikah.html` are inherited names that do not describe their content. They were kept so
> no existing shared link breaks. If this site has not been published widely yet, renaming them
> to `why-trustrida.html`, `sample-record.html`, `verification.html`, `faq.html` and
> `get-started.html` would be a genuine improvement — see
> [next steps](#12-known-limitations-and-next-steps).

---

## 5. Page map

| File | Page | Job |
| --- | --- | --- |
| `index.html` | Home | The pitch: the trust gap, three-step flow, who it is for, verification preview |
| `Daelxsa.html` | Why TrustRida | The standoff, honest comparisons vs. delivery apps / receipts / reviews / escrow, our four principles |
| `how-it-works.html` | How It Works | Five-step flow, what each role does, what to do when something does not match |
| `oluwatoks.html` | The Details | A complete **sample** seller record — people, collection round table, payment steps |
| `energy.html` | Verification | What is checked, **what we do not guarantee**, reporting flow, accessibility commitments |
| `okakamushunu.html` | Guide & FAQ | 18 questions in 5 categories, as an accessible accordion |
| `contact.html` | Contact | Contact routes plus a message form |
| `erikah.html` | Get Started | Onboarding form (the CTA target from every page) |
| `404.html` | Not found | Served automatically by Vercel for unknown paths; `noindex` |

Every page shares the same header, footer, `<head>` block and skip link, so the navigation is
identical everywhere and the "active" state is correct on each page.

---

## 6. The design system

Everything is driven by CSS custom properties in `:root` (`css/brand.css`). Change a value
there and it updates across all nine pages.

### Colour

```css
--navy-900: #081726;   --green-700: #056044;   --amber-700: #7a4f00;
--navy-800: #0d2138;   --green-600: #087f5b;   --amber-500: #f4b942;
--navy-700: #102a43;   --green-500: #0ca678;   --amber-100: #fbe7bb;
--navy-600: #1b3a57;   --green-100: #d3efe4;   --amber-50:  #fff8e6;
                       --green-50:  #e9f7f1;
```

Rather than using those raw values in components, the system maps them to **semantic tokens**:

```css
--page / --surface / --surface-sunken / --surface-cream   /* backgrounds */
--ink / --ink-muted / --ink-soft / --ink-invert           /* text */
--line / --line-strong / --line-invert                    /* borders */
```

**Why this matters:** a component says `color: var(--ink-muted)`, not `color: #52667d`. That
means the component describes its *intent*. If the brand palette changes, or a dark theme is
added later, you edit the token definitions — not 60 component rules.

Colour meaning is consistent throughout:

- **Navy** — structure, headings, dark sections
- **Green** — verified, confirmed, go, the brand's primary action
- **Amber** — attention, caution, "read this before continuing", sample-data flags
- **Red** — a mismatch, something not guaranteed, a stop sign

### Type

Two families, loaded from Google Fonts with system-font fallbacks:

- **Plus Jakarta Sans** — headings, buttons, labels, numbers (`--font-display`)
- **Manrope** — body copy (`--font-body`)
- System monospace — reference codes and timestamps (`--font-mono`)

Sizes use a **fluid type scale** built on `clamp()`:

```css
--step-0: clamp(0.98rem, 0.95rem + 0.16vw, 1.06rem);  /* body */
--step-5: clamp(2.4rem,  1.75rem + 3.1vw,  4.1rem);   /* hero h1 */
```

Each `clamp()` takes a minimum, a viewport-relative preferred value, and a maximum. Text scales
smoothly between phone and desktop **without a single font-size media query**. That is the
single biggest reason the responsive CSS here is short.

### Spacing, radii, shadows

A fixed scale (`--space-1` = 4px through `--space-9` = 88px), four shadow depths and six radii.
Using a scale instead of arbitrary numbers is what makes unrelated sections look like they
belong to the same product.

### Vertical rhythm

The reset zeroes all margins (`* { margin: 0 }`), which is predictable but leaves free-flowing
text with no spacing. The system restores it with **zero-specificity** rules:

```css
:where(h1, h2, h3, h4, h5) + :where(p, ul, ol) { margin-top: var(--space-3); }
:where(p) + :where(p, ul, ol)                  { margin-top: var(--space-4); }
```

`:where()` has **specificity 0**, so any component rule overrides it without needing
`!important`. Components that manage their own spacing (cards, notices, section headers) are
explicitly opted out in the block that follows. Learning `:where()` for defaults and normal
selectors for components is a genuinely useful pattern.

---

## 7. Responsive strategy

The site is fluid first and uses breakpoints only where the *layout* must change, not where
text must shrink.

**1. Fluid type and spacing** — `clamp()` handles the continuum (see above).

**2. Intrinsic grids** — instead of "3 columns at desktop, 2 at tablet, 1 at mobile", the grids
decide for themselves:

```css
.grid--3 { grid-template-columns: repeat(auto-fit, minmax(min(268px, 100%), 1fr)); }
```

`auto-fit` fits as many 268px-minimum columns as there is room for. The `min(268px, 100%)` is
essential: without it, a 268px minimum on a 320px screen with padding overflows the viewport.
This one pattern replaces most of the media queries a hand-written layout would need.

**3. Real breakpoints**, only three:

| Width | What changes |
| --- | --- |
| `≤ 1040px` | Nav links tighten so seven items still fit on one line |
| `≤ 900px` | Nav collapses to a hamburger; `--header-h` shrinks to 66px |
| `≤ 520px` | Buttons go full width; the tracking card's stats stack |

**4. Fluid gutters** — `--gutter: clamp(20px, 5vw, 32px)` gives phones tight, comfortable
margins and desktops generous ones, from one declaration.

**5. Wide content scrolls inside itself.** The collection-round table on `oluwatoks.html` has a
`min-width: 560px` inside a `.table-wrap` with `overflow-x: auto`, so the *table* scrolls
sideways on a phone while the *page* never does.

**Verified:** every page was measured at 320px width with zero horizontal overflow.

---

## 8. Accessibility

This was treated as part of the product, not a checklist — TrustRida's users include people on
cheap phones and slow connections, and verification is useless if the person who needs it
cannot reach it.

- **Skip link** on every page, the first focusable element, revealed on focus.
- **Landmarks:** `<header>`, `<nav aria-label="Primary">`, `<main id="main">`, `<footer>`.
- **One `<h1>` per page**, headings in order, no levels skipped for styling reasons.
- **Visible focus:** a 3px amber outline with offset, never `outline: none`.
- **The hamburger is a real `<button>`** with `aria-expanded` and `aria-controls`, updated by
  JavaScript, and closable with `Escape`.
- **The accordion uses real `<button>` elements** inside `<h3>` headings, so a screen reader
  can navigate the FAQ by heading and the triggers are keyboard-operable for free.
- **Every form input has a real `<label for="…">`.** Placeholders are examples, never labels.
- **Decorative SVGs** are `aria-hidden="true"`; meaningful ones have a text alternative.
- **The tracking card** carries a descriptive `aria-label` because it is a visual composition.
- **`prefers-reduced-motion`** disables transitions, animations and smooth scrolling.
- **The data table** has `<caption>` (visually hidden) and `<th scope="col">`.
- **Contrast** — every text/background pair in the palette was measured and passes WCAG AA for
  normal text (≥ 4.5:1). Body text is 14.6:1, muted text 5.9:1, and the faintest tier
  (`--ink-soft`, used for hints and breadcrumbs) 5.0:1 on white and 4.6:1 on the sunken grey.
  `--ink-soft` was darkened from `#7d8fa3` to `#5f7186` during the audit because at its original
  value it only reached 3.3:1 — fine for large text, a failure for the 12–13px hints it is
  actually used on.

---

## 9. JavaScript

`js/main.js` is ~120 lines of vanilla JS, loaded with `defer`, wrapped in an IIFE. There are no
dependencies and **no framework**.

It is written as **progressive enhancement** — with JavaScript disabled:

- every page still renders and reads correctly,
- all navigation links still work (the mobile menu is the only degraded piece),
- the FAQ answers are still in the DOM and reachable.

Four small jobs:

| Function | Job |
| --- | --- |
| `initNav()` | Toggles the mobile menu, syncs `aria-expanded`, closes on link click / `Escape` / resize to desktop |
| `initAccordions()` | Opens and closes FAQ items, syncs `aria-expanded` |
| `initForms()` | Intercepts `form[data-demo-form]`, validates, shows an inline confirmation |
| `initYear()` | Fills `[data-year]` in the footer so the copyright never goes stale |

### The accordion animation trick

Animating `height: auto` is impossible in CSS. The usual hack is a guessed `max-height`, which
clips long answers. This uses CSS Grid instead:

```css
.accordion-panel          { display: grid; grid-template-rows: 0fr;
                            transition: grid-template-rows 0.26s; }
.accordion-item.is-open
  .accordion-panel        { grid-template-rows: 1fr; }
.accordion-panel > div    { overflow: hidden; }
```

`0fr → 1fr` is animatable and adapts to any content length. No guessed magic number.

---

## 10. Full changelog — what was rebuilt and why

The site was rebuilt end to end. Below is every category of change with the reasoning, since
the *why* is the part worth learning.

### 9.1 Broken code that was fixed

| Problem | Where | Why it mattered |
| --- | --- | --- |
| `<!doctype.html>` instead of `<!DOCTYPE html>` | `Daelxsa.html` | Invalid — threw the browser into quirks mode |
| No `<head>` or `<body>` at all | `Daelxsa.html` | No charset, no viewport, no title — unusable on mobile |
| `<link>` to `css/components.css` and `css/responsive.css`, which **did not exist** | `how-it-works.html` | The page rendered half-unstyled |
| `aria-current="Home</a>` — an unterminated attribute swallowing the tag | `oluwatoks.html` | Broke the parse of that nav item |
| `background: #d7f2e6.` — a stray trailing period | `oluwatoks.html` | Invalid declaration, silently dropped |
| Links to `pages/verification.html` and `request.html` | `how-it-works.html`, `erikah.html` | Both were 404s — the **primary CTA on two pages went nowhere** |
| `href="#contact"` pointing at a non-existent anchor | `Daelxsa.html` | The one CTA on the page did nothing |
| "Verrification" (double *r*) in the nav | **6 of 8 pages** | A visible typo in the primary navigation |

**All eight pages now parse with balanced tags, every internal link resolves, and every
in-page anchor exists.** Both were verified programmatically (see §10).

### 9.2 The content problem

`Daelxsa.html` — the "Why TrustRida" page, the second item in the nav — contained the copy of
a **digital marketing agency**: "No Visibility Online", "Poor Social Media", "We run targeted
ads that bring leads", "Bad Video & Media". None of it had anything to do with delivery
verification.

It was rewritten from scratch as a genuine "why this product exists" page: the standoff between
buyer and seller, a today-versus-TrustRida comparison, honest comparisons against delivery
apps / bank receipts / reviews / escrow, and the four principles.

`oluwatoks.html` shipped with **unfilled template placeholders** — `[Business Name]`,
`[Real name]`, `[REF-CODE]`, `[area]` — visible on the live page. It is now a coherent,
clearly-flagged sample record (Adunni Threads, a tailoring studio in Yaba) with a
`Sample record` banner so no reader mistakes it for a real business.

### 9.3 Invented statistics removed

The old homepage displayed **"98.7% On-time"** and **"2.4k Deliveries"**. For a pre-launch
product whose entire pitch is *"do not trust unverifiable claims"*, publishing unverifiable
claims undermines the argument.

They were replaced with descriptions of what the record actually contains ("ID — checked before
dispatch", "Plate — recorded on this order"). Every illustrative card now carries a visible
`Example` or `Sample data` marker.

### 9.4 Emojis and stickers removed

Emojis were used as UI icons throughout: 📉 📱 🌐 🎥 💰 📊 ⏱ 🔒 ✅ 📲 ⭐ 🛡️ 📍 ✓.

They were replaced with **inline SVG icons** (24×24, 1.8px stroke, `currentColor`). Reasons:

1. **Consistency** — emoji render differently on every OS, so the design is not under your control.
2. **Colour** — an emoji cannot inherit brand colour; `stroke="currentColor"` does.
3. **Tone** — a product about fraud and money should not be decorated with stickers.
4. **Accessibility** — screen readers announce emoji by their Unicode name ("chart with downwards trend"), which is noise.
5. **No network cost** — inline SVG needs no icon-font or sprite request.

Verified: a Unicode range scan across all HTML, CSS and JS returns **zero** emoji or pictographs.

### 9.5 Architecture unified

**Before:** three competing design systems.

- `index.html` and `contact.html` linked `css/brand.css` + `css/style.css`
- `how-it-works.html` linked two stylesheets that did not exist
- `oluwatoks.html` had **~180 lines of inline `<style>`** duplicating brand.css with different values
- `energy.html` had **~530 lines of inline `<style>`** and its own colour palette
- `erikah.html` had a **third** palette (`--primary-green: #087F5B`, different greys, `Segoe UI` body font)

`css/brand.css` and `css/style.css` each defined their own `:root` block with overlapping,
conflicting values. Worse, the *same token name* meant different things in different places:
`--amber` was `#8a5a00` (a dark brown) in `css/brand.css` but `#F4B942` (a bright yellow) in
`oluwatoks.html`'s inline block — so `var(--amber)` rendered a different colour depending on
which page you were looking at.

**After:** one system in three layered files. Zero inline `<style>` blocks. Every page links the
same three stylesheets in the same order. `css/style.css` was deleted (fully superseded).

### 9.6 Navigation rebuilt

The old nav had **no mobile menu**. Below 768px it wrapped seven links onto extra rows, shrinking
them to 0.75rem — roughly 12px tap targets, well under the ~44px minimum.

Now:

- A real hamburger `<button>` below 900px, with `aria-expanded` / `aria-controls`.
- The open panel gives each link a 13px-padded, full-width row.
- Closes on link click, on `Escape` (returning focus to the button), and automatically on resize back to desktop.
- The active page is marked with `aria-current="page"` plus an amber underline.
- The header is sticky with a blurred translucent background; `scroll-padding-top` keeps anchor targets from hiding underneath it.

### 9.7 Branding

The logo was a **JPEG hotlinked from `postimg.cc`**, a third-party image host — a hard external
dependency and a single point of failure for the brand mark, present on only 2 of 8 pages (the
other 6 used plain text).

It is now a **local inline SVG** (`assets/logo-mark.svg`) — a navy shield with a green outline
and an amber check — paired with a styled `TrustRida` wordmark. Identical on every page.
A matching `favicon.svg` was added; there was no favicon before.

### 9.8 Forms

| Before | After |
| --- | --- |
| `onsubmit="…alert('Handover logged successfully.')"` | Inline confirmation panel, no `alert()` |
| Inline JS in the HTML attribute | Handler in `js/main.js`, bound via `data-demo-form` |
| No `autocomplete` attributes | `name`, `email`, `tel`, `given-name`, `organization` etc. |
| Claimed "Form state stored locally" (it was not) | States plainly that the form is not yet wired to a mailbox, and gives the email address |

The honesty note matters: a form that silently discards a message is worse than no form. Until
a backend exists, the page says so and offers a working alternative.

### 9.9 SEO and metadata

Added to every page (previously absent almost everywhere):

- A unique, descriptive `<title>` — the old `how-it-works.html` was titled "Home", and `oluwatoks.html` was literally `[Business Name] — Trustrida`
- A unique `<meta name="description">`
- Open Graph and Twitter Card tags for link previews
- `<meta name="theme-color">`
- `<link rel="icon">`
- Consistent Google Fonts loading with `preconnect` (fonts were declared in CSS but only actually loaded on some pages, so several pages silently fell back to system fonts)

### 9.10 Layout and polish fixes found during visual review

These were caught by screenshotting every page rather than by reading the code:

- **No vertical rhythm.** `* { margin: 0 }` left standalone headings touching their paragraphs. Fixed with the `:where()` flow rules (§5).
- **Orphaned grid cards.** `minmax(280px, 1fr)` with `auto-fit` produced 3 columns for a 4-card group, leaving one card alone on a second row. `grid--2` now uses a 420px minimum, giving a clean 2×2.
- **Grids could overflow narrow viewports.** Every `minmax(Npx, 1fr)` became `minmax(min(Npx, 100%), 1fr)`.
- **Misaligned card sections.** The "What TrustRida does" band sat at a different height in each card. `.pair-card` became a flex column with `margin-top: auto` on the solution block, so the bands line up across a row.
- **Ragged FAQ questions.** `text-wrap: balance` inherited from `h3` was breaking long questions into narrow ragged columns; the trigger now uses `text-wrap: pretty`.
- **Inconsistent mobile buttons.** Hero buttons now go full width below 520px.
- **Doubled section padding.** On `oluwatoks.html` several consecutive `.section--tight` blocks
  each contributed their own 72px of padding, leaving ~144px voids mid-document.
  `.section--tight + .section--tight { padding-top: 0 }` makes them read as one continuous page.
- **A failing contrast tier.** `--ink-soft` (hints, breadcrumbs, table footnotes) was `#7d8fa3`,
  which is only 3.3:1 on white — below AA for the small text it was used on. It was recomputed
  along the same hue to `#5f7186`, clearing 4.5:1 on white, the sunken grey *and* the cream
  surface. Found by measuring the palette, not by eye.

---

## 11. How this was verified

Nothing here is "it looked fine". Each item was checked mechanically:

| Check | Method | Result |
| --- | --- | --- |
| HTML well-formedness | Python `HTMLParser` tag-balance check, all 9 pages | All balanced |
| Internal links | Script resolving every non-external `href` and `src` against the filesystem | 0 broken |
| In-page anchors | Every `#fragment` checked against `id=` in the target file | 0 missing |
| Emoji | Unicode-range scan of all HTML, CSS and JS | 0 found |
| Placeholders | Grep for `[Business Name]`, `[REF-CODE]`, `lorem`, etc. | 0 remaining |
| Stale references | Grep for `style.css`, `responsive.css`, `postimg`, `pages/verification`, `request.html` | 0 remaining |
| Horizontal overflow | Headless Chromium at 320px, measuring `scrollWidth - clientWidth` | 0px on every page |
| Heading structure | Counted `<h1>` per page | Exactly 1 on every page |
| Image alt text | Queried all `<img>` without an `alt` attribute | 0 |
| Empty links | Links with neither text nor `aria-label` | 0 |
| Filename casing | Every `href`/`src` compared against the file's exact casing | All match — required on Vercel |
| `vercel.json` | Parsed as JSON | Valid |
| Mobile nav | Chrome DevTools Protocol — clicked the real button, read back class and ARIA state | Opens and closes, `aria-expanded` correct |
| Visual review | Screenshots of every page at 1440px and 390px | Reviewed; issues in §10.10 found and fixed |

Reproduce the static checks yourself:

```bash
# every internal link resolves
for f in *.html; do
  grep -o 'href="[^"#][^"]*"' "$f" | sed 's/href="//;s/"$//' \
    | grep -v '^https\?:\|^mailto:\|^tel:' | sed 's/#.*//' | sort -u \
    | while read -r t; do [ -z "$t" ] || [ -e "$t" ] || echo "BROKEN $f -> $t"; done
done

# no emoji anywhere
grep -Poc '[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}\x{FE0F}]' *.html css/*.css js/*.js | grep -v ':0$'
```

---

## 12. Known limitations and next steps

Stated plainly, in the spirit of the product:

1. **The forms do not submit anywhere.** `contact.html` and `erikah.html` validate and confirm
   client-side only. Wire them to a backend, or a service like Formspree / Netlify Forms, and
   then remove the "not yet connected to a mailbox" note.
2. **The filenames are not semantic.** `Daelxsa.html`, `okakamushunu.html`, `erikah.html`,
   `energy.html` and `oluwatoks.html` do not describe their pages. They were kept to avoid
   breaking shared links. Renaming them (and adding redirects if the site is already live) would
   improve both SEO and maintainability.
3. **The header and footer are duplicated in eight files.** That is the honest cost of having no
   build step: a nav change means editing eight files. Acceptable at this size; if the site grows
   past ~12 pages, adopt a static site generator (Eleventy, Astro, Jekyll) and extract them into
   one partial.
4. **Fonts load from Google Fonts.** Self-hosting the two families would remove a third-party
   request and improve privacy and first paint — worth doing for an audience on slow connections.
5. **No sitemap or `robots.txt`.** Add both before launch — `sitemap.xml` listing the eight
   real pages (not `404.html`), and a `robots.txt` pointing at it.
6. **No analytics or cookie notice.** If analytics are added, a consent notice will be needed.
7. **The sample record is static.** `oluwatoks.html` demonstrates the concept but is not driven
   by real data — that is the actual product, not this marketing site.

---

## 13. Conventions to follow when extending

If you are a student picking this up, these are the rules the codebase already follows. Keeping
them is what stops a clean project from decaying.

**CSS**

- Never hard-code a colour, space or radius. Use a token from `:root`.
- Put a rule in the narrowest file that covers its use (§3).
- Class naming is loosely BEM: `.block`, `.block__element`, `.block--modifier`.
- Prefer intrinsic layout (`auto-fit` + `minmax(min(Npx, 100%), 1fr)`) over new breakpoints.
- Never write `outline: none` without providing a visible alternative.

**HTML**

- Copy the `<head>`, header and footer from an existing page so all nine stay identical.
- Set `class="active"` **and** `aria-current="page"` on the current nav item — and only there.
- One `<h1>` per page; do not skip heading levels for styling.
- Every input needs a `<label for>`. A placeholder is not a label.
- Decorative SVGs get `aria-hidden="true"`.

**Copy**

- Say what was checked and what was not. Never promise an outcome.
- Label every illustrative figure as `Example` or `Sample data`.
- No invented statistics. If you cannot source a number, describe the thing instead.
- No emoji.

**Before committing**

Run the link and emoji checks in §10, and view the page you changed at 320px, 768px and 1440px.

---

## Tech stack

HTML5 · CSS3 (custom properties, Grid, Flexbox, `clamp()`) · Vanilla JavaScript ·
No build step · No dependencies

Courtesy of Payload Pod.
