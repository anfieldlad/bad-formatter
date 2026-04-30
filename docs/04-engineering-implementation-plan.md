# Bad Formatter - Engineering Implementation Plan

## 1. Purpose

This document turns the product, UI/UX, and technical architecture plans into an actionable engineering plan for building the Bad Formatter MVP.

References:

- `/docs/01-product-implementation-plan.md`
- `/docs/02-ui-ux-implementation-plan.md`
- `/docs/03-tech-architecture-plan.md`

The MVP is a static, client-side JSON formatter built with React, TypeScript, and Vite. It has no backend API, no database, no account system, no autosave, and no storage of user text.

## 2. Engineering Goals

- Build a usable JSON formatter workspace as the first screen.
- Keep all JSON processing in the browser.
- Keep formatter logic pure, isolated, and well tested.
- Avoid persistence of user input and output.
- Deliver a responsive UI that works on desktop and mobile.
- Provide clear error, success, empty, copy, download, and clear states.
- Keep the codebase simple enough to extend later with additional formatters.

## 3. Delivery Strategy

Build the MVP in thin vertical slices:

1. Project foundation.
2. Pure JSON formatter domain logic.
3. Static UI shell.
4. Full formatter interactions.
5. Copy, download, clear, and stats.
6. Responsive polish and accessibility.
7. Tests, privacy verification, and production build.

Each slice should leave the app runnable and easier to verify.

## 4. Proposed Project Structure

```text
bad-formatter/
  docs/
    01-product-implementation-plan.md
    02-ui-ux-implementation-plan.md
    03-tech-architecture-plan.md
    04-engineering-implementation-plan.md
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
    types/
      formatter.ts
    test/
      fixtures.ts
      setup.ts
    main.tsx
    index.css
  package.json
  vite.config.ts
  tsconfig.json
  eslint.config.js
```

## 5. Implementation Phases

### Phase 1 - Project Foundation

Tasks:

- Initialize a Vite React TypeScript project.
- Add baseline scripts:
  - `dev`
  - `build`
  - `preview`
  - `test`
  - `lint`
- Configure TypeScript strictness.
- Add Vitest.
- Add ESLint and Prettier if not included by the scaffold.
- Create the source folders listed in the proposed structure.
- Keep the app static and client-side only.

Acceptance criteria:

- `npm run dev` starts the app.
- `npm run build` creates a static production bundle.
- No backend folders, API routes, server handlers, or database clients exist.

### Phase 2 - Formatter Domain Logic

Tasks:

- Implement `validateJson(input)`.
- Implement `beautifyJson(input, indentSize)`.
- Implement `minifyJson(input)`.
- Implement parser error normalization.
- Implement optional line and column extraction when a character position is available.
- Implement `getTextStats(text)`.

Expected behavior:

- Valid object JSON is accepted.
- Valid array-root JSON is accepted.
- Valid primitive JSON is accepted.
- Invalid JSON returns a safe failure object.
- Beautify respects 2-space and 4-space indentation.
- Minify returns compact JSON.
- No function mutates input.
- No function stores user text.

Acceptance criteria:

- Unit tests cover valid, invalid, empty, nested, minified, array-root, and primitive JSON cases.
- No `eval`, `Function`, or code execution approach is used.

### Phase 3 - UI Shell

Tasks:

- Build `Header` with brand wordmark and privacy chip.
- Build format tab strip below the header (showing "JSON" with active underline).
- Build `ActionToolbar` with transform buttons (Beautify, Minify, Validate) and indent segmented control.
- Build `EditorPanel` with panel header actions:
  - Input panel: `Sample` and `Clear` buttons.
  - Output panel: `Text | Tree` view toggle, `Copy` and `Download` buttons.
- Build `EmptyOutput` placeholder for when no output exists.
- Build `JsonTreeView` for tree-mode output display.
- Build `StatusMessage` as a status line anchored to the bottom of the shell.
- Build `TextStats` for panel footer stats (character count and KB).
- Compose the single-screen workspace in `App`.
- Add responsive layout:
  - Desktop (> 920px): input and output side by side.
  - Tablet (≤ 920px): input stacked above output.
  - Mobile (≤ 560px): header collapses to two rows, buttons stretch full width.

Acceptance criteria:

- The first screen is the formatter workspace, not a landing page.
- Privacy chip is visible in the header without interaction.
- Format tab strip shows "JSON" as the active tab.
- Input and output editors are visible with panel header actions.
- Empty output shows a placeholder hint.
- Toolbar actions are visible.
- Layout does not require horizontal scrolling on mobile.

### Phase 4 - Core Formatter Interactions

Tasks:

- Add app state for:
  - input
  - output
  - indent size
  - status
  - output view mode (text or tree)
- Wire Beautify action.
- Wire Minify action.
- Wire Validate action.
- Wire Sample action (loads demo JSON from `sampleJson.ts` into input).
- Wire view toggle (Text | Tree) in output panel.
- Implement `useKeyboardShortcuts` hook:
  - `Ctrl/⌘ + B` → Beautify.
  - `Ctrl/⌘ + M` → Minify.
  - `Ctrl/⌘ + L` → Validate.
  - `Esc` → Blur editor.
- Preserve input after all formatter actions.
- Preserve previous output when validation fails.
- Keep Validate from changing output.

Acceptance criteria:

- Beautify formats valid JSON into output.
- Minify compacts valid JSON into output.
- Validate updates status only.
- Invalid JSON shows an error and does not crash.
- Empty input shows `Paste JSON before running this action.`
- Indentation selector affects Beautify output.
- Sample loads demo JSON into the input editor.
- Keyboard shortcuts trigger the correct actions.
- Tree view displays parsed JSON; Text view displays raw text.
- Tree view is disabled when output is not an object or array.

### Phase 5 - Output Actions and Metadata

Tasks:

- Implement `useClipboard`.
- Implement `useDownload`.
- Wire Copy action (in output panel header).
- Wire Download action (in output panel header).
- Wire Clear action (in input panel header — clears input only).
- Add input and output character counts in panel footers.
- Add estimated byte/KB counts in panel footers.

Acceptance criteria:

- Copy is disabled when output is empty.
- Download is disabled when output is empty.
- Clear resets input and status. Output remains until the next action.
- Clear keeps selected indentation unchanged.
- Download uses `formatted.json`.
- Download is generated with Blob API in the browser.
- Copy failure is handled with a useful status message.
- Stats update in real time as input changes and after actions produce output.

### Phase 6 - Styling, Responsive Behavior, and Accessibility

Tasks:

- Apply the visual direction from the UI/UX plan:
  - clean
  - technical
  - calm
  - trustworthy
  - compact
- Use monospace font for editors.
- Use clear success and error styling.
- Add visible focus states.
- Ensure text areas have labels.
- Ensure status feedback is accessible.
- Ensure buttons have clear labels and disabled states.
- Test desktop, tablet, and mobile widths.

Acceptance criteria:

- Buttons are keyboard accessible.
- Error state is communicated with text, not only color.
- Editors remain usable with long text.
- Toolbar wraps cleanly on smaller screens.
- No content overlap in supported viewport sizes.

### Phase 7 - Verification and Release Readiness

Tasks:

- Run unit tests.
- Run build.
- Run manual browser smoke tests.
- Verify no user text is stored in browser storage.
- Verify no network request includes user text.
- Verify no backend API exists.
- Verify copy, download, clear, beautify, minify, and validate flows.
- Verify mobile layout.

Acceptance criteria:

- `npm run test` passes.
- `npm run build` passes.
- Primary manual flows pass.
- Privacy checks pass.
- The app can be deployed as static assets from `dist/`.

## 6. Component Implementation Details

### 6.1 `App`

Responsibilities:

- Own workspace state.
- Compose the 4-row shell grid (header, action bar, workspace, status line).
- Register keyboard shortcuts via `useKeyboardShortcuts`.
- Pass action handlers to toolbar and panel headers.
- Pass input and output values to editor panels.
- Pass current status to status message.
- Calculate text stats.

State:

```ts
type OutputView = 'text' | 'tree';

type FormatterState = {
  input: string;
  output: string;
  indentSize: 2 | 4;
  status: FormatterStatus;
  outputView: OutputView;
};
```

### 6.2 `Header`

Responsibilities:

- Render brand wordmark: "**Bad**" in accent orange, "Formatter" in primary text.
- Render privacy chip on the right: shield icon + "Browser-only · No upload".
- Render format tab strip below the header row with "JSON" as the active tab.

Rules:

- Privacy chip is informational only, not interactive.
- Format tab strip is structural. Additional format tabs will appear here in Phase 3.

### 6.3 `ActionToolbar`

Props:

- `indentSize`
- `onBeautify`
- `onMinify`
- `onValidate`
- `onIndentSizeChange`

Rules:

- Contains only transform actions (Beautify, Minify, Validate) and the indent segmented control.
- Copy, Download, and Clear live in their respective panel headers, not in this toolbar.
- Beautify, Minify, and Validate are always clickable. If input is empty, an info status is shown.
- Each button displays its keyboard shortcut hint (e.g., `Beautify ⌘B`).
- The indent segmented control shows `2` and `4` with accent fill on the active value.

### 6.4 `EditorPanel`

Props:

- `id`
- `label`
- `value`
- `placeholder`
- `readOnly`
- `onChange`
- `stats`
- `actions` (panel header actions — Sample/Clear for input, Copy/Download for output)
- `viewToggle` (optional — Text/Tree toggle for output panel)

Rules:

- Input editor is writable.
- Output editor is read-only for MVP.
- Use plain text rendering through textarea or equivalent safe editor.
- Do not render user text as HTML.
- Panel header: label on the left, actions on the right.
- Panel footer: stats in muted text (e.g., `1,240 chars · 1.21 KB`).

### 6.5 `EmptyOutput`

Responsibilities:

- Display a centered hint when no output exists.
- Copy: `Run an action to see formatted output here.`

### 6.6 `JsonTreeView`

Responsibilities:

- Render parsed JSON as a collapsible tree.
- Color rules: object keys in accent-soft, strings in emerald, numbers in amber, booleans in violet, null in muted text.

Rules:

- Enabled only when output is a valid JSON object or array.
- Switching between Text and Tree does not modify the output value.

### 6.7 `StatusMessage`

Props:

- `status`

Rules:

- Use semantic text for ready, success, info, and error.
- Use an ARIA live region (`aria-live="polite"`) for status updates.
- Anchored to the bottom of the app shell as a single slim row.
- Always present at the same height to prevent layout jumps.
- States: `ready` (muted), `info` (indigo), `success` (emerald), `error` (red).
- Success messages include an optional timing tail (e.g., `· beautified in 3 ms`).

## 7. Domain Implementation Details

### 7.1 Formatter Types

```ts
export type IndentSize = 2 | 4;

export type JsonFormatSuccess = {
  ok: true;
  value: unknown;
  output?: string;
};

export type JsonFormatFailure = {
  ok: false;
  error: string;
  position?: number;
  line?: number;
  column?: number;
};

export type JsonFormatResult = JsonFormatSuccess | JsonFormatFailure;
```

### 7.2 Function Contracts

```ts
export function validateJson(input: string): JsonFormatResult;
export function beautifyJson(input: string, indentSize: IndentSize): JsonFormatResult;
export function minifyJson(input: string): JsonFormatResult;
export function getTextStats(text: string): TextStats;
```

### 7.3 Sample JSON

`sampleJson.ts` exports a small, realistic demo JSON string. Used by the Sample button to populate the input editor so first-time users can try the tool without finding their own input.

### 7.4 Error Normalization

Implementation should:

- Preserve the native parser message where possible.
- Detect character position from common parser messages where possible.
- Convert character position to line and column when available.
- Avoid including large user input excerpts in status messages.

## 8. Privacy Implementation Rules

Hard rules:

- Do not add a database.
- Do not add backend formatting APIs.
- Do not send input or output over the network.
- Do not store input or output in localStorage, sessionStorage, IndexedDB, cookies, or URL query params.
- Do not add autosave.
- Do not add history.
- Do not log user input or output to console in production code.
- Do not send parser errors to analytics.

Allowed:

- Keep input and output in React memory state during the active page session.
- Generate downloads locally with Blob API.
- Copy output with Clipboard API.

## 9. Testing Plan

### 9.1 Unit Tests

Focus on `domain/`:

- `validateJson` accepts valid object JSON.
- `validateJson` accepts valid array JSON.
- `validateJson` accepts valid primitive JSON.
- `validateJson` rejects invalid JSON.
- `beautifyJson` uses 2-space indentation.
- `beautifyJson` uses 4-space indentation.
- `beautifyJson` rejects invalid JSON.
- `minifyJson` compacts valid JSON.
- `minifyJson` rejects invalid JSON.
- `getTextStats` returns expected character and byte counts.

### 9.2 UI Tests

Focus on component behavior:

- Initial state shows privacy chip, format tab, and empty editors.
- Empty output shows the `EmptyOutput` placeholder.
- Typing input updates character count.
- Beautify updates output and status.
- Minify updates output and status.
- Validate updates status and leaves output unchanged.
- Invalid JSON shows an error.
- Invalid JSON preserves previous output.
- Sample loads demo JSON into input.
- Clear resets input and status.
- Copy and Download are disabled without output.
- Tree view toggle switches between text and tree display.
- Keyboard shortcuts (Ctrl/⌘ + B, M, L) trigger the correct actions.

### 9.3 End-to-End Smoke Tests

Manual or automated:

- Valid JSON beautify flow.
- Valid JSON minify flow.
- Invalid JSON validation flow.
- Sample → Beautify → Copy flow.
- Copy output flow.
- Download output flow.
- Clear flow.
- Tree view toggle flow.
- Keyboard shortcut flow.
- Mobile viewport layout check.

### 9.4 Privacy Verification

Manual checklist:

- Open DevTools Network tab and run all formatter actions.
- Confirm no request contains pasted JSON.
- Check localStorage, sessionStorage, IndexedDB, cookies.
- Confirm user input and output are not persisted after reload.
- Confirm source code has no backend formatter endpoint.

## 10. Build and Deployment Plan

### 10.1 Local Development

Commands:

```text
npm install
npm run dev
```

### 10.2 Verification Commands

Commands:

```text
npm run lint
npm run test
npm run build
```

### 10.3 Static Deployment

Build output:

```text
dist/
```

Deployment target:

- Static hosting, preferably Vercel for preview deployments.

No environment variables are required for MVP.

## 11. Engineering Backlog

### Must Have

- Initialize React TypeScript Vite app.
- Implement JSON formatter domain functions.
- Add unit tests for domain functions.
- Build one-screen JSON Formatter Workspace.
- Add input and output editors with panel header actions.
- Add Beautify, Minify, and Validate actions.
- Add indentation segmented control.
- Add status line at the bottom of the shell.
- Add Copy, Download, and Clear actions.
- Add text stats in panel footers.
- Add privacy chip in header.
- Add format tab strip showing "JSON".
- Add Sample button to load demo JSON.
- Add keyboard shortcuts (⌘/Ctrl + B, M, L).
- Add output view toggle (Text | Tree).
- Add `JsonTreeView` component.
- Add `EmptyOutput` placeholder.
- Add responsive layout (desktop, tablet, mobile breakpoints).
- Add accessibility labels, focus states, and ARIA live region.
- Run build and tests.

### Should Have

- Line and column extraction for parser errors when possible.
- Large input warning around 1 MB.
- Playwright smoke tests for primary flows.
- Production security headers documentation for deployment.
- Keyboard shortcut hints displayed on action buttons.

### Won't Have in MVP

- Backend API.
- Database.
- Login.
- Saved history.
- Autosave.
- File upload.
- Schema validation.
- Multi-format switcher (beyond the visual JSON tab).
- Analytics.
- AI features.
- Light theme or theme toggle.

## 12. Risk Management

| Risk | Engineering Response |
| --- | --- |
| User text accidentally persisted | Avoid browser storage entirely and add privacy verification |
| User text accidentally sent over network | No backend API and no analytics in MVP |
| Browser parser messages differ | Normalize gracefully and fall back to native message |
| Large JSON freezes UI | Add soft warning first; consider Web Worker later |
| UI becomes too decorative | Keep the formatter workspace as the first screen |
| Scope expands beyond JSON | Keep multi-format architecture as future-facing only |

## 13. Pull Request Checklist

Before merging implementation work:

- Product scope remains JSON-only.
- No backend or database was added.
- No storage of input or output was added.
- No analytics were added.
- Domain logic has unit tests.
- UI handles empty, success, and invalid states.
- Copy, download, and clear work.
- Desktop and mobile layouts were checked.
- `npm run build` passes.
- Privacy notice is visible.

## 14. MVP Engineering Definition of Done

Engineering implementation is complete when:

- The app is a React TypeScript Vite static client-side app.
- The formatter workspace is the first screen.
- Header shows the brand wordmark and privacy chip.
- Format tab strip shows "JSON" as the active tab.
- User can paste JSON into the input editor.
- User can validate JSON.
- User can beautify JSON with 2-space or 4-space indentation.
- User can minify JSON.
- User can load sample JSON.
- User can copy output.
- User can download output as `formatted.json`.
- User can clear input.
- User can toggle output between Text and Tree views.
- Keyboard shortcuts (⌘/Ctrl + B, M, L) work.
- Input and output character counts and KB estimates are visible in panel footers.
- Empty output shows a placeholder hint.
- Invalid JSON shows a clear error and does not crash.
- No user text is stored or transmitted.
- Tests and production build pass.
- The app is ready for static deployment.
