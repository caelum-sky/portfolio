# PRD — John Symaiah M. Dagooc Portfolio

## Original Problem Statement
Rebuild/upgrade the personal portfolio: mark education as graduated, add a welcome intro animation before visitors enter, add a milky-way galaxy cursor with a star trail, and produce a cinematic dark/neon portfolio site with hero (rotating "Npm | I am" / "hola | I am" greeting, "John Symaiah M. Dagooc.", "I build things.", Resume + Ask me anything buttons, circuit board visual) and sections: About, Skills, Experience, Projects, Achievements, Certifications, Contact.

## Architecture
- Frontend: React 19 + Tailwind + framer-motion (scroll reveals, kinetic masked hero reveal) + lenis (smooth momentum scroll). Canvas starfield background, canvas galaxy cursor with particle star trail.
- Backend: FastAPI + MongoDB (motor). `POST /api/contact` stores visitor messages; `GET /api/health`.
- Content: single source of truth in `/app/frontend/src/data/portfolio.js`.
- Design tokens + keyframes in `/app/frontend/src/index.css` (Chivo display / IBM Plex Sans body / JetBrains Mono).

## User Personas
- Recruiters/hiring managers scanning experience, certs, resume.
- Collaborators/clients browsing projects and reaching out via contact form or AMA panel.

## Core Requirements (static)
1. Welcome gate (~3s, skippable) before portfolio.
2. Galaxy cursor + star trail (desktop pointers only).
3. All content reflects BSIT graduate status (Bukidnon State University, Class of 2026).
4. Resume section + external resume file link; AMA chat panel with pre-set answers.

## Implemented (2026-09-11)
- WelcomeGate: staged line reveal, glitch status line, progress bar, skip + auto-enter, exit zoom-blur.
- GalaxyCursor: rotating spiral galaxy core + decaying twinkling star trail + hover target-lock ring; disabled on touch.
- Hero: masked line-by-line name reveal, greeting rotator, chips, graduate badge copy, 3D mouse-parallax circuit board + terminal card + floating orbs/badges.
- Sections: About (stats count-up, animated skill bars, code card, tag groups), Skills (6 discipline cards), Experience (glowing timeline, graduation node highlighted gold), Projects (BuildHub, BuKSU Motorpool, BookMe with real links), Achievements (4), Certifications (4, 2 downloadable Cisco PDFs), Resume (HUD panel + external link), Contact (Mongo-backed form + toasts, copy-email), Footer.
- AMA modal: pre-set Q&A with typing effect + keyword-matched free-text input.
- Editorial marquee, scroll progress bar, grain overlay, Lenis smooth scroll.
- Backend: `/api/contact` (validated, stored in `contact_messages`), `/api/health`.

## Known Limitations
- Profile photo and resume.pdf asset URLs from the old job return 403 (expired) — hero uses a styled fallback avatar; resume links point to the dead URL until a fresh file is provided.
- AMA answers are pre-set (not a live LLM).

## Backlog
- P0: Replace profile photo + resume.pdf with fresh uploads.
- P1: LLM-powered AMA (Emergent LLM key), blog/writing section.
- P2: Light theme toggle, page transitions, case-study detail modals.

## Next Tasks
- Ask user for new profile photo + resume file, wire into `data/portfolio.js`.
