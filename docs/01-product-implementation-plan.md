# Bad Formatter - Product Implementation Plan

## 1. Product Summary

**Bad Formatter** is a website for formatting, validating, beautifying, minifying, and managing structured text quickly and safely. The product is designed for developers, QA engineers, technical writers, data analysts, and other technical users who regularly work with structured text.

The initial MVP focuses on a **JSON Formatter**, with these core principles:

- Fast to use without login.
- All processing happens in the user's browser.
- User data is not stored, uploaded, logged, or read by a server.
- The interface is simple, clear, and efficient for repeated daily use.

## 2. Problem Statement

Users often receive JSON that is hard to read, overly compact, malformed, or difficult to inspect. They need a fast tool to:

- Check whether JSON is valid.
- See clear error messages.
- Convert minified JSON into readable JSON.
- Convert readable JSON into minified JSON.
- Copy or download the result.
- Do all of this without worrying that sensitive data is being stored by a third-party service.

Many online formatter tools do not clearly explain how user data is handled. Users may hesitate to paste API payloads, internal data, tokens, logs, or configuration files because they do not know whether the data is sent to a server.

## 3. Product Vision

Become a fast, private, and trusted text formatter for everyday technical work.

Bad Formatter should feel like a dependable utility: open it, paste text, format it, done.

## 4. Target Users

### Primary Users

- **Software Developers**
  - Format API responses, request payloads, configuration files, logs, and mock data.

- **QA Engineers**
  - Validate payloads from APIs, automation results, or test fixtures.

- **Data Analysts / Data Engineers**
  - Read and clean up JSON from exports, APIs, or event streams.

### Secondary Users

- Technical writers.
- Technical product managers.
- Support engineers.
- Students or users learning JSON.

## 5. Value Proposition

Bad Formatter helps users process JSON quickly and safely in the browser, without login, uploads, or storage.

## 6. Product Principles

1. **Privacy-first**
   - User data must not be stored.
   - User data must not be sent to a server for formatting.
   - The product must clearly explain this privacy model.

2. **Fast by default**
   - The page should load quickly.
   - Formatting should feel instant for typical JSON payload sizes.

3. **Useful before beautiful**
   - The UI should be clean, but the primary goal is a clear and fast workflow.

4. **No account required**
   - Users should not need to sign up, log in, or create a workspace.

5. **Clear error feedback**
   - If JSON is invalid, users should understand where and why parsing failed.

## 7. MVP Scope

The MVP only includes a formatter for **JSON**.

### In Scope

- Manual JSON input through a text editor.
- Beautify JSON.
- Minify JSON.
- Validate JSON.
- Display JSON errors.
- Copy output.
- Download output as a `.json` file.
- Clear input.
- Toggle indentation size.
- Display basic text size information.
- Clear privacy notice.
- Client-side processing only.
- **Load a sample JSON** so first-time users can try the tool without finding their own input.
- **Keyboard shortcuts** for the three transform actions (Beautify, Minify, Validate).
- **Format tab strip** showing the current format (JSON), structurally ready to host additional formats from Phase 3.

### Out of Scope for MVP

- Login or user accounts.
- Saved history.
- Cloud sync.
- Collaboration.
- Formatters for XML, YAML, SQL, HTML, CSS, JavaScript, or Markdown.
- Large file uploads.
- Schema validation.
- Formatting API endpoint.
- AI-based formatting.

## 8. MVP Features

### 8.1 JSON Beautify

Users can paste minified or messy JSON and convert it into readable, indented JSON.

**Acceptance Criteria**

- The system accepts valid JSON input.
- The output is displayed with clean indentation.
- Users can choose 2-space or 4-space indentation.
- If the JSON is invalid, the system does not produce misleading output and shows an error instead.

### 8.2 JSON Minify

Users can convert JSON into a compact version without unnecessary whitespace.

**Acceptance Criteria**

- The system accepts valid JSON input.
- The output is compact JSON.
- The data structure remains unchanged.
- If the JSON is invalid, the system shows an error.

### 8.3 JSON Validate

Users can check whether JSON is valid.

**Acceptance Criteria**

- If valid, the system displays a success status.
- If invalid, the system displays an error message.
- The error message explains the parsing failure as clearly as possible.
- When possible, the error indicates line and column.

### 8.4 Copy Output

Users can copy formatted or minified output to the clipboard.

**Acceptance Criteria**

- The copy button is enabled when output is available.
- After a successful copy, the system gives brief feedback.
- If copying fails, the system shows a simple error message.

### 8.5 Download Output

Users can download the result as a `.json` file.

**Acceptance Criteria**

- The default filename is `formatted.json`.
- The downloaded file content matches the current output.
- The download is generated in the browser without uploading data to a server.

### 8.6 Clear

Users can clear input and output.

**Acceptance Criteria**

- The clear action removes input, output, and validation status.
- No text remains visible in the UI after clearing.

### 8.7 Data Size Info

The system displays simple information such as character count or text size.

**Acceptance Criteria**

- Show input character count.
- Show output character count when output exists.
- Optionally show estimated size in KB.

### 8.8 Privacy Notice

The product must show a clear privacy message.

Example copy:

> Your data stays in your browser. Bad Formatter does not upload, store, or log your text.

**Acceptance Criteria**

- The privacy message is visible on the main page.
- The language is direct and unambiguous.
- The copy matches the technical implementation.

## 9. MVP User Flows

### Flow 1: Beautify JSON

1. The user opens the website.
2. The user pastes JSON into the input editor.
3. The user clicks **Beautify**.
4. The system validates the JSON.
5. If valid, the system displays formatted JSON in the output editor.
6. The user can copy or download the result.

### Flow 2: Validate JSON

1. The user pastes JSON.
2. The user clicks **Validate**.
3. The system parses JSON in the browser.
4. The system displays a valid status or an error message.

### Flow 3: Minify JSON

1. The user pastes JSON.
2. The user clicks **Minify**.
3. The system validates the JSON.
4. If valid, the system displays compact output.
5. The user can copy or download the result.

## 10. Page Structure

### Main Page

Core components:

- Simple header with product name.
- Privacy notice.
- Action toolbar:
  - Beautify
  - Minify
  - Validate
  - Copy
  - Download
  - Clear
- Indentation setting:
  - 2 spaces
  - 4 spaces
- Input editor.
- Output editor.
- Validation or error status.
- Text size information.

### Recommended Layout

Desktop:

- Two side-by-side panels:
  - Input on the left.
  - Output on the right.

Mobile:

- Stacked panels:
  - Input on top.
  - Output below.

## 11. UX Requirements

- The editor must support long text.
- Primary actions must be easy to find.
- Errors must be visible and understandable.
- Output must not automatically replace input unless the user chooses an explicit action.
- Copywriting should be concise and technical.
- No lengthy onboarding is needed.

## 12. Privacy Requirements

### Required

- Formatting, validation, minifying, and beautifying must happen in the browser.
- No API request may include user input or output.
- No database may store user input or output.
- No automatic history.
- No localStorage autosave for MVP.
- No analytics may capture user text.

### Allowed

- Anonymous analytics for general events, if introduced in the future.
- Example allowed events:
  - `beautify_clicked`
  - `minify_clicked`
  - `validate_clicked`
  - `download_clicked`

### Not Allowed

- Sending JSON content to analytics.
- Storing JSON content on a server.
- Storing JSON content in the browser without explicit user consent.
- Using user data to train AI models.

## 13. Functional Requirements

| ID | Requirement | Priority |
| --- | --- | --- |
| FR-001 | User can enter JSON in the input editor | Must |
| FR-002 | User can beautify valid JSON | Must |
| FR-003 | User can minify valid JSON | Must |
| FR-004 | User can validate JSON | Must |
| FR-005 | System displays errors for invalid JSON | Must |
| FR-006 | User can copy output | Must |
| FR-007 | User can download output as `.json` | Must |
| FR-008 | User can clear input and output | Must |
| FR-009 | User can choose 2-space or 4-space indentation | Should |
| FR-010 | System displays input and output character counts | Should |
| FR-011 | Website displays a privacy notice | Must |
| FR-012 | User can load a sample JSON into the input editor | Should |
| FR-013 | Keyboard shortcuts trigger Beautify, Minify, and Validate | Should |
| FR-014 | The current format (JSON) is shown as a tab in a format strip | Should |

## 14. Non-Functional Requirements

| Category | Requirement |
| --- | --- |
| Performance | Formatting small to medium JSON should feel instant |
| Privacy | User text must not be sent to a server |
| Accessibility | Buttons are keyboard-accessible and clearly labeled |
| Responsiveness | Layout works comfortably on desktop and mobile |
| Reliability | Invalid JSON must not crash the application |
| Security | The application must not evaluate user input as code |
| Compatibility | Supports modern browsers such as Chrome, Edge, Firefox, and Safari |

## 15. Technical Direction

Initial recommendation:

- Build as a static website or fully client-side app.
- Parse using `JSON.parse`.
- Beautify using `JSON.stringify(parsed, null, indentSize)`.
- Minify using `JSON.stringify(parsed)`.
- Download using the browser Blob API.
- Copy using the Clipboard API.
- No backend is required for MVP.

### Important Note

JSON input must be treated as data, not code. Do not use `eval`.

## 16. Error Handling

If JSON is invalid, show:

- Status: `Invalid JSON`.
- Parser error message.
- Line and column when possible.

Example:

```text
Invalid JSON: Unexpected token } at line 4, column 12
```

If the browser only provides a character position, the system may convert that position into line and column.

## 17. Implementation Phases

### Phase 1 - Project Setup

- Choose the frontend stack.
- Set up the project structure.
- Create the main page.
- Ensure the app can run as a static or client-side application.

### Phase 2 - JSON Core Tools

- Implement JSON validation.
- Implement beautify.
- Implement minify.
- Implement error handling.
- Add indentation settings.

### Phase 3 - Output Actions

- Implement copy output.
- Implement download output.
- Implement clear.
- Add text size information.

### Phase 4 - UX, Privacy, and QA

- Add the privacy notice.
- Ensure no input or output is stored.
- Test desktop and mobile layouts.
- Test valid JSON, invalid JSON, empty input, minified JSON, nested JSON, and array-root JSON.

## 18. Success Metrics

For MVP, success can be measured through:

- Beautify usage count.
- Minify usage count.
- Validate usage count.
- Copy and download click counts.
- Application error rate.
- Average formatting time.

Important: metrics must never store user JSON content.

## 19. Risks and Mitigations

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Users are unsure about privacy | Low adoption | Clearly state that processing happens in the browser |
| Large JSON makes the browser slow | Poor UX | Add an initial size limit and warning message |
| Parser errors are unclear | User confusion | Convert character positions to line and column when possible |
| Users request formats beyond JSON | Scope creep | Keep additional formats in the roadmap after MVP stability |

## 20. Roadmap

### Phase 1 - MVP JSON

- JSON beautify.
- JSON minify.
- JSON validate.
- Copy output.
- Download output.
- Clear.
- Privacy notice.

### Phase 2 - Better JSON Experience

- Syntax highlighting.
- Line numbers.
- Error highlighting in the editor.
- JSON file upload.
- Sort object keys.
- Escape and unescape JSON strings.
- JSON tree viewer.

### Phase 3 - More Formatters

- XML formatter.
- YAML formatter.
- SQL formatter.
- HTML formatter.
- CSS formatter.
- JavaScript formatter.
- Markdown formatter.

### Phase 4 - Power Tools

- Compare two JSON texts.
- JSON path explorer.
- JSON schema validation.
- Transform JSON to TypeScript types.
- Convert JSON to CSV.

## 21. Positioning

Bad Formatter is not just another online formatter. It is positioned as:

> A privacy-first text formatter for developers and technical teams.

Brand tone:

- Simple.
- Honest.
- Fast.
- Slightly playful.
- Trustworthy.

## 22. Open Questions

- Should the name "Bad Formatter" stay playful because it fixes "bad" input, or should the product use a more serious name?
- Should syntax highlighting be included in MVP?
- Should file upload be part of MVP or Phase 2?
- Will the product remain fully static, or will it eventually need a backend for future features?
- Should dark mode be included in MVP?

## 23. MVP Definition of Done

MVP is complete when:

- User can paste JSON.
- User can beautify valid JSON.
- User can minify valid JSON.
- User can validate JSON.
- User can see errors for invalid JSON.
- User can copy the result.
- User can download the result.
- User can clear data.
- All processing happens in the browser.
- No input or output is stored.
- The privacy notice is clearly visible.
- The UI works comfortably on desktop and mobile.
