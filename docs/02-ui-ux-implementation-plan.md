# Bad Formatter - UI/UX Implementation Plan

## 1. Purpose

This document defines the user experience for the Bad Formatter MVP. It is the single source of truth for layout, visual design, interaction behavior, component states, and user journeys for the JSON formatter screen.

It is derived from `/docs/01-product-implementation-plan.md` and should be updated when any design decision changes.

## 2. UX Goals

- Make the workflow obvious at a glance: paste → transform → use result.
- Keep the interface compact and efficient for repeated technical work.
- Reinforce privacy quietly, without alarm or friction.
- Give validation feedback immediately, in the same field of view as the action.
- Never destroy input unless the user explicitly clears it.
- Work comfortably from 360px mobile up through ultrawide desktops.
- Reward power users with keyboard shortcuts; reward first-time users with a Sample.

## 3. Design Principles

1. **Tool-first.** The formatter is the entire screen. No marketing, no onboarding modal.
2. **Low friction.** No login, no settings page, no setup. Open it, use it.
3. **Trust as a quiet property.** Privacy is communicated as a header chip, not a banner. The product *behaves* privately; the copy just confirms it.
4. **Personality, not noise.** "Bad Formatter" is a slightly playful name; the orange accent and "Bad" wordmark carry the brand. The rest of the UI stays restrained so the data is what stands out.
5. **Action hierarchy is unambiguous.** Transforms (Beautify, Minify, Validate) live in one place. Output actions (Copy, Download) live with the output. Input actions (Sample, Clear) live with the input.
6. **Stats are calm.** Character counts and KB sit in the panel *footer*, not the panel header — they're informational, not actionable.
7. **The status line knows when to speak.** Idle = ready prompt; after an action = result + timing. It never blocks the layout.

## 4. Visual Design System

### 4.1 Color Tokens

Dark theme only for MVP. Tokens are CSS variables in `src/index.css`.

| Role | Value | Usage |
| --- | --- | --- |
| Accent | `#f97316` (orange-500) | Primary buttons, brand mark, focus rings, active tab underline |
| Accent-soft | `#fb923c` (orange-400) | Tree keys, hover glow |
| Background | `#0a0812` | Page background |
| Surface | `#100e1a` | Panels |
| Surface-2 | `#171426` | Panel header / footer, command bar |
| Surface-3 | `#1e1b30` | Buttons (default), segmented track |
| Border | `#262236` | Panel border |
| Border-mid | `#322d48` | Dividers |
| Text-1 | `#f3f1fc` | Primary text |
| Text-2 | `#7a7499` | Secondary text |
| Text-3 | `#46415e` | Muted text, stats, line numbers |
| Editor-bg | `#08060d` | Editor surface |
| Success | `#34d399` | Valid JSON state |
| Error | `#f87171` | Invalid JSON state |
| Info | `#818cf8` | Informational messages |

### 4.2 Typography

- Interface font: Inter, system-ui fallback.
- Editor font: `ui-monospace`, `SFMono-Regular`, Consolas, "Liberation Mono", Menlo, monospace.
- Brand title: `1.5rem`, weight `800`, letter-spacing `-0.02em`.
- Format tab: `0.78rem`, weight `700`, uppercase, letter-spacing `0.08em`.
- Action button label: `0.875rem`, weight `600` (default) / `700` (primary).
- Panel header label: `0.72rem`, weight `700`, uppercase, letter-spacing `0.12em`.
- In-panel action: `0.78rem`, weight `600`.
- Stats: `0.75rem`, tabular-nums, muted.
- Editor body: `0.875rem`, line-height `1.7`.
- Status line: `0.85rem`, tabular-nums for timing.

### 4.3 Geometry

| Element | Value |
| --- | --- |
| Page max-width | `1480px`, centered |
| Page padding (desktop) | `24px 28px` |
| Page padding (mobile ≤ 560px) | `14px 14px` |
| Panel radius | `12px` |
| Button radius | `8px` |
| Pill / chip radius | `999px` |
| Segmented track radius | `8px` |
| Workspace gap | `14px` |
| Vertical rhythm gap | `12px` between shell rows |

### 4.4 Interaction States

- Hover: surface lightens by ~6% or accent gains soft glow.
- Focus visible: `box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.28)`. Never the browser's default outline.
- Active (press): `transform: translateY(1px)`.
- Disabled: `opacity: 0.32`, `cursor: not-allowed`. Tooltip-style hint not required for MVP.
- Subtle transitions only: `130ms ease` for color/background, `90ms ease` for transform.

## 5. Layout

### 5.1 Shell Grid

The app shell is a 4-row CSS grid. The workspace is the only flexible row.

```
grid-template-rows: auto auto minmax(0, 1fr) auto

row 1 → header
row 2 → primary action bar
row 3 → workspace (input panel | output panel)
row 4 → status line
```

### 5.2 Desktop Layout (> 920px)

```
┌────────────────────────────────────────────────────────────────────────────┐
│ Bad Formatter                                  🛡  Browser-only · No upload │ ← header
│  ─── JSON ───                                                              │ ← format tab strip
├────────────────────────────────────────────────────────────────────────────┤
│ [ Beautify ⌘B ]  [ Minify ⌘M ]  [ Validate ⌘L ]      Indent  ◉2  ○4         │ ← primary actions
├────────────────────────────────────────┬────────────────────────────────────┤
│ INPUT              ✨ Sample · ⌫ Clear │ OUTPUT  [Text|Tree]   ⎘ Copy · ↓ │
│                                        │                                    │
│   (editor)                             │   (editor or tree)                 │
│                                        │                                    │
│ 1,240 chars · 1.21 KB                  │ 1,982 chars · 1.94 KB              │ ← panel footers
├────────────────────────────────────────┴────────────────────────────────────┤
│ ✓ Valid JSON · beautified in 3 ms                                           │ ← status
└────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Mobile Layout (≤ 920px)

- Header collapses: brand row above, privacy chip below.
- Format tab stays directly below the header.
- Primary action bar wraps; transforms become a row of 3, indent below.
- Workspace stacks: input above, output below.
- Status stays anchored at the bottom of the shell.

### 5.4 Layout Rules

- Workspace fills all remaining vertical space (`min-height: 0` discipline on every grid descendant).
- Editors never cause layout shift when status changes.
- Panels are equal-width on desktop (`1fr 1fr`).
- The page has a max-width of `1480px`, horizontally centered.
- The shell never scrolls itself; only editors scroll internally.

## 6. Components

### 6.1 Header

- **Left:** Wordmark — "**Bad**" in accent orange, "Formatter" in primary text. Compact.
- **Right:** Privacy chip — small, pill-shaped, with shield icon and "Browser-only · No upload". Muted by default; subtle accent border.
- **Below the header row:** Format tab strip. Currently a single tab "JSON" with an orange underline. The tab strip is structural — when additional formats arrive (Phase 3), they appear here as siblings.
- Behavior: informational only; no nav, no menu.

### 6.2 Primary Action Bar

A horizontal strip with two groups, divided by a thin vertical rule:

1. **Transforms (left):** Beautify, Minify, Validate. All three are filled accent-orange buttons of equal weight. Each shows its keyboard shortcut as a subtle badge on hover (or always on desktop if space allows).
2. **Indent (right):** Segmented control showing `2` and `4`. Active value uses the accent fill.

Behavior:
- Transforms are always clickable; if input is empty, an info status is shown rather than blocking the click.
- The bar wraps cleanly on narrow screens; transforms get full width, indent moves below.

### 6.3 Workspace — Input Panel

- **Header (Surface-2 strip):**
  - Left: label `INPUT` (uppercase tracked).
  - Right: in-panel actions — `Sample` (loads demo JSON) and `Clear` (clears input only). Both are ghost buttons with icon + label.
- **Body:** Full-height editable textarea. Orange caret. Placeholder: `Paste or type your JSON here…`.
- **Footer:** Stats — `1,240 chars · 1.21 KB`, muted, tabular-nums.

### 6.4 Workspace — Output Panel

- **Header (Surface-2 strip):**
  - Left: label `OUTPUT` + view toggle `[Text | Tree]`. Tree is disabled when output is not an object/array.
  - Right: in-panel actions — `Copy`, `Download`. Both are ghost buttons; disabled when output is empty.
- **Body:** Read-only textarea, or `JsonTreeView` component when Tree is selected.
- **Empty state:** When no output exists, show a centered hint icon and copy: `Run an action to see formatted output here.`
- **Footer:** Stats — same format as input.

### 6.5 Status Line (bottom of shell)

A single, slim row anchored to the bottom of the app shell. Not a card. It contains:

- Status icon (Lucide).
- Status message.
- Optional timing tail (`· beautified in 3 ms`) on success.

States:
- `ready` — muted text.
- `info` — indigo text.
- `success` — emerald text.
- `error` — red text.

The line is always present at the same height to prevent layout jumps. `aria-live="polite"`.

### 6.6 JSON Tree View

Unchanged in structure from MVP, restyled to match the new tokens.

Color rules:
- Object keys: accent-soft (`#fb923c`).
- String values: emerald.
- Numbers: amber.
- Booleans: violet.
- null: muted text.

### 6.7 Privacy Chip

Lives in the header, right side. Pill-shaped, small. `Shield` icon + `Browser-only · No upload`. Muted text, subtle accent border at low opacity. Not interactive; not a link.

## 7. Interaction Model

### 7.1 Beautify (⌘B / Ctrl+B)

1. Empty input → info status: `Paste JSON before running this action.`
2. Valid input → format with selected indent → write to output → success status: `Valid JSON. · beautified in {n} ms`.
3. Invalid input → error status with parser message → output is not modified.

### 7.2 Minify (⌘M / Ctrl+M)

Same rules as Beautify; produces compact output. Status tail reads `minified in {n} ms`.

### 7.3 Validate (⌘L / Ctrl+L)

1. Empty input → info status.
2. Valid input → success status: `Valid JSON. · validated in {n} ms`. Output is **not** modified.
3. Invalid input → error status. Output is not modified.

### 7.4 Sample

Loads a small, realistic demo JSON into the input. Replaces existing input. Resets status to ready. Has no privacy implications — nothing leaves the browser.

### 7.5 Copy

- Disabled when output is empty.
- On success: status `Output copied.`
- On failure: status `Could not copy output. Try selecting it manually.`

### 7.6 Download

- Disabled when output is empty.
- Creates a Blob in the browser, downloads as `formatted.json`.
- On success: status `Download started.`

### 7.7 Clear

The header `Clear` in the **input panel** clears only the input.
The status `Clear` resets ready state if no other action is appropriate.

If the user wants a hard reset, clearing input followed by no further action leaves output stale — this is intentional. The only way to reset both is via Beautify/Minify on empty input or by clearing input then running an action. (For MVP we do not provide a "clear all" — the input-only Clear is the discoverable option.)

### 7.8 View Toggle (Output panel)

`Text` is always available. `Tree` is enabled only when output is a valid JSON object or array. Switching does not modify output.

### 7.9 Keyboard Shortcuts

| Key | Action | Notes |
| --- | --- | --- |
| ⌘/Ctrl + B | Beautify | Works from anywhere except when typing in a non-input element |
| ⌘/Ctrl + M | Minify |  |
| ⌘/Ctrl + L | Validate | Overrides browser address bar focus only when input is focused |
| Esc | Blur the editor |  |

Shortcut hints appear inline on the primary action buttons (e.g., `Beautify ⌘B`). The platform key (⌘ vs Ctrl) is detected at runtime.

## 8. Responsive Rules

### Desktop (> 920px)
- Editors side by side, equal width.
- Primary action bar fits in one row.
- Privacy chip on the right of the header.

### Tablet / Narrow Desktop (≤ 920px)
- Editors stack vertically.
- Action bar wraps; transforms first, then indent.
- Editor min-height drops from 420px to 280px.

### Mobile (≤ 560px)
- Header switches to two rows (brand above, privacy chip below).
- Buttons stretch to fill row width where appropriate.
- Status line allows wrap to two lines if needed.
- Format tab strip remains visible.

## 9. Accessibility

- Every interactive element is keyboard-accessible and has a visible text label.
- Status region uses `aria-live="polite"`.
- Focus is always visible — orange ring, never the browser default.
- Disabled state communicates via both `disabled` attribute and reduced opacity, never color alone.
- Editors have explicit `<label>` associations.
- Color is never the sole signal: every state pairs an icon with text.
- Sample button announces "Sample JSON loaded" via the status region when activated.

## 10. State Matrix

| State | Input | Output | Status |
| --- | --- | --- | --- |
| Initial | empty | empty | `Ready. Paste JSON or load a sample.` |
| Sample loaded | demo JSON | empty | `Sample loaded. Try Beautify or Validate.` |
| After Beautify (valid) | unchanged | formatted | `Valid JSON. · beautified in {n} ms` |
| After Beautify (invalid) | unchanged | unchanged | `Invalid JSON: {parser message}` |
| After Minify (valid) | unchanged | minified | `Valid JSON. · minified in {n} ms` |
| After Validate (valid) | unchanged | unchanged | `Valid JSON. · validated in {n} ms` |
| After Validate (invalid) | unchanged | unchanged | `Invalid JSON: {parser message}` |
| After Copy | unchanged | unchanged | `Output copied.` |
| After Download | unchanged | unchanged | `Download started.` |
| After Clear (input) | empty | unchanged | `Input cleared.` |

## 11. Content Guidelines

- Product name: **Bad Formatter** (always two words, capitalised).
- Privacy chip: `Browser-only · No upload` (terse, factual).
- Action labels: Beautify, Minify, Validate, Copy, Download, Clear, Sample (consistent capitalisation).
- Errors: `Invalid JSON: {parser message}` — concise, technical, no jargon.
- Successes: `Valid JSON.` followed by an optional timing tail.
- Empty output state: `Run an action to see formatted output here.`
- Initial status: `Ready. Paste JSON or load a sample.`

## 12. Out of Scope for MVP

- Light theme / theme toggle (dark only).
- File upload / drag-and-drop.
- Formatter type switcher beyond the visual JSON tab.
- Login or saved history.
- In-editor syntax highlighting / line numbers (Phase 2).
- Anonymous analytics (allowed by product plan, deferred to Phase 2).
- Backend services.
