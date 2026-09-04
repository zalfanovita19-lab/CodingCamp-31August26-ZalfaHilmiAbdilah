# Design Plan — To-Do List Life Dashboard

## Overview

The To-Do List Life Dashboard is a **single-page, client-side-only** web application with
no build step, no backend, and no external dependencies. It combines a real-time greeting,
a Pomodoro-style focus timer, a persistent to-do list, and a quick-links launcher — all
stored locally in the browser via the Local Storage API.

The page is opened directly in a browser or served statically via GitHub Pages.
All logic lives in exactly three files:

```
index.html        → page structure and widget markup only; no inline JavaScript
css/style.css     → all visual styling, themes, and layout
js/script.js      → all application logic and Local Storage interaction
```

**No inline JavaScript is permitted in `index.html`** — no `<script>` tags with code content,
and no event-handler HTML attributes (e.g., `onclick`, `onchange`). All behavior is wired
from `js/script.js`.

### Page Layout

The page uses a **CSS Grid** layout to arrange widgets in a dashboard pattern.
On wide screens, widgets sit in a two-column grid. On narrow screens (< 768 px),
the grid collapses to a single column for full mobile readability.

```
┌──────────────────────────────────────────────┐
│  [🌙 Dark Mode Toggle]              (top bar) │
├───────────────────┬──────────────────────────┤
│                   │                          │
│   Greeting        │   Focus Timer            │
│   (FR-1)          │   (FR-2)                 │
│                   │                          │
├───────────────────┼──────────────────────────┤
│                   │                          │
│   To-Do List      │   Quick Links            │
│   (FR-3)          │   (FR-4)                 │
│                   │                          │
└───────────────────┴──────────────────────────┘
```

Each widget is a visually distinct **card** with a subtle border or shadow to create separation.

---

## Architecture

### Script Execution Strategy

`js/script.js` is loaded via a `<script src="js/script.js">` tag placed **before `</body>`**.
The file is structured in two sections:

```
js/script.js
├── TOP LEVEL (runs immediately, before DOM is ready)
│   └── Theme restore — reads localStorage, sets data-theme on <html>
│       This runs before the browser paints, eliminating any theme flash.
│
└── DOMContentLoaded listener (runs after HTML is fully parsed)
    └── init() — all DOM queries, event listeners, widget setup
```

This approach keeps all JavaScript in one external file while still applying the saved theme
before the first paint, satisfying both TC-6 (no inline JS) and FR-5.2 (no theme flash).

```js
// Top of script.js — runs before DOM is ready
(function () {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') {
    document.documentElement.setAttribute('data-theme', saved);
  }
})();

// Rest of the file — runs after DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  init();
});
```

### CSS Architecture

All colors are defined as CSS custom properties on `:root` (light theme) and overridden
under `[data-theme="dark"]`:

```css
:root {
  --bg-page, --bg-card, --text-primary, --text-secondary,
  --accent, --border, --btn-bg, --btn-text, --danger, --warning
}
[data-theme="dark"] {
  /* same property names, different values */
}
```

**Typography:**
- Font family: system-ui stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`)
- Clock / timer: monospace stack for consistent digit width
- Base font size: 16 px; scale using `rem` units

**Spacing & Layout:**
- Page max-width: 1 200 px, centered with `margin: 0 auto`
- Grid gap: 1.5 rem; card padding: 1.25 rem
- Border-radius: 0.75 rem (cards), 0.375 rem (inputs/buttons)

**Responsive Breakpoints:**

| Breakpoint | Layout |
|-----------|--------|
| ≥ 768 px | 2-column grid |
| < 768 px | 1-column stacked |

**States & Feedback:**
- `.completed` on a task `<li>` → strikethrough + 60% opacity
- Warning/error messages → amber/orange color (`var(--warning)`), hidden by default
- `:hover` and `:focus-visible` states on all interactive elements

### File Responsibilities

| File | Responsibility |
|------|---------------|
| `index.html` | Semantic markup for all widgets; links `css/style.css` in `<head>` and `js/script.js` before `</body>`; **no inline JavaScript** |
| `css/style.css` | All CSS: custom properties, reset, layout, widget styles, dark theme overrides, responsive rules |
| `js/script.js` | All JS: early theme restore (top of file), then inside `DOMContentLoaded` — DOM queries, event listeners, timer logic, task CRUD, quick-link CRUD, Local Storage helpers, theme toggle, clock/greeting interval |

### ID Generation

Since there is no backend, unique IDs for tasks and quick links are generated client-side:

```js
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
```

This is sufficient for a local-only, single-user application.

### Security

- **XSS prevention:** All user-provided text (task names, link labels) is written to the DOM
  exclusively via `element.textContent`. The `innerHTML` property is never used with
  user-supplied data.
- **URL safety:** Only URLs that pass `new URL()` parsing AND have `http:` or `https:` protocol
  are stored and rendered. This prevents `javascript:` and other dangerous protocol injections.
- **Link safety:** All external links use `rel="noopener noreferrer"` to prevent tab-napping.

### Accessibility

- All interactive elements are keyboard-navigable.
- Buttons have descriptive `aria-label` attributes where icon-only.
- The theme toggle updates its `aria-label` to reflect the current mode.
- Color contrast targets WCAG AA (4.5:1 for normal text, 3:1 for large text) in both themes.
- Duplicate warnings, URL errors, and the timer notification use `role="alert"` so screen
  readers announce them automatically.

---

## Components and Interfaces

### Greeting Widget

**Structure:**
- Large heading for the greeting phrase + user name
- Medium text for the current date
- Large monospace text for the live clock
- A small labeled text input ("Your name") with a **Save** button beneath the clock

**Behavior:**
- A `setInterval` running every 1 000 ms updates the clock display and re-evaluates the greeting phrase.
- On save, the name is written to `localStorage.setItem('userName', value)`.
- On load, `localStorage.getItem('userName')` pre-fills the input and the greeting.
- Clearing the input and saving removes the key from Local Storage.

---

### Focus Timer Widget

**Structure:**
- Large monospace countdown display (`MM:SS`)
- Three buttons in a row: **Start**, **Stop**, **Reset**
- A short status label below the buttons ("Running", "Paused", "Ready", "Complete")
- An in-page notification banner (hidden by default, `role="alert"`) for session-complete feedback

**Behavior:**
- Internal state: `totalSeconds = 1500`, `intervalId = null`
- **Start**: if `intervalId` is not null (already running) or `totalSeconds === 0` (finished), do nothing. Otherwise call `setInterval` (1 000 ms), decrement `totalSeconds`, clamp to 0, update display.
- **Stop**: call `clearInterval(intervalId)`, set `intervalId = null`.
- **Reset**: call Stop, then set `totalSeconds = 1500`, update display, hide notification.
- At `totalSeconds === 0`: call Stop, show the in-page notification banner, set status to "Complete". Start is disabled until Reset is called.
- Display is always formatted as zero-padded two-digit strings; `totalSeconds` never goes below 0.

---

### To-Do List Widget

**Structure:**
- Text input + **Add** button at the top
- An inline duplicate-warning message area (hidden by default, `role="alert"`)
- A scrollable `<ul>` where each `<li>` contains:
  - Checkbox
  - Task label text (set via `textContent`)
  - **Edit** button
  - **Delete** button

**Behavior — Add:**
1. Trim and validate input (non-empty).
2. Check for case-insensitive duplicate against all existing task texts.
3. If duplicate → show warning, do not add.
4. Otherwise → push new task object, save to Local Storage, re-render list, clear input.

**Behavior — Complete:**
- Toggle `completed` boolean on the task object, save, re-render.
- Completed tasks receive a `.completed` CSS class (strikethrough + muted color).

**Behavior — Edit:**
- Replace the task label `<span>` with an `<input>` pre-filled with the current text.
- Replace the Edit button with a **Save** button and a **Cancel** button.
- On Save:
  1. Trim the new value. If empty → show inline warning, do not save.
  2. Check for case-insensitive duplicate against all other tasks (excluding the task being edited).
  3. If duplicate → show inline warning, do not save.
  4. Otherwise → update `task.text`, save, re-render.
- On Cancel → re-render without changes.
- The task being edited is identified by its `id` and excluded from the duplicate check.

**Behavior — Delete:**
- Filter the task out of the array, save, re-render.

**Behavior — Render:**
- A single `renderTasks()` function clears and rebuilds the `<ul>` from the in-memory array.
- All task text is applied via `element.textContent`, never `innerHTML`.
- Called after every mutation.

---

### Quick Links Widget

**Structure:**
- Two inputs side-by-side: **Label** and **URL** + an **Add Link** button
- An inline validation-error message area (hidden by default, `role="alert"`)
- A flex-wrap container of link cards, each showing:
  - A clickable `<a>` element with the label text and `target="_blank" rel="noopener noreferrer"`
  - A small **×** (delete) button

**Behavior — Add:**
1. Trim both label and URL inputs; if either is empty, show an error and return.
2. Validate the URL using the `URL` constructor inside a `try/catch`:
   ```js
   try {
     const parsed = new URL(urlInput);
     if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') throw new Error();
   } catch {
     // show error: "Please enter a valid http or https URL."
     return;
   }
   ```
3. Use the parsed URL string (from `parsed.href`) to ensure a well-formed value is stored.
4. Push `{ id: generateId(), label, url: parsed.href }` to `quickLinks`, save, re-render.

**Behavior — Render:**
- All label text is set via `element.textContent` (never `innerHTML`).
- The `href` attribute of each `<a>` is set via `element.setAttribute('href', link.url)`.
- Each `<a>` has `target="_blank"` and `rel="noopener noreferrer"`.
- Navigation is handled by the `<a>` element's native behavior — no `window.open()` needed.

**Behavior — Delete:**
- Filter out the link, save, re-render.

---

### Light / Dark Mode Toggle

**Structure:**
- A single icon button in the top navigation bar (☀️ / 🌙).

**Behavior:**
- The `data-theme` attribute is toggled on `<html>` (`document.documentElement`).
- CSS custom properties defined under `[data-theme="dark"]` override the default (light) values.
- **Early theme restore (no flash):** The very first lines of `js/script.js` read
  `localStorage.getItem('theme')` and apply `data-theme` before the first CSS paint.
- **Toggle:** `initTheme()` and `toggleTheme()` are called inside `DOMContentLoaded`.
  On toggle: flip the attribute value, save to Local Storage, update the button icon and `aria-label`.

---

## Data Models

### Local Storage Keys

| Key | Type | Description |
|-----|------|-------------|
| `userName` | String | User's display name for the greeting |
| `theme` | `"light"` or `"dark"` | Current theme preference |
| `tasks` | JSON Array of Task objects | All to-do tasks |
| `quickLinks` | JSON Array of QuickLink objects | All saved quick links |

### Task Object

```json
{
  "id": "lf3k2abc9x",
  "text": "Buy groceries",
  "completed": false
}
```

| Field | Type | Constraints |
|-------|------|-------------|
| `id` | String | Non-empty; generated by `generateId()`; unique within the array |
| `text` | String | Non-empty after trimming; case-insensitively unique within the array |
| `completed` | Boolean | `true` or `false` |

### QuickLink Object

```json
{
  "id": "lf3k2def7y",
  "label": "GitHub",
  "url": "https://github.com"
}
```

| Field | Type | Constraints |
|-------|------|-------------|
| `id` | String | Non-empty; generated by `generateId()`; unique within the array |
| `label` | String | Non-empty after trimming |
| `url` | String | Must pass `new URL()` parsing; protocol must be `http:` or `https:` only |

### Storage Helper Functions

- `loadFromStorage(key, fallback)` — `JSON.parse(localStorage.getItem(key))`, returns `fallback` on null or parse error (wrapped in try/catch).
- `saveToStorage(key, value)` — `localStorage.setItem(key, JSON.stringify(value))`.

---

## Correctness Properties

These invariants must hold at all times during application operation.

### Property 1: Greeting Boundary Correctness

For every hour from 0 through 23, the application displays exactly one correct greeting phrase according to the defined time boundaries:

- 05:00–11:59 → "Good Morning"
- 12:00–17:59 → "Good Afternoon"
- 18:00–21:59 → "Good Evening"
- 22:00–04:59 → "Good Night"

Every hour value from 0 to 23 maps to exactly one phrase; no hour is unhandled or ambiguous.

**Validates: Requirements 1.3**

### Property 2: Timer Bounds

The timer value always remains between 0 and 1500 seconds and never becomes negative.
`totalSeconds` is clamped to 0 after each decrement, and `Start` has no effect when
`totalSeconds` is already 0. `Reset` always restores `totalSeconds` to exactly 1500.

**Validates: Requirements 2.1, 2.4, 2.5**

### Property 3: Timer Display Format

For every valid timer value, the display always uses zero-padded MM:SS format. Minutes and
seconds are each rendered as exactly two digits (e.g., `07:04`, `00:00`, `25:00`). The
display is updated after every decrement and immediately on Reset.

**Validates: Requirements 2.6**

### Property 4: Task Uniqueness

No two tasks may have identical trimmed and case-insensitive text. This applies on both add
and edit: a new task is rejected if its normalised text matches any existing task, and an
edited task is rejected if its normalised text matches any other task (excluding itself by `id`).

**Validates: Requirements 3.7, 3.8**

### Property 5: Local Storage Persistence

Saving and reloading valid tasks, quick links, user name, and theme restores the same
application state. After every mutation the affected structure is immediately serialised and
written to Local Storage. On page load, all four keys are read and used to initialise state
before any user interaction.

**Validates: Requirements 1.5, 3.6, 4.4, 5.2**

### Property 6: Quick Link URL Safety

Every saved quick link uses only the `http:` or `https:` protocol. A URL is validated with
`new URL()` before being stored; any URL that fails to parse or whose protocol is not
`http:` or `https:` (e.g., `javascript:`, `ftp:`, `data:`) is rejected with a visible error
and is never written to Local Storage.

**Validates: Requirements 4.5, 4.6**

### Property 7: Theme Validity

The stored and applied theme is always either `"light"` or `"dark"`. The early-restore IIFE
only calls `setAttribute` when the stored value is exactly one of those two strings; any other
value (including `null` or an empty string) is ignored and the browser renders the default
light theme. The toggle function only ever writes `"light"` or `"dark"` to Local Storage.

**Validates: Requirements 5.1, 5.2**

---

## Error Handling

### Empty Input
- **Task input:** If the trimmed task text is empty when the user clicks Add or presses Enter, the action is silently ignored. No task is added and no error is shown (an empty field is treated as a no-op).
- **Edit input:** If the trimmed edited text is empty when the user clicks Save, a visible warning is shown (`"Task text cannot be empty."`) and the save is cancelled. The edit field remains open.
- **Quick Links:** If either the label or URL field is empty when the user clicks Add Link, a visible warning is shown (`"Please enter both a label and a URL."`) and no link is added.

### Duplicate Tasks
- On **add**: if the trimmed input matches any existing task text (case-insensitive), a visible warning is shown (`"Task already exists!"`) and the duplicate is not added. The warning is hidden automatically when the user starts typing again.
- On **edit save**: if the trimmed new text matches any other task text (case-insensitive, excluding the task being edited), a visible warning is shown (`"A task with that name already exists."`) and the save is cancelled.

### Invalid URLs
- If the URL input fails `new URL()` parsing, a visible warning is shown (`"Please enter a valid http or https URL."`) and no link is added.
- If the URL parses successfully but its protocol is not `http:` or `https:`, the same warning is shown and no link is added.

### Malformed Local Storage Data
- `loadFromStorage(key, fallback)` wraps `JSON.parse` in a `try/catch`. If the stored value is missing, null, or not valid JSON, the function returns the provided `fallback` (an empty array `[]` for tasks and quick links, an empty string `''` for the user name, and no value for theme). The application initializes cleanly from the fallback without throwing.

### Timer Interval Safety
- `startTimer()` checks `intervalId !== null` before creating a new interval, preventing duplicate intervals from stacking.
- `startTimer()` also checks `totalSeconds === 0` and returns immediately, preventing the timer from being restarted after completion without a Reset.
- `totalSeconds` is clamped to 0 after each decrement, ensuring it never goes negative even if the interval fires unexpectedly close to the boundary.
- `stopTimer()` always calls `clearInterval` before setting `intervalId = null`, ensuring no orphaned intervals remain.

---

## Testing Strategy

No automated test infrastructure is required or used for this project (per NFR-1 and the
original assignment constraints). All verification is performed through **manual browser testing**.

### Manual Test Approach

Testers should open `index.html` directly in each target browser and work through the
following areas by hand:

**Greeting & Clock:**
- Verify the clock increments every second.
- Temporarily change the system clock to each time boundary (05:00, 12:00, 18:00, 22:00) and confirm the greeting phrase updates correctly.
- Enter a name, save it, reload — confirm the name appears in the greeting and the input is pre-filled.
- Clear the name, save, reload — confirm the greeting reverts to the name-less form.

**Focus Timer:**
- Start the timer; confirm it counts down from 25:00 every second.
- Click Stop; confirm the countdown halts. Click Start again; confirm it resumes from the paused value.
- Click Reset at any state; confirm the display returns to 25:00 and the interval stops.
- Let the timer reach 00:00; confirm the completion notification appears, the status shows "Complete", and clicking Start has no effect. Click Reset and confirm normal operation resumes.

**To-Do List:**
- Add a task; confirm it appears in the list and persists after reload.
- Add a task with the same text (different casing); confirm the duplicate warning fires and no second entry is added.
- Add an empty or whitespace-only task; confirm nothing is added.
- Check and uncheck a task; confirm the visual style toggles and the state persists after reload.
- Edit a task to a valid new text; confirm the update is saved.
- Edit a task to empty text; confirm the warning fires and the change is not saved.
- Edit a task to match another task's text; confirm the duplicate warning fires.
- Delete a task; confirm it is removed from the list and from Local Storage.

**Quick Links:**
- Add a link with a valid `https://` URL; confirm the card appears and opens the URL in a new tab.
- Add a link with an invalid URL (e.g., `not-a-url`); confirm the error message appears and no link is added.
- Add a link with a non-http/https URL (e.g., `ftp://example.com`); confirm it is rejected.
- Delete a link; confirm it is removed and the change persists after reload.

**Light / Dark Mode:**
- Click the toggle; confirm the color scheme switches immediately.
- Reload; confirm the correct theme is restored with no visible flash.

**Responsive Layout:**
- Resize the browser window below 768 px; confirm the grid collapses to a single column.
- Resize above 768 px; confirm the two-column grid is restored.

**Cross-Browser:**
- Repeat the above checks in Chrome, Firefox, Edge, and Safari (current stable versions).
