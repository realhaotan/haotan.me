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

The homepage is composed of sections defined in `data/home.yaml`. Each entry specifies an `id`, a `partial` template to render it, and an optional `collection` pointing to a data file:

| Section    | Partial                  | Data source              |
|------------|--------------------------|--------------------------|
| About      | `content-section.html`   | `content/_index.md`      |
| Research   | `research-section.html`  | `data/publications.yaml` |
| Experience | `cv-section.html`        | `data/experience.yaml`   |
| Education  | `cv-section.html`        | `data/education.yaml`    |

To add a new section: add an entry in `data/home.yaml`, create the corresponding data YAML file and partial template.

### Theme layout (`themes/minimal-modern/`)

- `layouts/_default/baseof.html` — Base template: sticky nav, hero, section loop, footer. Iterates over `data/home.yaml` and renders each section's partial.
- `layouts/index.html` — Empty; all homepage rendering is in `baseof.html`.
- `layouts/partials/` — Section templates and helpers (`icon.html` for SVG icons, `social-link.html` for social links).

### Assets

Single CSS file (`assets/css/main.css`) and single JS file (`assets/js/main.js`), both processed through Hugo Pipes (minify + fingerprint + SRI hash). CSS uses custom properties for theming. Responsive breakpoints: 768px, 560px (mobile menu), 480px.

JS handles: mobile hamburger toggle, scroll-spy for active nav link (`aria-current`), and publication entry click/keyboard interactions.

### Configuration

`hugo.toml` — Site metadata, social links array (`params.social`), and profile info used by the hero section. Taxonomies are disabled.

### Styling considerations

When modifying CSS, consider that this website is viewed on both devices with a real mouse/trackpad and on touch devices. Use `@media (hover: hover)` to guard hover effects so they don't stick on touch screens.

### Deployment

GitHub Actions (`.github/workflows/hugo.yml`): pushes to `main` trigger Hugo build and deploy to GitHub Pages. Hugo version pinned at 0.157.0 (extended).
