# Bad Formatter - Tech Architecture Plan

## 1. Purpose

This document defines the technical architecture for the Bad Formatter MVP. It covers the recommended stack, frontend architecture, data flow, database decision, API strategy, security posture, testing approach, and deployment plan.

The architecture is based on `/docs/01-product-implementation-plan.md` and supports the first release: a privacy-first JSON formatter that runs entirely in the browser.

## 2. Architecture Goals

- Keep the MVP fully client-side.
- Avoid storing, uploading, logging, or transmitting user text.
- Ship as a static website with minimal operational complexity.
- Keep the formatter logic small, testable, and isolated from UI code.
- Make future formatter expansion possible without overbuilding the MVP.
- Support modern browsers on desktop and mobile.

## 3. Recommended Stack

### Frontend

- **Framework:** React
- **Language:** TypeScript
- **Build Tool:** Vite
- **Styling:** CSS Modules or plain CSS with scoped component classes
- **Testing:** Vitest for unit tests
- **Browser/E2E Testing:** Playwright for critical UI flows
- **Linting/Formatting:** ESLint and Prettier

### Runtime

- Static client-side app.
- No server runtime is required for MVP.
- Formatting logic runs in the browser using native JavaScript APIs.

### Browser APIs

- `JSON.parse` for validation and parsing.
- `JSON.stringify` for beautify and minify.
- Clipboard API for copying output.
- Blob API and object URLs for file download.

## 4. Stack Decision Rationale

### Why React + TypeScript + Vite

- React is suitable for the single-screen interactive workspace described in the UI/UX plan.
- TypeScript gives safer formatter result types, status states, and UI action contracts.
- Vite keeps the project lightweight, fast to develop, and easy to deploy as static assets.
- The product does not need server rendering, API routes, or backend features for MVP.

### Why Not a Backend Framework for MVP

Backend infrastructure would add risk to the privacy promise because user text could accidentally be transmitted, logged, or stored. Since all required JSON operations are available in the browser, the MVP should not include a backend.

## 5. High-Level Architecture

```text
User Browser
  |
  |-- React UI
  |     |-- Header
  |     |-- Privacy Notice
  |     |-- Action Toolbar
  |     |-- Input Editor
  |     |-- Output Editor
  |     |-- Status Feedback
  |
  |-- Formatter Domain Logic
  |     |-- validateJson()
  |     |-- beautifyJson()
  |     |-- minifyJson()
  |     |-- getTextStats()
  |
  |-- Browser Integrations
        |-- Clipboard API
        |-- Blob Download API
```

No user text leaves the browser.

## 6. Application Architecture

### 6.1 Suggested Source Structure

```text
src/
  app/
    App.tsx
    App.css
  components/
    ActionToolbar.tsx
    EditorPanel.tsx
    Header.tsx
    PrivacyNotice.tsx
    StatusMessage.tsx
    TextStats.tsx
  domain/
    jsonFormatter.ts
    textStats.ts
  hooks/
    useJsonFormatter.ts
    useClipboard.ts
    useDownload.ts
  types/
    formatter.ts
  test/
    fixtures.ts
```

### 6.2 Module Responsibilities

| Module | Responsibility |
| --- | --- |
| `App.tsx` | Owns the main workspace layout and high-level state |
| `ActionToolbar.tsx` | Renders actions, indentation control, and disabled states |
| `EditorPanel.tsx` | Renders input and output text areas |
| `StatusMessage.tsx` | Displays ready, success, warning, and error states |
| `jsonFormatter.ts` | Contains pure JSON validation, beautify, and minify functions |
| `textStats.ts` | Calculates character count and optional byte/KB estimates |
| `useClipboard.ts` | Wraps Clipboard API behavior |
| `useDownload.ts` | Wraps browser Blob download behavior |
| `formatter.ts` | Defines formatter result and status types |

## 7. State Design

### 7.1 Core UI State

```ts
type IndentSize = 2 | 4;

type FormatterStatus =
  | { type: "ready"; message: string }
  | { type: "success"; message: string }
  | { type: "error"; message: string }
  | { type: "info"; message: string };

type FormatterState = {
  input: string;
  output: string;
  indentSize: IndentSize;
  status: FormatterStatus;
};
```

### 7.2 State Rules

- `input` changes only from user typing/paste or Clear.
- `output` changes only after successful Beautify or Minify, or Clear.
- Validate does not modify `input` or `output`.
- Clear resets `input`, `output`, and status.
- Clear does not need to reset indentation.
- No formatter state is persisted to localStorage in MVP.

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
getTextStats(text: string): { chars: number; bytes: number; kb: number }
```

### 8.3 Parsing Rules

- Use `JSON.parse`.
- Never use `eval`, `Function`, or any code execution approach.
- Empty input should be handled as a UI validation case before parsing.
- Root-level arrays and primitives are valid JSON and should be accepted.
- Error messages should preserve the browser parser message when possible.

## 9. Data Flow

### 9.1 Beautify Flow

```text
User input
  -> Beautify click
  -> JSON.parse(input)
  -> On failure: status = Invalid JSON
  -> On success: JSON.stringify(parsed, null, indentSize)
  -> output = formatted JSON
  -> status = Valid JSON
```

### 9.2 Minify Flow

```text
User input
  -> Minify click
  -> JSON.parse(input)
  -> On failure: status = Invalid JSON
  -> On success: JSON.stringify(parsed)
  -> output = compact JSON
  -> status = Valid JSON
```

### 9.3 Validate Flow

```text
User input
  -> Validate click
  -> JSON.parse(input)
  -> On failure: status = Invalid JSON
  -> On success: status = Valid JSON
  -> output remains unchanged
```

## 10. Database Design

### 10.1 MVP Decision

Bad Formatter MVP uses **no database**.

Reason:

- The product must not store user input or output.
- No account, history, collaboration, or cloud sync exists in MVP.
- All formatting features can run entirely in the browser.

### 10.2 Explicitly Not Stored

- JSON input.
- Formatted output.
- Validation errors that include user content.
- Clipboard content.
- Downloaded file content.
- User history.

### 10.3 Future Analytics Consideration

If anonymous analytics are introduced later, they must only track generic UI events and must never include user text.

Allowed future event shape:

```ts
type AnalyticsEvent = {
  event:
    | "beautify_clicked"
    | "minify_clicked"
    | "validate_clicked"
    | "copy_clicked"
    | "download_clicked"
    | "clear_clicked";
  timestamp: string;
  appVersion: string;
};
```

Disallowed fields:

- `input`
- `output`
- `json`
- `payload`
- `errorWithUserContent`
- `fileContent`

## 11. API Structure

### 11.1 MVP Decision

Bad Formatter MVP exposes **no custom backend API**.

Reason:

- Formatting, validation, copying, and downloading can all happen in the browser.
- No API endpoint should receive user text.
- No server-side processing is needed.

### 11.2 Browser API Usage

| Capability | API |
| --- | --- |
| Validate JSON | `JSON.parse` |
| Beautify JSON | `JSON.stringify(parsed, null, indentSize)` |
| Minify JSON | `JSON.stringify(parsed)` |
| Copy output | `navigator.clipboard.writeText` |
| Download output | `Blob`, `URL.createObjectURL`, anchor click |

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

### 12.2 Security Controls

- Treat JSON as data only.
- Never execute user input.
- Avoid rendering user text as HTML.
- Render editor content as plain text.
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

Note: If analytics are added later, `connect-src` must be reviewed carefully and documented.

## 13. Performance Strategy

### 13.1 MVP Performance Expectations

- Typical small and medium JSON should format instantly.
- Initial bundle should remain small.
- The app should load quickly on modern mobile and desktop browsers.

### 13.2 Large Input Handling

MVP may include a soft warning for large text input.

Recommended initial threshold:

- Warn at approximately 1 MB of text.
- Do not block by default unless performance becomes poor.

Warning copy:

```text
Large JSON may take a moment to process in your browser.
```

### 13.3 Future Performance Options

If large JSON support becomes important:

- Move parsing and formatting to a Web Worker.
- Add file streaming support.
- Add virtualized editor rendering.
- Introduce explicit size limits.

These are out of scope for MVP unless testing shows the base implementation is not acceptable.

## 14. Error Handling Strategy

### 14.1 Error Categories

| Error | Handling |
| --- | --- |
| Empty input | Show `Paste JSON before running this action.` |
| Invalid JSON | Show parser message and line/column when possible |
| Clipboard failure | Show `Could not copy output. Try selecting it manually.` |
| Download failure | Show a short download error message |
| Unexpected app error | Preserve input and show a generic safe error |

### 14.2 Line and Column Detection

Some browsers expose JSON parse errors with a character position. If available:

1. Extract the character position.
2. Count newlines before that position.
3. Calculate column from the last newline.
4. Display line and column in the status message.

If position is unavailable, show the parser message only.

## 15. Testing Strategy

### 15.1 Unit Tests

Test pure formatter functions:

- Valid object JSON.
- Valid array-root JSON.
- Valid primitive JSON.
- Nested JSON.
- Minified JSON.
- Already formatted JSON.
- Invalid JSON with trailing comma.
- Invalid JSON with missing brace.
- Empty input handling.
- 2-space beautify.
- 4-space beautify.
- Minify preserves structure.

### 15.2 Component Tests

Test UI behavior:

- Buttons enable and disable correctly.
- Beautify updates output.
- Minify updates output.
- Validate updates status only.
- Invalid JSON keeps previous output unchanged.
- Clear resets input, output, and status.
- Character counts update.

### 15.3 End-to-End Tests

Critical flows:

- Paste JSON, beautify, copy.
- Paste JSON, minify, download.
- Paste invalid JSON, validate, see error.
- Clear workspace.
- Mobile layout smoke test.

### 15.4 Privacy Tests

Manual or automated checks:

- Confirm no localStorage/sessionStorage writes for input or output.
- Confirm no network request includes user text.
- Confirm no backend endpoint is called for formatting.
- Confirm downloaded file is generated from browser memory.

## 16. Deployment Strategy

### 16.1 Target Deployment

Deploy as a static website.

Recommended platforms:

- Vercel static deployment.
- Netlify static deployment.
- Cloudflare Pages.
- GitHub Pages.

Primary recommendation: **Vercel static deployment** because it works well with Vite and supports simple preview deployments for pull requests.

### 16.2 Build Commands

Recommended commands:

```text
npm install
npm run build
npm run preview
```

Expected build output:

```text
dist/
```

### 16.3 Environment Variables

MVP requires no environment variables.

If analytics are introduced later, analytics configuration must be documented and reviewed against privacy requirements before use.

### 16.4 CI Checks

Recommended checks before deployment:

```text
npm run lint
npm run test
npm run build
```

If Playwright is added:

```text
npm run test:e2e
```

## 17. Observability and Analytics

### 17.1 MVP Decision

No analytics are required for MVP.

Reason:

- The privacy promise is central to the product.
- Avoiding analytics reduces implementation and compliance risk.
- Product validation can start manually.

### 17.2 Future Analytics Rules

If analytics are added:

- Track only generic UI events.
- Never track user text.
- Never track parser messages if they may include user content.
- Document all tracked events in `/docs/`.
- Prefer privacy-preserving analytics.

## 18. Accessibility and Compatibility

### 18.1 Accessibility Targets

- Keyboard-accessible controls.
- Visible focus states.
- Labeled text areas.
- Status feedback exposed to assistive technologies.
- Error messages include text, not only color.

### 18.2 Browser Support

Target modern versions of:

- Chrome.
- Edge.
- Firefox.
- Safari.

Clipboard API may require HTTPS in production. The app should handle clipboard failures gracefully.

## 19. Future Architecture Roadmap

### Phase 2 Enhancements

- Syntax highlighting.
- Line numbers.
- Error highlight in editor.
- JSON file upload.
- Sort object keys.
- Escape and unescape JSON strings.
- JSON tree viewer.

### Architecture Considerations for Phase 2

- Use a dedicated editor library only when basic text areas become insufficient.
- Consider Web Workers for large JSON.
- Keep formatter logic separated by format:

```text
domain/
  formatters/
    json/
      validate.ts
      beautify.ts
      minify.ts
    yaml/
    xml/
```

### Phase 3 Multi-Formatter Expansion

If additional formatters are added, introduce:

- Formatter registry.
- Shared formatter interface.
- Tool routing by selected format.
- Isolated tests per formatter.

Example interface:

```ts
type FormatterAdapter = {
  id: string;
  label: string;
  validate(input: string): FormatterResult;
  beautify(input: string, options: FormatterOptions): FormatterResult;
  minify?: (input: string) => FormatterResult;
};
```

## 20. Key Architecture Decisions

| Decision | Choice | Reason |
| --- | --- | --- |
| App type | Static client-side website | Best fit for privacy-first MVP |
| Framework | React | Good fit for interactive single-screen tool |
| Language | TypeScript | Safer state and formatter contracts |
| Build tool | Vite | Lightweight and fast |
| Database | None | User text must not be stored |
| Backend API | None | Formatting happens in browser |
| Persistence | None for user text | Avoids privacy risk |
| Analytics | None for MVP | Reduces privacy and implementation risk |
| Deployment | Static hosting | Simple, cheap, and reliable |

## 21. MVP Technical Definition of Done

The technical MVP is complete when:

- The app builds as a static client-side site.
- JSON validation, beautify, and minify are implemented with pure browser-side logic.
- No backend API exists for formatting.
- No database exists.
- No user input or output is persisted.
- Copy and download use browser APIs.
- Invalid JSON does not crash the app.
- Unit tests cover formatter behavior.
- UI tests cover the primary user flows.
- The production build can be deployed from static assets.
