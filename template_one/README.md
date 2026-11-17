# CISCM Website — HTML / CSS / JS source

Redesigned pages for the Chartered Institute of Supply Chain Management (ciscm.us).

**Stack:** plain HTML5 · CSS3 · vanilla JavaScript · Bootstrap 5.3 · Bootstrap Icons · Swiper 11 · GSAP 3 (+ ScrollTrigger).
No build step — open any `.html` file in a browser (online, so the CDN libraries and media load).

---

## 1. Files

```
index.html                    Home
about.html                    About CISCM
professional-standards.html   Body of Knowledge: Four Currents, 14 domains, 5 levels, 6 threads
credentials.html              CFS · CP · ChSCP (tabs), candidate journey, assessment
membership.html               Benefits, grades, framework, organisational membership, CPD, obligations
accreditation.html            Overview, routes, lifecycle, institutional, program
solutions.html                Employers · Education Providers · Corporate Academies (tabs)
professional-services.html    Ecosystem, 11 services, engagement process
integrity.html                Quality assurance, public claims, complaints, appeals
verify.html                   Program · Accreditation · Member verification (tabs)
contact.html                  Enquiry routes + form

assets/css/ciscm.css          All custom styles
assets/js/ciscm-media.js      Logo, background video and photo links  <-- edit media here
assets/js/ciscm.js            All interactions
```

## 2. No class conflicts with the existing site

- **Every custom class starts with `cxm-`** (e.g. `cxm-card`, `cxm-hero`, `cxm-btn--primary`).
- **Every custom CSS rule is scoped** under the `.cxm` wrapper; there are no bare element
  selectors (`h1`, `p`, `a`, `body`) that could restyle the existing site.
- CSS variables are prefixed `--cxm-`.
- JavaScript hooks use `data-cxm-*` attributes only, and the script runs inside a closure
  (no global variables except `window.CXM_MEDIA`).
- The only non-prefixed classes in the HTML are standard **Bootstrap** (grid, spacing,
  navbar, dropdown), **Bootstrap Icons** (`bi bi-*`) and **Swiper** (`swiper`, `swiper-slide`…).

**To drop a section into an existing page:** copy its `<section>…</section>` markup, wrap it in
`<div class="cxm">…</div>`, and load `ciscm.css`, `ciscm-media.js` and `ciscm.js` (plus the
libraries below). If the existing site already loads Bootstrap 5, don't load it twice.

## 3. Libraries (loaded from jsDelivr CDN in every page)

| Library | Used for |
|---|---|
| Bootstrap 5.3.3 (CSS + bundle JS) | Grid, utilities, navbar collapse, dropdowns |
| Bootstrap Icons 1.11.3 | All icons (`<i class="bi bi-…">`) |
| Swiper 11 | Home "Why CISCM" carousel, Credentials "candidate journey" carousel |
| GSAP 3.12.5 + ScrollTrigger | Hero intro animation, scroll reveals (`.cxm-reveal`), photo parallax, list animations |

If GSAP fails to load, everything still shows (the `cxm-no-gsap` fallback disables the
hidden-until-revealed state). Visitors who ask for reduced motion get no animation or autoplay.

## 4. Changing videos, photos and the logo

Open **`assets/js/ciscm-media.js`**. In the HTML:

- `<div data-cxm-video="homeHero">` plays the clips listed under `videos.homeHero`
- `<div data-cxm-photo="port">` shows `photos.port` as its background

Replace any link to change it. Each video entry is a list; the browser plays the first one that
works. If none load, the poster photo and colour overlay stay visible.

**Logo:** `logo:` currently points to the image the live site uses in its footer
(`CISCM_footer.png`). If it fails to load, a built-in CISCM wordmark is shown. The header is dark,
so a white/light logo version works best.

**Licences — please check before launch:**
- Stock clips are from **Mixkit**. Mixkit uses two licences: the free *Mixkit License*
  (commercial use allowed) and a *Restricted* licence (personal use only) on some clips.
  Open each clip's page on mixkit.co and confirm it is under the free licence.
- Photos marked `unsplash(...)` are the Unsplash photos already used on ciscm.us.
- For reliability, download the clips you keep, host them on your own server and update the links.

## 5. Interactive components (how they work)

| Component | Markup hook | Notes |
|---|---|---|
| Tabs | `data-cxm-tabs` > `data-cxm-tab="key"` + `data-cxm-pane="key"` | Opening `page.html#key` selects that tab |
| Four Currents explorer | `data-cxm-currents` | Panel text lives in the `CURRENTS` object in `ciscm.js` |
| Domain filter | `data-cxm-filters="#gridId"` + `data-cxm-domain="material"` | |
| Proficiency staircase | `data-cxm-levels`, each `.cxm-level` has `data-name` / `data-text` | |
| Orbit diagram | `data-cxm-orbit`, each `.cxm-orbit-sat` has `data-label` / `data-text` | Satellites position themselves |
| Count-up numbers | `data-cxm-count="72"` | |
| Animated bars | `.cxm-bar span[data-w="70%"]` | |
| Carousels | `data-cxm-swiper="teasers"` or `"journey"` | Arrow buttons: `data-cxm-swiper-nav` |
| Background video | `data-cxm-video` inside a `data-cxm-scope` block | Pause button: `data-cxm-vid-toggle` |
| Forms | `data-cxm-form="#successBoxId"` | Front-end only — see section 7 |
| Contact route cards | `data-cxm-pick="Membership"` | Sets the `data-cxm-type` select |

## 6. Colours

Add a tone class to recolour any card, icon, tab, step or badge:
`cxm-t-blue`, `cxm-t-sky`, `cxm-t-teal`, `cxm-t-emerald`, `cxm-t-amber`, `cxm-t-orange`,
`cxm-t-rose`, `cxm-t-cyan`, `cxm-t-indigo`.
The Four Currents use orange (Material), emerald (Money), sky (Information) and rose (Trust).
Brand tokens (navy, amber, fonts) are at the top of `ciscm.css`.

## 7. Still to connect (needs your developer)

- **Contact form** and **Verify search** show a front-end message only. Point the `<form>`s at your
  backend (add `action`/`method`, or replace the submit handler in `ciscm.js` section 12).
- **Download buttons** (Body of Knowledge, Accreditation Handbook) use `href="#"` — link your PDFs.
- **Apply buttons** link to the live pages `ciscm.us/membership-apply` and
  `ciscm.us/apply-institutional-accreditation`.
- **Placeholder** on the Contact page (`cxm-ph`, yellow): postal address / phone / social links.
- Footer legal links point to the live Privacy, Terms and Accessibility pages.
