# Requirements Document

## Introduction

The **To-Do List Life Dashboard** is a standalone, single-page web application that serves
as a personal productivity dashboard. It combines a real-time greeting, a Pomodoro-style
focus timer, a persistent to-do list, and a quick-links launcher — all stored locally in the
browser with no backend required.

The application is built with HTML, CSS, and Vanilla JavaScript only. All data is persisted
exclusively via the browser Local Storage API. No frameworks, no backend server, and no
automated test setup are used.

**Selected challenges implemented:** Light and Dark Mode, Custom Name in Greeting,
Prevent Duplicate Tasks.

**Out of scope:** user authentication, server-side storage, mobile native app,
automated testing infrastructure, multiple timer presets.

---

## Requirements

### Requirement 1: Greeting

**User Story:** As a dashboard user, I want to see the current date, time, and a personalized
time-based greeting, so that I can begin my day with relevant information.

#### Acceptance Criteria

1. WHEN the page loads, the application SHALL display the current date in a human-readable
   format (e.g., "Friday, September 4, 2026"). *(FR-1.1, AC-1.1)*

2. WHEN the page loads, the application SHALL display the current time and SHALL update it
   every second (e.g., "14:32:05"). *(FR-1.2, AC-1.1)*

3. WHEN the current hour is between 05:00 and 11:59, the application SHALL display
   "Good Morning". WHEN the hour is between 12:00 and 17:59, it SHALL display
   "Good Afternoon". WHEN the hour is between 18:00 and 21:59, it SHALL display
   "Good Evening". WHEN the hour is between 22:00 and 04:59, it SHALL display
   "Good Night". *(FR-1.3, AC-1.2)*

4. WHEN the user enters a name and saves it, the application SHALL include that name in the
   greeting (e.g., "Good Morning, Zalfa!"). *(FR-1.4)*

5. WHEN the page is reloaded after a name has been saved, the application SHALL restore the
   saved name from Local Storage and display it in the greeting without requiring the user
   to re-enter it. *(FR-1.5, AC-1.3)*

6. WHEN the user clears the name field and saves, the application SHALL revert to the
   name-less greeting form and SHALL remove the name value from Local Storage. *(AC-1.4)*

---

### Requirement 2: Focus Timer

**User Story:** As a dashboard user, I want a 25-minute focus timer, so that I can manage
focused work sessions.

#### Acceptance Criteria

1. WHEN the page loads, the application SHALL display a countdown timer initialized to
   25 minutes (1500 seconds). *(FR-2.1)*

2. WHEN the user clicks the Start button, the application SHALL begin the countdown and
   SHALL decrement the display every second. *(FR-2.2, AC-2.1)*

3. WHEN the user clicks the Stop button while the timer is running, the application SHALL
   halt the countdown without resetting it; the displayed time SHALL NOT change after
   pausing. *(FR-2.3, AC-2.2)*

4. WHEN the user clicks the Start button after a Stop, the application SHALL resume the
   countdown from the paused time. *(AC-2.3)*

5. WHEN the user clicks the Reset button in any state, the application SHALL stop any
   running interval and SHALL return the display to 25:00. *(FR-2.4, AC-2.4)*

6. WHEN the timer reaches 00:00, the application SHALL stop automatically, SHALL display
   a visible in-page notification to the user (e.g., "Focus session complete!"), and SHALL
   prevent further countdown. Start SHALL have no effect until Reset is used. *(FR-2.5, AC-2.5)*

7. The timer display SHALL always show two-digit minutes and two-digit seconds in MM:SS
   format (e.g., 07:04, 00:00, 25:00). *(FR-2.6)*

---

### Requirement 3: To-Do List

**User Story:** As a dashboard user, I want to manage persistent tasks, so that I can
organize my work.

#### Acceptance Criteria

1. WHEN the user submits a non-empty task text via the input and Add button, the application
   SHALL add the task to the list immediately and SHALL clear the input field. *(FR-3.1, FR-3.2, AC-3.1)*

2. IF the user submits an empty or whitespace-only string, the application SHALL NOT add a
   task. *(AC-3.2)*

3. WHEN the user toggles a task's checkbox to checked, the application SHALL render the task
   as visually completed (e.g., strikethrough text). WHEN unchecked, the application SHALL
   restore the default appearance. *(FR-3.3, AC-3.4)*

4. WHEN the user clicks the Edit button on a task, the application SHALL open an inline
   editing mode. WHEN the user confirms the edit, the application SHALL save the new text. *(FR-3.4, AC-3.5)*

5. WHEN the user clicks the Delete button on a task, the application SHALL remove the task
   from the list and from Local Storage. *(FR-3.5, AC-3.6)*

6. WHEN any task is added, edited, completed, or deleted, the application SHALL immediately
   save all tasks to Local Storage so they persist across page reloads. WHEN the page is
   reloaded, the application SHALL restore all previously saved tasks with their completion
   states. *(FR-3.6, AC-3.3)*

7. WHEN the user attempts to add a task whose trimmed text is a case-insensitive match for
   any existing task, the application SHALL display a visible warning and SHALL NOT add the
   duplicate task. *(FR-3.7, AC-3.7)*

8. WHEN the user attempts to save an edit with empty text, the application SHALL display a
   visible warning and SHALL NOT save the change. WHEN the user attempts to save an edit
   whose trimmed text is a case-insensitive match for any other existing task (excluding the
   task being edited), the application SHALL display a visible warning and SHALL NOT save
   the change. Editing a task to the same text it already has SHALL be permitted. *(FR-3.8, AC-3.8)*

---

### Requirement 4: Quick Links

**User Story:** As a dashboard user, I want to save and open validated website links, so that
I can access favorite websites quickly.

#### Acceptance Criteria

1. WHEN the user provides a label and a valid URL and clicks Add Link, the application SHALL
   create a new quick-link card. *(FR-4.1, AC-4.1)*

2. WHEN the user clicks a quick-link card, the application SHALL open the saved URL in a new
   browser tab using `target="_blank"` and `rel="noopener noreferrer"`. *(FR-4.2, AC-4.2)*

3. WHEN the user clicks the Delete button on a quick link, the application SHALL remove it
   from the display and from Local Storage. *(FR-4.3, AC-4.4)*

4. WHEN the page is reloaded, the application SHALL restore all previously saved quick links
   from Local Storage. *(FR-4.4, AC-4.3)*

5. WHEN the user submits a URL, the application SHALL validate it using the URL constructor
   and SHALL only accept URLs with `http:` or `https:` protocols. IF the URL fails validation
   or uses any other protocol, the application SHALL display a visible error message and SHALL
   NOT create the link. *(FR-4.5, AC-4.5, AC-4.6)*

6. IF the user submits without providing both a label and a URL, the application SHALL NOT
   create a quick link. *(AC-4.5)*

7. All user-provided text rendered to the DOM SHALL be set via `textContent` or an equivalent
   safe property and SHALL NOT be injected via `innerHTML`, in order to prevent XSS. *(FR-4.6, AC-4.7)*

---

### Requirement 5: Light and Dark Mode

**User Story:** As a dashboard user, I want to switch and save the visual theme, so that the
interface matches my preference.

#### Acceptance Criteria

1. WHEN the user clicks the theme toggle, the application SHALL switch the entire page
   between light and dark color schemes immediately. *(FR-5.1, AC-5.1)*

2. WHEN the page is reloaded, the application SHALL restore the previously selected theme
   from Local Storage immediately on load with no visible flash. The theme SHALL be applied
   by `js/script.js` using code that runs before `DOMContentLoaded`, and no inline JavaScript
   SHALL be present in `index.html`. *(FR-5.2, AC-5.2)*

3. Both the light and dark themes SHALL maintain sufficient color contrast for readability,
   targeting WCAG AA (4.5:1 for normal text, 3:1 for large text). *(AC-5.3)*

---

### Requirement 6: Technical Constraints

**User Story:** As a project reviewer, I want the application to follow the required
technology and folder constraints, so that it complies with the coding camp brief.

#### Acceptance Criteria

1. The application SHALL be built using HTML5, CSS3, and Vanilla JavaScript (ES6+) only.
   No external libraries, frameworks (e.g., React, Vue), or build tools SHALL be used. *(TC-1, NFR-5)*

2. All client-side data SHALL be persisted exclusively using the browser `localStorage` API.
   No cookies, `sessionStorage`, IndexedDB, or server-side storage SHALL be used. *(TC-2, NFR-6)*

3. The application SHALL function correctly in the current stable release of Chrome, Firefox,
   Edge, and Safari. *(TC-3, NFR-4)*

4. The project SHALL use exactly the following structure: `index.html` at the root,
   a `css/` folder, a `js/` folder, `README.md`, and the `.kiro/` spec folder committed to
   the repository. *(TC-4)*

5. There SHALL be exactly one CSS file (`css/style.css`) and exactly one JavaScript file
   (`js/script.js`). No additional stylesheets or scripts SHALL be present. *(TC-5)*

6. All JavaScript SHALL reside in `js/script.js`. No `<script>` tags containing code SHALL
   be present in `index.html`. Event handlers SHALL NOT be attached via HTML attributes
   (e.g., `onclick`, `onchange`). *(TC-6)*

---

### Requirement 7: Quality Requirements

**User Story:** As a dashboard user, I want a simple, responsive, fast, and readable
interface, so that the application is easy to use.

#### Acceptance Criteria

1. The interface SHALL be clean and minimal, requiring no complex setup or configuration from
   the user. *(NFR-1)*

2. The application SHALL load in under 2 seconds on a standard connection and SHALL respond
   to user interactions with no noticeable lag when updating data. *(NFR-2)*

3. The interface SHALL use a clear visual hierarchy, readable typography, and a user-friendly
   aesthetic. *(NFR-3)*

4. WHEN the viewport width is 768 px or wider, the dashboard SHALL display widgets in a
   two-column grid layout. WHEN the viewport width is below 768 px, the dashboard SHALL
   collapse to a single-column stacked layout. *(NFR-3)*

---

## Glossary

**Client-side**
Code or data that runs and is stored entirely within the user's web browser, with no
communication to a remote server. This application is entirely client-side.

**Local Storage**
A browser Web Storage API (`window.localStorage`) that allows web pages to store key–value
pairs persistently on the user's device. Data saved to Local Storage survives page reloads
and browser restarts until explicitly cleared.

**MVP (Minimum Viable Product)**
The smallest set of features that satisfies the core requirements of the project. For this
dashboard, the MVP includes the greeting, focus timer, to-do list, quick links, and the three
selected challenges.

**Pomodoro**
A time-management technique that uses a 25-minute focused work interval followed by a short
break. The focus timer in this application implements a single 25-minute Pomodoro session.

**Quick Link**
A user-saved URL paired with a display label, stored in Local Storage and rendered as a
clickable card that opens the target website in a new browser tab.

**Vanilla JavaScript**
Plain JavaScript written without any external libraries or frameworks (e.g., no jQuery,
React, or Vue). All interactivity in this application is implemented in Vanilla JavaScript.
