# Bad Formatter - Tech Architecture Plan

## 1. Purpose

This document defines the technical architecture for the Bad Formatter MVP. It covers the recommended stack, frontend architecture, data flow, database decision, API strategy, security posture, testing approach, and deployment plan.

The architecture is based on `/docs/01-product-implementation-plan.md` and `/docs/02-ui-ux-implementation-plan.md`. It supports the first release: a privacy-first JSON formatter that runs entirely in the browser.

## 2. Architecture Goals

- Keep the MVP fully client-side.
- Avoid storing, uploading, logging, or transmitting user text.
- Ship as a static website with minimal operational complexity.
- Keep the formatter logic small, testable, and isolated from UI code.
- Make future formatter expansion possible (the header already carries a format tab strip with a single "JSON" tab) without overbuilding the MVP.
- Support modern browsers on desktop and mobile.

## 3. Recommended Stack

### Frontend

- **Framework:** React 19 with function components and hooks
- **Language:** TypeScript (strict mode)
- **Build Tool:** Vite 5
- **Styling:** Plain CSS with CSS custom properties (design tokens) defined in `src/index.css`
- **Icons:** `lucide-react`
- **Testing:** Vitest with `@testing-library/react` and `jsdom`
- **Browser/E2E Testing:** Playwright for critical UI flows (planned, not in MVP)
- **Linting/Formatting:** ESLint and Prettier

### Runtime

- Static client-side app.
- No server runtime is required for MVP.
- Formatting logic runs in the browser using native JavaScript APIs.

### Browser APIs

- `JSON.parse` for validation and parsing.
- `JSON.stringify` for beautify and minify.
- `performance.now()` for action timing in the status line.
- Clipboard API for copying output.
- Blob API and object URLs for file download.

## 4. Stack Decision Rationale

### Why React + TypeScript + Vite

- React is suitable for the single-screen interactive workspace described in the UI/UX plan.
- TypeScript gives safer formatter result types, status states (including the optional `timing` field), and UI action contracts.
- Vite keeps the project lightweight, fast to develop, and easy to deploy as static assets.
- The product does not need server rendering, API routes, or backend features for MVP.

### Why Plain CSS with Custom Properties

- The whole UI fits in one screen, so a CSS-in-JS runtime would be overhead.
- Design tokens (colors, radii, accent system) live in `:root` in `src/index.css`, consumed across `App.css` and component-scoped class names.
- Tokens are easy to audit, the bundle stays small, and dark theming is a property of the tokens themselves rather than a runtime context.

### Why Not a Backend Framework for MVP

Backend infrastructure would add risk to the privacy promise because user text could accidentally be transmitted, logged, or stored. Since all required JSON operations are available in the browser, the MVP must not include a backend.

## 5. High-Level Architecture

```text
User Browser
  |
  |-- React UI
  |     |-- Header (wordmark + tagline + privacy chip + format tab strip)
  |     |-- ActionToolbar (Beautify, Minify, Validate, Indent)
  |     |-- Workspace
  |     |     |-- EditorPanel (Input)   -> in-panel actions: Sample, Clear
  |     |     |-- EditorPanel (Output)  -> in-panel actions: view toggle, Copy, Download
  |     |                                  -> falls back to EmptyOutput overlay
  |     |-- StatusMessage (slim status line; ready, success, error, info)
  |
  |-- Formatter Domain Logic
  |     |-- validateJson()
  |     |-- beautifyJson()
  |     |-- minifyJson()
  |     |-- getTextStats()
  |     |-- sampleJson (static fixture)
  |
  |-- Browser Integrations
        |-- Clipboard API (useClipboard)
        |-- Blob Download API (useDownload)
        |-- Keyboard shortcut listeners (useKeyboardShortcuts)
```

No user text leaves the browser.

## 6. Application Architecture

### 6.1 Source Structure

```text
src/
  app/
    App.tsx
    App.css
    App.test.tsx
  components/
    ActionToolbar.tsx
    EditorPanel.tsx
    EmptyOutput.tsx
    Header.tsx
    JsonTreeView.tsx
    StatusMessage.tsx
    TextStats.tsx
  domain/
    jsonFormatter.ts
    jsonFormatter.test.ts
    sampleJson.ts
    textStats.ts
    textStats.test.ts
  hooks/
    useClipboard.ts
    useDownload.ts
    useJsonFormatter.ts
    useKeyboardShortcuts.ts
  test/
    fixtures.ts
    setup.ts
  types/
    formatter.ts
  index.css
  main.tsx
```

### 6.2 Module Responsibilities

| Module | Responsibility |
| --- | --- |
| `App.tsx` | Composes the workspace. Owns the output view toggle. Wires keyboard shortcuts and in-panel header slots (Sample / Clear / Copy / Download). |
| `Header.tsx` | Wordmark, tagline, privacy chip, and format tab strip. Privacy lives here, not as a separate banner. |
| `ActionToolbar.tsx` | Renders Beautify / Minify / Validate primary transforms with keyboard hints, plus the indent segmented control. |
| `EditorPanel.tsx` | Three-row layout: header (label + slots), body (textarea or children), footer (stats). |
| `EmptyOutput.tsx` | Visual placeholder overlaid on the output editor before the first action. |
| `StatusMessage.tsx` | Slim status line at the foot of the shell. Renders icon, message, and optional timing tail. Uses `aria-live="polite"`. |
| `JsonTreeView.tsx` | Read-only collapsible tree view for valid JSON output. |
| `TextStats.tsx` | Renders `chars · KB` for an editor panel footer. |
| `jsonFormatter.ts` | Pure JSON validate, beautify, minify, and error normalization. |
| `sampleJson.ts` | Static sample JSON string used by the Sample action. Contains no user data. |
| `textStats.ts` | Calculates character count and byte/KB estimates. |
| `useJsonFormatter.ts` | Owns workspace state (input, output, indent, status). Exposes `beautify`, `minify`, `validate`, `loadSample`, `clearInput`, `clear`. Tracks action timing. |
| `useClipboard.ts` | Wraps Clipboard API with a boolean success contract. |
| `useDownload.ts` | Wraps Blob download behavior with a boolean success contract. |
| `useKeyboardShortcuts.ts` | Cross-platform Cmd/Ctrl shortcut binding. Exposes `modKeyLabel()` for UI hints. |
| `formatter.ts` | Type definitions: `IndentSize`, `FormatterStatus`, `JsonFormatResult`, `TextStats`, `OutputView`. |

## 7. State Design

### 7.1 Core UI State

```ts
type IndentSize = 2 | 4;

type FormatterStatus =
  | { type: "ready"; message: string; timing?: string }
  | { type: "success"; message: string; timing?: string }
  | { type: "error"; message: string; timing?: string }
  | { type: "info"; message: string; timing?: string };

type OutputView = "text" | "tree";
```

`useJsonFormatter` owns:

```ts
{
  input: string;
  output: string;
  indentSize: IndentSize;
  status: FormatterStatus;
}
```

`App` owns the local `outputView` (`"text" | "tree"`).

### 7.2 State Rules

- `input` changes only from user typing/paste, the Sample action, or Clear.
- `output` changes only after a successful Beautify or Minify, or Clear.
- Validate does not modify `input` or `output`.
- Clear resets `input`, `output`, and status.
- Clear does not reset indentation.
- The Sample action loads a fixed JSON fixture into `input` and sets an info status. It never clears existing output.
- Status messages may carry a `timing` tail like `beautified in 3 ms`. Timing is informational only and never includes user text.
- No formatter state is persisted to localStorage or any storage in MVP.

## 8. Domain Logic Design

### 8.1 Formatter Result Types

```ts
type JsonFormatSuccess = {
  ok: true;
  value: unknown;
  output?: string;
};

type JsonFormatFailure = {
  ok: false;
  error: string;
  position?: number;
  line?: number;
  column?: number;
};

type JsonFormatResult = JsonFormatSuccess | JsonFormatFailure;
```

### 8.2 Core Functions

```ts
validateJson(input: string): JsonFormatResult
beautifyJson(input: string, indentSize: 2 | 4): JsonFormatResult
minifyJson(input: string): JsonFormatResult
formatJsonError(failure: JsonFormatFailure): string
getTextStats(text: string): { chars: number; bytes: number; kb: number }
```

### 8.3 Parsing Rules

- Use `JSON.parse`.
- Never use `eval`, `Function`, or any code execution approach.
- Empty input is handled at the UI layer before parsing (info status).
- Root-level arrays and primitives are valid JSON and are accepted.
- Error messages preserve the browser parser message when possible, with optional line/column extracted from the parser's character position.

## 9. Data Flow

### 9.1 Beautify Flow

```text
User input
  -> Beautify click (or Cmd/Ctrl+B)
  -> useJsonFormatter.beautify()
  -> performance.now() start
  -> JSON.parse(input)
  -> On failure: status = error, output unchanged
  -> On success: JSON.stringify(parsed, null, indentSize)
  -> output = formatted JSON
  -> status = success with timing tail "beautified in N ms"
```

### 9.2 Minify Flow

Same as Beautify but uses `JSON.stringify(parsed)`. Timing tail is `minified in N ms`.

### 9.3 Validate Flow

```text
User input
  -> Validate click (or Cmd/Ctrl+L)
  -> JSON.parse(input)
  -> On failure: status = error
  -> On success: status = success with "validated in N ms"
  -> output remains unchanged
```

### 9.4 Sample Flow

```text
Sample click
  -> useJsonFormatter.loadSample()
  -> input = sampleJson (static fixture from domain/sampleJson.ts)
  -> status = info "Sample loaded. Try Beautify or Validate."
```

### 9.5 Clear Flow

```text
Clear click
  -> useJsonFormatter.clear()
  -> input = ""
  -> output = ""
  -> outputView = "text"
  -> status = ready
```

### 9.6 Keyboard Shortcuts

`useKeyboardShortcuts` listens for `keydown` and matches by `event.key.toLowerCase()` when `metaKey || ctrlKey` is held. Current bindings:

- `Cmd/Ctrl+B` → Beautify
- `Cmd/Ctrl+M` → Minify
- `Cmd/Ctrl+L` → Validate

The hook prevents the default browser behavior for matched keys.

## 10. Database Design

### 10.1 MVP Decision

Bad Formatter MVP uses **no database**.

- The product must not store user input or output.
- No account, history, collaboration, or cloud sync exists in MVP.
- All formatting features run entirely in the browser.

### 10.2 Explicitly Not Stored

- JSON input.
- Formatted output.
- Validation errors that include user content.
- Clipboard content.
- Downloaded file content.
- User history.
- Action timings (held in the status object only for the lifetime of the next status update).

### 10.3 Future Analytics Consideration

If anonymous analytics are introduced later, they must only track generic UI events and must never include user text, parser error messages, or sample-vs-paste signals derived from input content.

Allowed future event shape:

```ts
type AnalyticsEvent = {
  event:
    | "beautify_clicked"
    | "minify_clicked"
    | "validate_clicked"
    | "copy_clicked"
    | "download_clicked"
    | "clear_clicked"
    | "sample_loaded";
  timestamp: string;
  appVersion: string;
};
```

Disallowed fields: `input`, `output`, `json`, `payload`, `errorWithUserContent`, `fileContent`, `inputLength`.

## 11. API Structure

### 11.1 MVP Decision

Bad Formatter MVP exposes **no custom backend API**.

### 11.2 Browser API Usage

| Capability | API |
| --- | --- |
| Validate JSON | `JSON.parse` |
| Beautify JSON | `JSON.stringify(parsed, null, indentSize)` |
| Minify JSON | `JSON.stringify(parsed)` |
| Action timing | `performance.now()` |
| Copy output | `navigator.clipboard.writeText` |
| Download output | `Blob`, `URL.createObjectURL`, anchor click |
| Keyboard shortcuts | `window.addEventListener("keydown", …)` |

### 11.3 Future API Guardrails

If future releases add APIs, the following rules apply:

- No endpoint may accept raw user text unless the product scope and privacy model are explicitly changed.
- API request and response logs must not include user content.
- Any analytics API must accept event names and metadata only.
- Any future formatter API must be opt-in and clearly separate from the default browser-only mode.

## 12. Security and Privacy Architecture

### 12.1 Privacy Guarantees

- User text is held only in browser memory during the session.
- User text is not stored in localStorage, sessionStorage, IndexedDB, cookies, or a database.
- User text is not sent to a server.
- User text is not sent to analytics.
- User text is not used for AI training.
- The Sample action loads a fixed string compiled into the bundle. It does not fetch and does not learn from user input.

### 12.2 Security Controls

- Treat JSON as data only.
- Never execute user input.
- Avoid rendering user text as HTML. Editor body is a `<textarea>`; the tree view renders typed primitives via React text nodes only.
- Use dependency scanning in CI if dependencies are added.
- Keep dependencies minimal.

### 12.3 Recommended HTTP Headers

For static hosting, configure:

```text
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Permissions-Policy: clipboard-write=(self)
```

If analytics are added later, `connect-src` must be reviewed and documented.

## 13. Performance Strategy

### 13.1 MVP Performance Expectations

- Typical small and medium JSON formats instantly.
- Initial bundle stays small (no heavyweight editor or syntax-highlighting library).
- The app loads quickly on modern mobile and desktop browsers.
- Action timing is surfaced in the status line so regressions are user-visible.

### 13.2 Large Input Handling

`useJsonFormatter.runWithInput` posts an info status when input exceeds approximately 1 MB:

```text
Large JSON may take a moment to process in your browser.
```

This is a soft warning; it does not block the action.

### 13.3 Future Performance Options

If large JSON support becomes important:

- Move parsing and formatting to a Web Worker.
- Add file streaming support.
- Add virtualized editor or tree rendering.
- Introduce explicit size limits.

These remain out of scope for MVP unless real measurement demands them.

## 14. Error Handling Strategy

### 14.1 Error Categories

| Error | Handling |
| --- | --- |
| Empty input | Info status: `Paste JSON before running this action.` |
| Invalid JSON | Error status: parser message + optional `at line L, column C` |
| Clipboard failure | Error status: `Could not copy output. Try selecting it manually.` |
| Download failure | Error status: `Could not download output.` |
| Unexpected app error | Preserve input and surface a generic error message |

### 14.2 Line and Column Detection

`jsonFormatter.ts` extracts a character position from common parser messages, then converts it to line and column by counting newlines. If the position is unavailable, only the parser message is shown.

## 15. Testing Strategy

### 15.1 Unit Tests (Vitest)

`src/domain/jsonFormatter.test.ts`:
- Valid object JSON.
- Valid array-root JSON.
- Valid primitive JSON.
- Nested JSON.
- Already-minified and already-formatted JSON.
- Invalid JSON with trailing comma.
- Invalid JSON with missing brace.
- Empty input handling.
- 2-space and 4-space beautify.
- Minify preserves structure.
- Error position to line/column conversion.

`src/domain/textStats.test.ts`:
- Character count.
- Byte / KB calculation for ASCII and multi-byte input.

### 15.2 Component / Integration Tests

`src/app/App.test.tsx` covers the wired UI:
- Initial state: privacy chip visible, output panel shows the empty state.
- Beautify updates output and status.
- Minify updates output and status.
- Validate updates status; output unchanged.
- Invalid JSON shows an error and preserves any previous output.
- Clear resets input, output, and status.
- Sample populates the input.
- Copy and Download disabled until output exists.
- Keyboard shortcuts trigger the matching action.

### 15.3 End-to-End Tests (Planned)

Critical flows for Playwright:

- Paste JSON → Beautify → Copy.
- Paste JSON → Minify → Download.
- Paste invalid JSON → Validate → see error with line/column.
- Sample → Beautify → Tree view.
- Clear flow.
- Mobile layout smoke test.

### 15.4 Privacy Tests

Manual or automated:

- Confirm no localStorage / sessionStorage / IndexedDB writes for input or output.
- Confirm no network request includes user text.
- Confirm no backend endpoint is called for formatting.
- Confirm downloaded file is generated from browser memory.

## 16. Deployment Strategy

### 16.1 Target Deployment

Deploy as a static website.

Recommended platforms:
- Vercel static deployment.
- Netlify.
- Cloudflare Pages.
- GitHub Pages.

Primary recommendation: **Vercel static deployment** for its Vite affinity and PR preview deployments.

### 16.2 Build Commands

```text
npm install
npm run build
npm run preview
```

Build output goes to `dist/`.

### 16.3 Environment Variables

MVP requires no environment variables.

### 16.4 CI Checks

```text
npm run lint
npm run test
npm run build
```

If Playwright is added: `npm run test:e2e`.

## 17. Observability and Analytics

### 17.1 MVP Decision

No analytics in MVP.

- Privacy is the central product promise.
- Avoiding analytics removes implementation and compliance risk.

### 17.2 Future Analytics Rules

If analytics are added later:

- Track only generic UI events.
- Never track user text.
- Never track parser messages, action timings tied to specific input, or input length.
- Document all tracked events in `/docs/`.
- Prefer privacy-preserving analytics.

## 18. Accessibility and Compatibility

### 18.1 Accessibility

- All controls keyboard-accessible.
- Visible focus state via `box-shadow: var(--accent-glow)` (orange ring).
- `<label htmlFor>` association on every editor.
- `aria-live="polite"` on the status line.
- `aria-pressed` on the view toggle buttons.
- `aria-current="page"` on the active format tab.
- `aria-label` on the privacy chip and JSON formatter workspace landmarks.
- Status communicates state through icon + text + color, never color alone.
- Disabled state expressed via the `disabled` attribute and reduced opacity.

### 18.2 Browser Support

Target modern versions of Chrome, Edge, Firefox, and Safari. The `:has()` selector is used in stylesheets; this is supported in all targeted browsers.

The Clipboard API requires HTTPS in production. The app handles clipboard failures gracefully.

## 19. Future Architecture Roadmap

### Phase 2 Enhancements

- Syntax highlighting in the editor body.
- Line numbers.
- Inline error highlighting at the parse position.
- JSON file upload.
- Sort object keys.
- Escape and unescape JSON strings.
- Search inside the JSON tree view.

### Architecture Considerations for Phase 2

- Use a dedicated editor library (e.g., CodeMirror) only when textareas become insufficient.
- Consider Web Workers for large JSON.
- Keep formatter logic separated by format:

```text
domain/
  formatters/
    json/
      validate.ts
      beautify.ts
      minify.ts
      sample.ts
    yaml/
    xml/
```

### Phase 3 Multi-Formatter Expansion

The `Header` component already renders a format tab strip with a single active "JSON" tab. Adding XML / YAML / SQL / etc. is a matter of adding sibling tabs, a formatter registry, and routing the active tab into a shared workspace.

```ts
type FormatterAdapter = {
  id: string;
  label: string;
  validate(input: string): FormatterResult;
  beautify(input: string, options: FormatterOptions): FormatterResult;
  minify?: (input: string) => FormatterResult;
  sample?: () => string;
};
```

## 20. Key Architecture Decisions

| Decision | Choice | Reason |
| --- | --- | --- |
| App type | Static client-side website | Best fit for privacy-first MVP |
| Framework | React | Good fit for interactive single-screen tool |
| Language | TypeScript (strict) | Safer state and formatter contracts |
| Build tool | Vite | Lightweight and fast |
| Styling | Plain CSS + custom property tokens | No runtime styling; bundle stays small |
| Theme | Dark only | Matches developer-tool aesthetic and product vision |
| Database | None | User text must not be stored |
| Backend API | None | Formatting happens in browser |
| Persistence | None for user text | Avoids privacy risk |
| Analytics | None for MVP | Reduces privacy and implementation risk |
| Sample data | Static module compiled into the bundle | No fetch, no privacy implication |
| Keyboard shortcuts | `useKeyboardShortcuts` hook | Cross-platform via `metaKey || ctrlKey` |
| Deployment | Static hosting | Simple, cheap, and reliable |

## 21. MVP Technical Definition of Done

The technical MVP is complete when:

- The app builds as a static client-side site.
- JSON validation, beautify, and minify are implemented with pure browser-side logic.
- No backend API exists for formatting.
- No database exists.
- No user input or output is persisted.
- Copy and download use browser APIs.
- Keyboard shortcuts (Cmd/Ctrl + B / M / L) are wired and discoverable via title and inline hints.
- Sample data is loadable from a static module without network access.
- Invalid JSON does not crash the app and produces line/column when available.
- Unit tests cover formatter behavior; integration tests cover the primary UI flows.
- The production build can be deployed from static assets.
