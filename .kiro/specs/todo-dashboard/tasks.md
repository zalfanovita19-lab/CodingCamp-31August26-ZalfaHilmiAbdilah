# Implementation Plan

## Overview

Each task below is self-contained and maps to one or more requirements from `requirements.md`
for the **To-Do List Life Dashboard** project.
Tasks are ordered so that each one builds on the previous. Complete them in sequence.

Reference files produced by this spec:
- `index.html`
- `css/style.css`
- `js/script.js`
- `README.md`

---

## Task Dependency Graph

The waves below reflect the sequential implementation order and task dependencies.

```json
{
  "waves": [
    {
      "id": 1,
      "tasks": ["TASK-1"]
    },
    {
      "id": 2,
      "tasks": ["TASK-2"]
    },
    {
      "id": 3,
      "tasks": ["TASK-3"]
    },
    {
      "id": 4,
      "tasks": ["TASK-4"]
    },
    {
      "id": 5,
      "tasks": ["TASK-5"]
    },
    {
      "id": 6,
      "tasks": ["TASK-6"]
    },
    {
      "id": 7,
      "tasks": ["TASK-7", "TASK-9", "TASK-13"]
    },
    {
      "id": 8,
      "tasks": ["TASK-8"]
    },
    {
      "id": 9,
      "tasks": ["TASK-10"]
    },
    {
      "id": 10,
      "tasks": ["TASK-11"]
    },
    {
      "id": 11,
      "tasks": ["TASK-12"]
    },
    {
      "id": 12,
      "tasks": ["TASK-14"]
    },
    {
      "id": 13,
      "tasks": ["TASK-15"]
    },
    {
      "id": 14,
      "tasks": ["TASK-16"]
    },
    {
      "id": 15,
      "tasks": ["TASK-17"]
    },
    {
      "id": 16,
      "tasks": ["TASK-18"]
    }
  ]
}
```

---

## Tasks

## TASK-1: Project Scaffold

**Goal:** Create the folder structure and empty files so every subsequent task has a target to write into.

**Steps:**
1. Create `index.html` at the workspace root.
2. Create the `css/` folder and `css/style.css` inside it.
3. Create the `js/` folder and `js/script.js` inside it.
4. `README.md` already exists at the workspace root — do not recreate it.

**Deliverable:** Three new files exist (`index.html`, `css/style.css`, `js/script.js`);
`index.html` links `css/style.css` in `<head>` and `js/script.js` with a `<script src="js/script.js">` tag
placed immediately before `</body>`. No inline JavaScript is present anywhere in `index.html`.

**Requirements covered:** TC-1, TC-4, TC-5, TC-6

---

## TASK-2: HTML Skeleton

**Goal:** Write the full semantic markup for all four widgets inside `index.html`.

**Steps:**
1. Set up the standard HTML5 boilerplate (`<!DOCTYPE html>`, `<html lang="en">`, `<head>`, `<body>`).
2. Do **not** add any `<script>` tags with inline code to `<head>` or anywhere else in `index.html`.
   The theme is applied early from `js/script.js` (see TASK-14).
3. Add a `<header>` / top bar containing the theme-toggle button (☀️/🌙) and the app title.
4. Add a `<main>` wrapper with a CSS Grid container (`class="dashboard-grid"`).
5. Inside the grid, add four `<section>` cards with distinct IDs:
   - `#widget-greeting` — Greeting widget
   - `#widget-timer` — Focus Timer widget
   - `#widget-todo` — To-Do List widget
   - `#widget-links` — Quick Links widget
6. Inside `#widget-greeting`: heading for greeting text, paragraph for date, paragraph for clock,
   name input + Save button.
7. Inside `#widget-timer`: large countdown display `<div id="timer-display">`, three buttons
   (`#btn-start`, `#btn-stop`, `#btn-reset`), status label, and a hidden notification banner
   (`role="alert"`).
8. Inside `#widget-todo`: task input + Add button, a `<p id="todo-warning" role="alert">` (hidden),
   a `<ul id="task-list">`.
9. Inside `#widget-links`: label input, URL input, Add Link button, a `<p id="links-error" role="alert">`
   (hidden), a `<div id="links-container">`.
10. Ensure all interactive elements have descriptive `aria-label` or visible label text.
11. Confirm `index.html` contains zero inline scripts and zero `on*` HTML event attributes.

**Deliverable:** `index.html` renders all four widget cards in the browser with no styling yet.
No JavaScript errors appear in the browser console.

**Requirements covered:** FR-1 – FR-5 (structure only), TC-6

---

## TASK-3: CSS — Reset, Variables, and Base Styles

**Goal:** Establish the design foundation in `css/style.css`.

**Steps:**
1. Add a minimal CSS reset (`*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }`).
2. Define all CSS custom properties on `:root` for the **light** theme:
   - `--bg-page`, `--bg-card`, `--text-primary`, `--text-secondary`
   - `--accent`, `--border`, `--btn-bg`, `--btn-text`, `--danger`, `--warning`
3. Define the **dark** theme overrides under `[data-theme="dark"]` using the same property names.
4. Apply base styles to `body`: background color, text color, font family (system-ui stack), line height.
5. Style the `<header>` top bar: flex layout, app title on the left, theme toggle on the right.
6. Style the theme-toggle button: icon-only appearance, no border, cursor pointer, hover effect.

**Deliverable:** The page has a clean base appearance; setting `data-theme="dark"` on `<html>` changes the color scheme visually.

**Requirements covered:** NFR-3, FR-5.1, FR-5.2 (visual foundation)

---

## TASK-4: CSS — Layout and Widget Cards

**Goal:** Implement the dashboard grid and card styles.

**Steps:**
1. Style `.dashboard-grid` as a CSS Grid with two equal columns and a `1.5rem` gap.
2. Add a responsive media query: below `768px`, collapse to a single column.
3. Style each widget `<section>` as a card: background `var(--bg-card)`, border-radius `0.75rem`,
   padding `1.25rem`, subtle box shadow, `var(--border)` border.
4. Add a card heading style (`<h2>`) for widget titles: clear visual weight, bottom margin.
5. Style all `<input>` and `<button>` elements: consistent padding, border-radius `0.375rem`,
   border using `var(--border)`, background and text from CSS variables.
6. Style primary action buttons using `var(--accent)` background.
7. Style danger buttons (Delete) using `var(--danger)`.
8. Add `:hover` and `:focus-visible` states for all interactive elements.

**Deliverable:** The dashboard displays as a clean two-column card grid on wide screens and
collapses to one column on screens narrower than 768 px.

**Requirements covered:** NFR-1, NFR-2, NFR-3, TC-3

---

## TASK-5: CSS — Widget-Specific Styles

**Goal:** Style the internals of each widget.

**Steps:**
1. **Greeting:** Large greeting heading, medium date text, large monospace clock, compact name row
   (input + button side by side).
2. **Timer:** Centered layout; extra-large monospace countdown display; evenly-spaced button row;
   small status label beneath; hidden notification banner styled with `var(--warning)`.
3. **To-Do List:**
   - Task input row: input takes all available width, Add button fixed width.
   - Warning message: amber/orange color (`var(--warning)`), hidden by default (`display: none`).
   - Task list items: flex row, checkbox on left, text in middle (flex-grow), action buttons on right.
   - `.completed` class on `<li>`: strikethrough text, `var(--text-secondary)` color, 60% opacity.
   - Edit mode: inline input that fills available space, with Save and Cancel buttons.
4. **Quick Links:**
   - Add-link form: two inputs side by side + button.
   - Error message: `var(--warning)` color, hidden by default (`display: none`).
   - Link cards container: flex wrap layout.
   - Each link card: `var(--accent)` background, label text, small × delete button.

**Deliverable:** All four widgets are visually complete and internally well-structured.

**Requirements covered:** FR-1 – FR-4, NFR-3

---

## TASK-6: JavaScript — Utilities and Initialization

**Goal:** Write the foundational JS code used by all features.

**Steps:**
1. At the very top of `js/script.js` (before any `DOMContentLoaded` listener), add the
   early theme-restore IIFE (see TASK-14 Step 1). This is the only code that runs outside
   `DOMContentLoaded`.
2. Add a `document.addEventListener('DOMContentLoaded', function () { init(); });` call.
3. Inside the `DOMContentLoaded` callback, declare all DOM element references using
   `document.getElementById` / `querySelector`.
4. Write `loadFromStorage(key, fallback)`: `JSON.parse(localStorage.getItem(key)) ?? fallback`,
   wrapped in try/catch returning `fallback` on error.
5. Write `saveToStorage(key, value)`: `localStorage.setItem(key, JSON.stringify(value))`.
6. Write `generateId()`: `Date.now().toString(36) + Math.random().toString(36).slice(2)`.
7. Write an `init()` function that calls all widget-initialization functions
   (to be filled in subsequent tasks).

**Deliverable:** Script loads without errors; utility functions are available for other tasks;
`init()` is called after the DOM is ready.

**Requirements covered:** TC-1, TC-2, TC-6

---

## TASK-7: Greeting Widget — Clock, Date, and Greeting

**Goal:** Implement the live clock, date display, and time-based greeting.

**Steps:**
1. Write `getGreeting(hour)`: returns the correct phrase based on hour ranges defined in FR-1.3.
2. Write `updateClock()`:
   - Get `new Date()`.
   - Format time as `HH:MM:SS` (zero-padded).
   - Format date as a long locale string (e.g.,
     `date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })`).
   - Call `getGreeting(hour)` and build the full greeting string (with name if set).
   - Update the relevant DOM elements using `textContent`.
3. Call `updateClock()` once immediately inside `init()`, then `setInterval(updateClock, 1000)`.

**Deliverable:** The clock ticks every second; the greeting phrase changes at time boundaries;
the date is displayed correctly.

**Requirements covered:** FR-1.1, FR-1.2, FR-1.3 — AC-1.1, AC-1.2

---

## TASK-8: Greeting Widget — Custom Name

**Goal:** Allow the user to save and restore a custom name.

**Steps:**
1. On `init()`, read `localStorage.getItem('userName')`, pre-fill the name input,
   and store the value in a module-level variable `userName`.
2. Add a `click` listener on the Save button:
   - Trim the input value.
   - If non-empty: `localStorage.setItem('userName', trimmed)`, update `userName`.
   - If empty: `localStorage.removeItem('userName')`, set `userName = ''`.
   - Call `updateClock()` immediately to reflect the change.

**Deliverable:** Entering a name and saving shows it in the greeting; reloading restores it;
clearing removes it.

**Requirements covered:** FR-1.4, FR-1.5 — AC-1.3, AC-1.4

---

## TASK-9: Focus Timer

**Goal:** Implement the full 25-minute countdown timer.

**Steps:**
1. Declare `let totalSeconds = 1500` and `let intervalId = null` in module scope (inside `DOMContentLoaded`).
2. Write `formatTime(seconds)`: returns `MM:SS` string with zero-padding.
3. Write `updateTimerDisplay()`: sets `#timer-display` text to `formatTime(totalSeconds)`.
4. Write `startTimer()`:
   - Guard: if `intervalId !== null`, return (already running).
   - `setInterval` every 1 000 ms: decrement `totalSeconds`, call `updateTimerDisplay()`.
   - If `totalSeconds <= 0`: call `stopTimer()`, show the in-page notification banner
     (`role="alert"`) with the text "Focus session complete!", set `totalSeconds = 0`.
   - Update status label to "Running".
5. Write `stopTimer()`:
   - `clearInterval(intervalId)`, set `intervalId = null`.
   - Update status label to "Paused".
6. Write `resetTimer()`:
   - Call `stopTimer()`.
   - Set `totalSeconds = 1500`, call `updateTimerDisplay()`.
   - Hide the notification banner.
   - Update status label to "Ready".
7. Attach listeners: Start → `startTimer`, Stop → `stopTimer`, Reset → `resetTimer`.
8. Call `updateTimerDisplay()` on init.

**Deliverable:** Timer counts down from 25:00; Start/Stop/Resume/Reset work correctly;
expiry triggers a visible in-page notification.

**Requirements covered:** FR-2.1 – FR-2.6 — AC-2.1 – AC-2.5

---

## TASK-10: To-Do List — Core CRUD

**Goal:** Implement add, complete, delete, and Local Storage persistence for tasks.

**Steps:**
1. Declare `let tasks = loadFromStorage('tasks', [])` in module scope.
2. Write `saveTasks()`: `saveToStorage('tasks', tasks)`.
3. Write `renderTasks()`:
   - Clear `#task-list` innerHTML.
   - For each task in `tasks`, create an `<li>` with:
     - A checkbox (`checked` if `task.completed`), wired to a `change` listener that toggles
       `task.completed`, calls `saveTasks()` and `renderTasks()`.
     - A `<span>` whose text is set via `span.textContent = task.text`.
     - An Edit button (fully wired in TASK-11).
     - A Delete button that filters the task out of `tasks`, calls `saveTasks()` and `renderTasks()`.
   - Apply `.completed` class to `<li>` if `task.completed`.
4. Write `addTask()`:
   - Trim the input value; if empty, return without action.
   - Check for duplicates (see TASK-12 — stub as a pass-through for now).
   - Push `{ id: generateId(), text, completed: false }` to `tasks`.
   - Call `saveTasks()`, `renderTasks()`, clear the input.
5. Add a `click` listener on the Add button → `addTask()`.
6. Add a `keydown` listener on the task input: if `Enter` key → `addTask()`.
7. Call `renderTasks()` on init.

**Deliverable:** Tasks can be added, checked/unchecked, and deleted. Tasks survive a page reload.
All task text is written to the DOM via `textContent`.

**Requirements covered:** FR-3.1 – FR-3.6 — AC-3.1, AC-3.2, AC-3.3, AC-3.4, AC-3.6

---

## TASK-11: To-Do List — Inline Edit

**Goal:** Allow editing a task's text in place; reject empty text and duplicates during editing.

**Steps:**
1. In `renderTasks()`, wire the Edit button to an `editTask(id)` function.
2. Write `editTask(id)`:
   - Find the `<li>` for the given task ID.
   - Replace the text `<span>` with an `<input>` pre-filled with the current text.
   - Replace the Edit button with a **Save** button (wired to `saveEdit(id)`) and a
     **Cancel** button (wired to `renderTasks()` — discards changes).
3. Write `saveEdit(id)`:
   - Read the inline input value and trim it.
   - If empty: show `#todo-warning` with the message "Task text cannot be empty." Return without saving.
   - Check for a case-insensitive duplicate against all other tasks, **excluding the task
     with the matching `id`**:
     ```js
     const duplicate = tasks.some(t => t.id !== id &&
       t.text.trim().toLowerCase() === newText.toLowerCase());
     ```
   - If duplicate: show `#todo-warning` with the message "A task with that name already exists." Return without saving.
   - Otherwise: find the task by `id`, set `task.text = newText`, hide `#todo-warning`,
     call `saveTasks()`, call `renderTasks()`.

**Deliverable:** Clicking Edit replaces the label with an input; empty text and duplicates are
rejected with a visible warning; a valid edit persists; Cancel discards changes.

**Requirements covered:** FR-3.4, FR-3.8 — AC-3.5, AC-3.8

---

## TASK-12: To-Do List — Prevent Duplicate Tasks on Add (Challenge)

**Goal:** Block case-insensitive duplicate task entries when adding and inform the user.

**Steps:**
1. Write `isDuplicate(text, excludeId = null)`: returns `true` if any task in `tasks`
   (excluding the task whose `id === excludeId`) has text that matches
   `text.trim().toLowerCase()`. This shared helper is used by both `addTask()` and `saveEdit()`.
2. In `addTask()`, after trimming the input, call `isDuplicate(text)`:
   - If `true`: set `#todo-warning` text to "Task already exists!", make it visible
     (`display: block`), and return early.
   - If `false`: hide `#todo-warning`, proceed with adding the task.
3. Update `saveEdit()` (TASK-11) to call `isDuplicate(newText, id)` so the task being edited
   is excluded from the check.
4. Hide the warning whenever the user starts typing in the task input field (`input` event).
5. Confirm `#todo-warning` has `role="alert"` so screen readers announce it.

**Deliverable:** Adding a task whose text matches an existing task (any casing) shows a warning
and does not add the duplicate. The same check applies when saving an edit.

**Requirements covered:** FR-3.7, FR-3.8 — AC-3.7, AC-3.8

---

## TASK-13: Quick Links

**Goal:** Implement add, open, delete, and Local Storage persistence for quick links,
with strict URL validation and XSS-safe rendering.

**Steps:**
1. Declare `let quickLinks = loadFromStorage('quickLinks', [])` in module scope.
2. Write `saveLinks()`: `saveToStorage('quickLinks', quickLinks)`.
3. Write `isValidUrl(urlString)`:
   ```js
   function isValidUrl(urlString) {
     try {
       const parsed = new URL(urlString);
       return parsed.protocol === 'http:' || parsed.protocol === 'https:';
     } catch {
       return false;
     }
   }
   ```
4. Write `renderLinks()`:
   - Clear `#links-container` innerHTML.
   - For each link, create a card `<div>` containing:
     - An `<a>` element:
       - Set `a.textContent = link.label` (never `innerHTML`).
       - Set `a.setAttribute('href', link.url)`.
       - Set `a.target = '_blank'` and `a.rel = 'noopener noreferrer'`.
     - A small × button:
       - Set button text via `button.textContent = '×'`.
       - Wire to a listener that filters the link out of `quickLinks`,
         calls `saveLinks()` and `renderLinks()`.
5. Write `addLink()`:
   - Trim both label and URL inputs; if either is empty, show `#links-error`
     ("Please enter both a label and a URL.") and return.
   - Call `isValidUrl(url)`:
     - If invalid: show `#links-error` ("Please enter a valid http or https URL.") and return.
   - Parse the URL with `new URL(url)` and store `parsed.href` as the canonical form.
   - Push `{ id: generateId(), label, url: parsed.href }` to `quickLinks`.
   - Call `saveLinks()`, `renderLinks()`, clear both inputs, hide `#links-error`.
6. Add a `click` listener on Add Link button → `addLink()`.
7. Call `renderLinks()` on init.

**Deliverable:** Quick links can be added (only valid http/https URLs accepted), opened in a
new tab with `noopener noreferrer`, and deleted. Links survive a page reload. All user text
is rendered safely via `textContent`. Invalid URLs show a clear error message.

**Requirements covered:** FR-4.1 – FR-4.6 — AC-4.1 – AC-4.7

---

## TASK-14: Light / Dark Mode Toggle (Challenge)

**Goal:** Implement the theme toggle with Local Storage persistence and no flash on reload,
with all JavaScript kept inside `js/script.js`.

**Steps:**
1. At the very **top** of `js/script.js` (before the `DOMContentLoaded` listener), add the
   early theme-restore IIFE:
   ```js
   (function () {
     const saved = localStorage.getItem('theme');
     if (saved === 'dark' || saved === 'light') {
       document.documentElement.setAttribute('data-theme', saved);
     }
   })();
   ```
   This code runs synchronously as the browser parses the `<script>` tag at the end of
   `<body>`. The `<html>` element is already in the DOM at that point, so `data-theme`
   is set before the first CSS paint. No inline script in `index.html` is required or permitted.

2. Inside `DOMContentLoaded`, write `initTheme()`:
   - Read `document.documentElement.getAttribute('data-theme')` (already set by the IIFE or defaulting to light).
   - Update the toggle button's icon and `aria-label` to match the current theme.

3. Write `toggleTheme()`:
   - Read current `data-theme` from `document.documentElement`.
   - Compute `newTheme` (flip between `'dark'` and `'light'`).
   - `document.documentElement.setAttribute('data-theme', newTheme)`.
   - `localStorage.setItem('theme', newTheme)`.
   - Update the toggle button icon and `aria-label`.

4. Add a `click` listener on the theme-toggle button → `toggleTheme()`.
5. Call `initTheme()` inside `init()`.

**Deliverable:** Clicking the toggle switches between light and dark; the chosen theme persists
across reloads with no visible flash; zero inline JavaScript exists in `index.html`.

**Requirements covered:** FR-5.1, FR-5.2 — AC-5.1, AC-5.2, AC-5.3, TC-6

---

## TASK-15: README

**Goal:** Update the existing `README.md` with complete project documentation.
Do not create a new file — edit the file that already exists at the workspace root.

**Sections to include (add or replace as needed):**
1. **Project Title & Description** — what the app is and does.
2. **Live Demo** — the published GitHub Pages URL (add after deployment in TASK-16).
3. **Features** — bullet list covering all five feature areas (including the three challenges:
   Light/Dark Mode, Custom Name, Prevent Duplicate Tasks).
4. **Project Structure** — file tree showing `index.html`, `css/style.css`, `js/script.js`,
   `README.md`, and `.kiro/`.
5. **How to Run Locally** — open `index.html` directly in any modern browser; no server needed.
6. **How to Deploy (GitHub Pages)** — step-by-step:
   1. Push the repository to GitHub.
   2. Go to the repository on GitHub → **Settings** → **Pages**.
   3. Under **Source**, select the **main** branch and **/ (root)** folder, then click **Save**.
   4. Wait for the Pages build to complete, then open the provided URL.
7. **Tech Stack** — HTML5, CSS3, Vanilla JavaScript, Browser Local Storage.
8. **Author** — Zalfa Hilmi Abdilah.

**Requirements covered:** TC-4, GitHub/Deployment requirements

---

## TASK-16: GitHub and Deployment

**Goal:** Publish the completed project to GitHub and verify the live site.

**Steps:**
1. Open **GitHub Desktop**. Confirm the repository is set to the correct local workspace folder.
2. Stage all source files: `index.html`, `css/style.css`, `js/script.js`, `README.md`,
   and the complete `.kiro/` folder (including all spec files).
3. Write a clear commit message (e.g., "Add To-Do List Life Dashboard — initial release")
   and create the commit.
4. Push the **main** branch to GitHub using the **Push origin** button.
5. On GitHub, open the repository → **Settings** → **Pages**.
6. Under **Source**, select **Deploy from a branch**, choose the **main** branch,
   set the folder to **/ (root)**, and click **Save**.
7. Wait for the GitHub Pages build to complete (typically 1–3 minutes).
   Check the **Actions** tab or the Pages banner for the build status.
8. Open the published URL (e.g., `https://<username>.github.io/<repo-name>/`) in a browser
   and verify the dashboard loads and all features work correctly on the live site.
9. Copy the live URL, add it to the **Live Demo** section of `README.md`, save the file.
10. In GitHub Desktop, commit the README update (e.g., "Add live demo URL to README")
    and push to main.

**Deliverable:** The repository is public on GitHub with all source files and the `.kiro/` folder
committed. The live site is accessible via GitHub Pages and fully functional.

**Requirements covered:** TC-4, GitHub/Deployment requirements

---

## TASK-17: Final Review and Polish

**Goal:** Cross-check the finished implementation against all requirements and acceptance criteria
before considering the project complete.

**Checklist:**

### Functionality
- [ ] All AC items in `requirements.md` are satisfied.
- [ ] Greeting updates every second; date and time-based phrase are correct.
- [ ] Custom name persists across page reloads.
- [ ] Timer Start, Stop, Resume, and Reset work correctly.
- [ ] Timer expiry shows a visible in-page notification and stops the countdown.
- [ ] Tasks can be added, completed, edited, and deleted.
- [ ] Duplicate task warning fires on add (case-insensitive) and on edit (excluding self).
- [ ] Editing a task rejects empty text with a visible warning.
- [ ] Tasks persist across page reloads with correct completion states.
- [ ] Quick links accept only `http:` and `https:` URLs; invalid URLs show an error.
- [ ] Quick links open in a new tab with `noopener noreferrer`.
- [ ] Quick links persist across page reloads.
- [ ] Light/Dark mode toggle switches themes correctly.
- [ ] Theme persists across reloads with no visible flash.

### Code Quality and Constraints
- [ ] `index.html` contains zero inline `<script>` tags and zero `on*` HTML event attributes.
- [ ] Exactly one CSS file exists (`css/style.css`); no other stylesheets are linked.
- [ ] Exactly one JavaScript file exists (`js/script.js`); no other scripts are linked.
- [ ] All user-provided text is rendered via `textContent`, never `innerHTML`.
- [ ] No JavaScript errors or warnings appear in the browser console on fresh load.

### Browser Compatibility
- [ ] Application loads and all features work in **Chrome** (current stable).
- [ ] Application loads and all features work in **Firefox** (current stable).
- [ ] Application loads and all features work in **Edge** (current stable).
- [ ] Application loads and all features work in **Safari** (current stable).

### Responsive Layout
- [ ] Dashboard displays as a two-column grid on a desktop-width screen (≥ 768 px).
- [ ] Dashboard collapses to a single column on a mobile-width screen (< 768 px).
- [ ] All widgets are readable and usable at both breakpoints.

### Local Storage Persistence
- [ ] Closing and reopening the browser tab restores: tasks, quick links, custom name, and theme.
- [ ] Clearing Local Storage resets the app to its default state without errors.

### Deployment
- [ ] All source files and the complete `.kiro/` folder are committed to the GitHub repository.
- [ ] The live GitHub Pages URL is present and correct in `README.md`.
- [ ] The published site is accessible and fully functional at the GitHub Pages URL.

**Requirements covered:** All

---

## TASK-18: Submission

**Goal:** Confirm all deliverables are in order and submit the required information through the provided Paperform.

**Steps:**
1. Confirm the correct **AWS Builder ID** (the email address registered for this coding camp).
2. Open the GitHub repository in a browser and copy the **public GitHub Repository URL**
   (e.g., `https://github.com/<username>/<repo-name>`).
3. Copy the **published GitHub Pages URL**
   (e.g., `https://<username>.github.io/<repo-name>/`).
4. Verify that both URLs are **publicly accessible** — open them in a private/incognito browser
   window to confirm they load without requiring a login.
5. Confirm that the complete `.kiro/` folder (including all spec files) is visible in the
   GitHub repository.
6. Open the provided **Paperform** submission link and enter:
   - AWS Builder ID
   - GitHub Repository URL
   - GitHub Pages URL
7. Submit the form and verify that all required fields were accepted successfully
   (no validation errors, confirmation message received).
8. Save a **screenshot or written record** of the completed submission confirmation
   for your own records.

**Deliverable:** Submission confirmed via Paperform with all three required values.
Both URLs verified as publicly accessible. `.kiro/` folder confirmed present in the repository.

**Requirements covered:** GitHub/Deployment requirements, project submission

---

## Task Summary

| Task | Description | Requirements |
|------|-------------|-------------|
| TASK-1 | Project scaffold | TC-1, TC-4, TC-5, TC-6 |
| TASK-2 | HTML skeleton (no inline JS) | FR-1 – FR-5 (structure), TC-6 |
| TASK-3 | CSS reset, variables, base styles | NFR-3, FR-5 |
| TASK-4 | CSS layout and widget cards | NFR-1 – NFR-3, TC-3 |
| TASK-5 | CSS widget-specific styles | FR-1 – FR-4, NFR-3 |
| TASK-6 | JS utilities and initialization | TC-1, TC-2, TC-6 |
| TASK-7 | Greeting — clock and date | FR-1.1 – FR-1.3 |
| TASK-8 | Greeting — custom name | FR-1.4, FR-1.5 |
| TASK-9 | Focus timer | FR-2.1 – FR-2.6 |
| TASK-10 | To-do list — core CRUD | FR-3.1 – FR-3.6 |
| TASK-11 | To-do list — inline edit with validation | FR-3.4, FR-3.8 |
| TASK-12 | Duplicate task prevention (add + edit) | FR-3.7, FR-3.8 (Challenge) |
| TASK-13 | Quick links with URL validation | FR-4.1 – FR-4.6 |
| TASK-14 | Light / dark mode toggle (no inline JS) | FR-5.1, FR-5.2, TC-6 (Challenge) |
| TASK-15 | Update README.md | TC-4, Deployment |
| TASK-16 | GitHub and deployment | TC-4, Deployment |
| TASK-17 | Final review and polish | All |
| TASK-18 | Submission | GitHub/Deployment, Submission |

---

## Notes

- **Technology:** Only HTML, CSS, and Vanilla JavaScript may be used. No frameworks (React, Vue, etc.), no libraries, and no build tools.
- **No backend:** The application is entirely client-side. No server, database, or API is permitted.
- **Single files only:** Only `css/style.css` and `js/script.js` may exist. No additional stylesheets or scripts of any kind.
- **README already exists:** Do not create a new `README.md`. Update the file that already exists at the workspace root.
- **Commit the `.kiro` folder:** The complete `.kiro/` folder, including all spec files, must be committed to the GitHub repository alongside the source code.
- **Task-by-task implementation:** Complete each task fully and verify it works before moving to the next. Do not implement multiple tasks at once.
- **Manual review before submission:** Complete TASK-17 (Final Review and Polish) in full before proceeding to TASK-18 (Submission). Do not submit until all checklist items in TASK-17 are confirmed.
