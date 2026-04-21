# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal academic portfolio for Hao Tan (haotan.me), built with Hugo and a custom `minimal-modern` theme. Deployed to GitHub Pages on push to `main`.

## Commands

- **Dev server**: `hugo server` (live-reload at localhost:1313)
- **Production build**: `hugo --gc --minify`
- **Create content**: `hugo new <path>.md`

No tests, linter, or package manager — this is a pure Hugo project.

## Architecture

### Data-driven section pages

Homepage and CV pages are both composed of sections driven by YAML files in `data/`. Each entry specifies an `id`, a `partial` template to render it, and a `collection` pointing to a data file under `data/`:

| Page | Source           | Sections (in order)                                                                 |
|------|------------------|-------------------------------------------------------------------------------------|
| `/`  | `data/home.yaml` | About                                                                               |
| `/cv/` | `data/cv.yaml` | Experience · Education · Research                                                   |

| Section    | Partial                  | Data source              |
|------------|--------------------------|--------------------------|
| About      | `content-section.html`   | `data/about.yaml`        |
| Research   | `research-section.html`  | `data/publications.yaml` |
| Experience | `cv-section.html`        | `data/experience.yaml`   |
| Education  | `cv-section.html`        | `data/education.yaml`    |

Sections can also specify `groups` (research uses this to group by type: journal, conference, patent) and `headline_key` (CV sections use this to pick the main heading field, e.g. "role" or "degree").

To add a new section: add an entry in the relevant `data/*.yaml` file, then create the corresponding data YAML file and partial template if they don't already exist.

### Theme layout (`themes/minimal-modern/`)

- `layouts/_default/baseof.html` — Base template: sticky nav, footer, and `<main>` block. Nav is hand-rolled (CV · Projects · Blog); the logo returns to `/` with `aria-current` on the active section.
- `layouts/index.html` — Homepage: hero + section loop over `data/home.yaml`.
- `layouts/cv/list.html` — CV page: title + section loop over `data/cv.yaml` (same pattern as the homepage, different data source).
- `layouts/blog/list.html` · `layouts/blog/single.html` — Blog listing and detail.
- `layouts/projects/list.html` · `layouts/projects/single.html` — Projects listing (cards with year/status/tags) and detail (meta, action links for code/paper/demo, prose, tags footer).
- `layouts/partials/` — Section templates and helpers (`icon.html` for SVG icons including `link` for external URLs, `social-link.html` for social links).

### Content sections

- `content/blog/` — Blog posts. `draft: true` in frontmatter hides them from production builds; `hugo server -D` shows drafts locally.
- `content/projects/` — Projects. Same draft mechanism as blog. Frontmatter supports `status`, `tags`, and a `links` array of `{label, url, icon}` for external actions.
- `content/cv/_index.md` — Title-only index; the actual CV content comes from `data/cv.yaml`.

### Assets

Single CSS file (`themes/minimal-modern/assets/css/main.css`) and single JS file (`themes/minimal-modern/assets/js/main.js`), both processed through Hugo Pipes (minify + fingerprint + SRI hash). CSS uses custom properties for theming and a three-font typographic system: Fraunces (display/headings), Geist (UI elements like nav and labels), Source Serif 4 (body text). Responsive breakpoints: 768px, 560px (mobile menu), 480px.

JS handles: mobile hamburger toggle, publication entry click/keyboard interactions, and click-outside dismissal of active entries. A scroll-spy for in-page anchor links also exists but is dormant with the current top-level nav (no `#`-anchor links present).

### Static assets (`static/`)

- `profile.jpg` — Hero portrait photo (referenced in `hugo.toml` as `params.profilePhoto`).
- `favicon.svg` / `logo.svg` — Site favicon and navigation logo.
- `CNAME` — Custom domain config (`haotan.me`).

### Configuration

`hugo.toml` — Site metadata, social links array (`params.social`), and profile info used by the hero section. Taxonomies are disabled. Blog and Projects are standard Hugo sections under `content/`.

### Styling considerations

This site is used on desktops, tablets, and phones. Keep all three in mind when writing CSS:

- **Hover effects**: Always wrap `:hover` rules in `@media (hover: hover)` so they don't stick on touch screens. For interactive elements that need tap feedback, use `:active` or `:focus-visible` instead.
- **Responsive breakpoints**: 768px (tablet — grid collapses to single column), 560px (mobile — hamburger nav appears), 480px (narrow — tighter padding). Test changes at all three.
- **Touch targets**: Buttons and links should be at least 44×44 CSS pixels on mobile for comfortable tapping.
- **Viewport units**: Prefer `svh`/`svw` over `vh`/`vw` where the mobile address bar affects layout (the hero already does this).

### Deployment

GitHub Actions (`.github/workflows/hugo.yml`): pushes to `main` trigger Hugo build and deploy to GitHub Pages. Hugo version pinned at 0.157.0 (extended).
