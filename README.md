# To-Do List Life Dashboard

A personal productivity dashboard built as a standalone web page.
No frameworks, no backend, no install — just open `index.html` in any modern browser.

---

## Live Demo

**GitHub Pages URL:** https://zalfanovita19-lab.github.io/CodingCamp-31August26-ZalfaHilmiAbdilah/

---

## Features

- **Greeting** — displays the current date and a live clock updated every second, with a time-based greeting phrase (Good Morning / Afternoon / Evening / Night).
- **Custom Name** *(Challenge)* — set your name once; it is saved in Local Storage and shown in the greeting on every visit.
- **Focus Timer** — 25-minute Pomodoro-style countdown with Start, Stop, Resume, and Reset controls plus an in-page completion notification.
- **To-Do List** — add, complete (checkbox), inline-edit, and delete tasks; all data persisted in Local Storage.
- **Prevent Duplicate Tasks** *(Challenge)* — adding or editing a task to match an existing one (case-insensitive) is blocked with a visible warning.
- **Quick Links** — save favourite URLs with a label; only valid `http`/`https` addresses accepted; links open in a new tab with `noopener noreferrer`.
- **Light / Dark Mode** *(Challenge)* — toggle between themes; preference is saved in Local Storage and restored on reload with no flash.
- **Responsive layout** — two-column grid on desktop (≥ 768 px), single-column stack on mobile.

---

## Project Structure

```
CodingCamp-31August26-ZalfaHilmiAbdilah/
├── index.html          ← page structure and widget markup
├── css/
│   └── style.css       ← all styling, themes, layout, responsive rules
├── js/
│   └── script.js       ← all application logic and Local Storage interaction
├── README.md
└── .kiro/
    └── specs/
        └── todo-dashboard/
            ├── requirements.md
            ├── design.md
            └── tasks.md
```

---

## How to Run Locally

1. Clone or download this repository.
2. Open `index.html` directly in any modern browser (Chrome, Firefox, Edge, Safari).
3. No server, build step, or installation is required.

---

## How to Deploy (GitHub Pages)

1. Push this repository to GitHub.
2. Open the repository on GitHub → **Settings** → **Pages**.
3. Under **Source**, select **Deploy from a branch**, choose the **main** branch and **/ (root)** folder, then click **Save**.
4. Wait 1–3 minutes for the build to complete.
5. Open the URL shown in the Pages banner (e.g., `https://<username>.github.io/<repo-name>/`).
6. Copy the live URL and add it to the **Live Demo** section above.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Structure | HTML5 |
| Styling | CSS3 (custom properties, CSS Grid, Flexbox) |
| Logic | Vanilla JavaScript (ES6+) |
| Persistence | Browser Local Storage API |

---

## Author

**Zalfa Hilmi Abdilah**
CodingCamp — August 31, 2026 cohort
