# AGENTS.md

## Project Context

This repository contains **Bad Formatter**, a privacy-first web application for formatting and validating text. The initial MVP focuses on JSON.

Before implementing product, UX, or technical changes, agents must read the documentation in `/docs/`.

Primary references:

- `/docs/01-product-implementation-plan.md`
- `/docs/02-ui-ux-implementation-plan.md`
- `/docs/03-tech-architecture-plan.md`
- `/docs/04-engineering-implementation-plan.md`

## Agent Guidelines

- Treat `/docs/` as the source of product intent and implementation direction.
- Keep the MVP focused on JSON unless the user explicitly changes scope.
- Preserve the privacy-first requirement: user text must not be stored, uploaded, logged, or sent to analytics.
- Prefer client-side processing for formatter features.
- Do not add backend services, user accounts, history, autosave, or cloud sync unless requested.
- Keep new documentation inside `/docs/`.
- Update `/docs/01-product-implementation-plan.md` when product scope, requirements, or roadmap decisions change.

## Implementation Priorities

1. JSON validate, beautify, and minify.
2. Copy, download, and clear actions.
3. Clear error feedback.
4. Responsive, efficient UI.
5. Explicit privacy messaging.

## Quality Bar

- Invalid JSON must not crash the app.
- Formatting must use safe parsing, not code evaluation.
- The app should be usable without login.
- The app should remain useful even as a static website.
- Any analytics, if introduced later, must never include user text.
