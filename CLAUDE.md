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

### Data-driven single-page site

The homepage is composed of sections defined in `data/home.yaml`. Each entry specifies an `id`, a `partial` template to render it, and a `collection` pointing to a data file under `data/`:

| Section    | Partial                  | Data source              |
|------------|--------------------------|--------------------------|
| About      | `content-section.html`   | `data/about.yaml`        |
| Research   | `research-section.html`  | `data/publications.yaml` |
| Experience | `cv-section.html`        | `data/experience.yaml`   |
| Education  | `cv-section.html`        | `data/education.yaml`    |

Sections can also specify `groups` (research uses this to group by type: journal, conference, patent) and `headline_key` (CV sections use this to pick the main heading field, e.g. "role" or "degree").

To add a new section: add an entry in `data/home.yaml`, create the corresponding data YAML file and partial template.

### Theme layout (`themes/minimal-modern/`)

- `layouts/_default/baseof.html` — Base template: sticky nav, hero, section loop, footer. Iterates over `data/home.yaml` and renders each section's partial.
- `layouts/index.html` — Empty; all homepage rendering is in `baseof.html`.
- `layouts/blog/list.html` — Blog post listing with cards (date, title, summary).
- `layouts/blog/single.html` — Individual blog post view.
- `layouts/partials/` — Section templates and helpers (`icon.html` for SVG icons, `social-link.html` for social links).

### Assets

Single CSS file (`assets/css/main.css`) and single JS file (`assets/js/main.js`), both processed through Hugo Pipes (minify + fingerprint + SRI hash). CSS uses custom properties for theming. Responsive breakpoints: 768px, 560px (mobile menu), 480px.

JS handles: mobile hamburger toggle, scroll-spy for active nav link (`aria-current`), and publication entry click/keyboard interactions.

### Static assets (`static/`)

- `profile.jpg` — Hero portrait photo (referenced in `hugo.toml` as `params.profilePhoto`).
- `favicon.svg` / `logo.svg` — Site favicon and navigation logo.
- `CNAME` — Custom domain config (`haotan.me`).

### Configuration

`hugo.toml` — Site metadata, social links array (`params.social`), and profile info used by the hero section. Taxonomies are disabled. Blog is a standard Hugo section under `content/blog/`.

### Styling considerations

This site is used on desktops, tablets, and phones. Keep all three in mind when writing CSS:

- **Hover effects**: Always wrap `:hover` rules in `@media (hover: hover)` so they don't stick on touch screens. For interactive elements that need tap feedback, use `:active` or `:focus-visible` instead.
- **Responsive breakpoints**: 768px (tablet — grid collapses to single column), 560px (mobile — hamburger nav appears), 480px (narrow — tighter padding). Test changes at all three.
- **Touch targets**: Buttons and links should be at least 44×44 CSS pixels on mobile for comfortable tapping.
- **Viewport units**: Prefer `svh`/`svw` over `vh`/`vw` where the mobile address bar affects layout (the hero already does this).

### Deployment

GitHub Actions (`.github/workflows/hugo.yml`): pushes to `main` trigger Hugo build and deploy to GitHub Pages. Hugo version pinned at 0.157.0 (extended).
