# Bad Formatter

A privacy-first text formatter that runs entirely in your browser. Currently focused on JSON, with more formats coming soon.

> **Your data stays in your browser.** Bad Formatter does not upload, store, or log your text.

---

## Why Bad Formatter?

Developers and technical teams regularly paste API responses, configuration files, tokens, and internal payloads into online formatters — often without knowing whether that data is being stored or transmitted. Bad Formatter takes a different approach:

- **100% client-side** — all formatting, validation, and minification happen in JavaScript within your browser.
- **No backend** — there is no server, database, API, or analytics endpoint that touches your text.
- **No login required** — open the page, paste your JSON, get your result.

## Features

| Feature | Description |
| --- | --- |
| **Beautify** | Convert compact or messy JSON into cleanly indented output (2-space or 4-space). |
| **Minify** | Strip all unnecessary whitespace to produce compact JSON. |
| **Validate** | Check whether input is valid JSON and see clear error messages with line and column info. |
| **Copy** | Copy formatted output to your clipboard with one click. |
| **Download** | Download output as `formatted.json`, generated entirely in-browser via Blob API. |
| **Clear** | Reset the workspace instantly. |
| **Sample JSON** | Load demo JSON to try the tool without finding your own input. |
| **Tree View** | Toggle between raw text and an interactive tree view of the output. |
| **Keyboard Shortcuts** | `Ctrl/⌘ + B` Beautify · `Ctrl/⌘ + M` Minify · `Ctrl/⌘ + L` Validate |
| **Text Stats** | Character count and estimated size (KB) for both input and output. |

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | [React 19](https://react.dev/) |
| Language | [TypeScript](https://www.typescriptlang.org/) |
| Build Tool | [Vite 5](https://vite.dev/) |
| Styling | Vanilla CSS with CSS variables (dark theme) |
| Icons | [Lucide React](https://lucide.dev/) |
| Unit Tests | [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) |
| E2E Tests | [Playwright](https://playwright.dev/) |
| Linting | [ESLint 9](https://eslint.org/) |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- npm

### Install & Run

```bash
# Clone the repository
git clone https://github.com/anfieldlad/bad-formatter.git
cd bad-formatter

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
```

Static assets are output to the `dist/` directory and can be deployed to any static hosting provider (Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc.).

## Available Scripts

| Script | Command | Description |
| --- | --- | --- |
| Dev server | `npm run dev` | Start the Vite development server with HMR. |
| Build | `npm run build` | Type-check with `tsc` then build production assets. |
| Preview | `npm run preview` | Preview the production build locally. |
| Test | `npm run test` | Run unit tests with Vitest. |
| Lint | `npm run lint` | Run ESLint across the project. |

## Project Structure

```
bad-formatter/
├── docs/                        # Product, UX, architecture & engineering plans
│   ├── 01-product-implementation-plan.md
│   ├── 02-ui-ux-implementation-plan.md
│   ├── 03-tech-architecture-plan.md
│   └── 04-engineering-implementation-plan.md
├── public/
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── App.tsx              # Root component — workspace layout & state
│   │   └── App.css              # App-level styles
│   ├── components/
│   │   ├── ActionToolbar.tsx    # Beautify, Minify, Validate, indent controls
│   │   ├── EditorPanel.tsx      # Input / output text editor panel
│   │   ├── EmptyOutput.tsx      # Placeholder for empty output state
│   │   ├── Header.tsx           # Brand wordmark + privacy chip
│   │   ├── JsonTreeView.tsx     # Interactive tree view for JSON output
│   │   ├── StatusMessage.tsx    # Ready / success / error status bar
│   │   └── TextStats.tsx        # Character count & size display
│   ├── domain/
│   │   ├── jsonFormatter.ts     # Pure functions: validate, beautify, minify
│   │   ├── jsonFormatter.test.ts
│   │   ├── sampleJson.ts       # Demo JSON for the "Sample" button
│   │   ├── textStats.ts        # Character & byte counting utilities
│   │   └── textStats.test.ts
│   ├── hooks/
│   │   ├── useClipboard.ts     # Clipboard API wrapper
│   │   ├── useDownload.ts      # Blob download wrapper
│   │   ├── useJsonFormatter.ts # Formatter state management hook
│   │   └── useKeyboardShortcuts.ts
│   ├── types/
│   │   └── formatter.ts        # Shared TypeScript types & result types
│   ├── test/
│   │   ├── fixtures.ts         # Test data fixtures
│   │   └── setup.ts            # Vitest setup (jsdom)
│   ├── index.css               # Global design tokens & base styles
│   └── main.tsx                # App entry point
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── eslint.config.js
└── AGENTS.md                   # AI agent guidelines
```

## Privacy Architecture

Bad Formatter is designed so that user text **never** leaves the browser:

- **No network requests** — formatting uses `JSON.parse` and `JSON.stringify` natively.
- **No storage** — nothing is written to `localStorage`, `sessionStorage`, `IndexedDB`, cookies, or URL params.
- **No analytics on content** — if anonymous analytics are ever introduced, they will track only UI events (e.g. `beautify_clicked`), never user text.
- **No `eval`** — JSON input is treated strictly as data, never executed as code.

## Browser Support

Bad Formatter targets the latest versions of:

- Chrome
- Edge
- Firefox
- Safari

Clipboard API requires HTTPS in production; the app handles clipboard failures gracefully.

## Documentation

Detailed product and engineering documentation lives in the [`docs/`](docs/) directory:

| Document | Description |
| --- | --- |
| [Product Plan](docs/01-product-implementation-plan.md) | Vision, scope, features, user flows, and roadmap. |
| [UI/UX Plan](docs/02-ui-ux-implementation-plan.md) | Layout, design tokens, interaction model, and responsive rules. |
| [Tech Architecture](docs/03-tech-architecture-plan.md) | Stack decisions, data flow, security, and deployment strategy. |
| [Engineering Plan](docs/04-engineering-implementation-plan.md) | Implementation phases, component contracts, and testing plan. |

## Roadmap

| Phase | Focus |
| --- | --- |
| **Phase 1 — MVP** ✅ | JSON beautify, minify, validate, copy, download, clear, privacy notice. |
| **Phase 2** | Syntax highlighting, line numbers, error highlighting, file upload, sort keys, tree viewer enhancements. |
| **Phase 3** | Additional formatters: XML, YAML, SQL, HTML, CSS, JavaScript, Markdown. |
| **Phase 4** | Power tools: JSON diff, path explorer, schema validation, JSON → TypeScript types, JSON → CSV. |

## Contributing

1. Read the documentation in [`docs/`](docs/) before making changes.
2. Keep the MVP focused on JSON unless scope is explicitly expanded.
3. Preserve the privacy-first requirement — user text must never be stored, uploaded, logged, or sent anywhere.
4. Prefer client-side processing for all formatter features.
5. Run `npm run lint && npm run test && npm run build` before submitting a PR.

## License

This project is licensed under the [MIT License](LICENSE).
