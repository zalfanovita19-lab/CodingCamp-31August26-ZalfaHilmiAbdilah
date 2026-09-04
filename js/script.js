/* ============================================================
   js/script.js — To-Do List Life Dashboard
   All JavaScript for the application lives here.
   No inline scripts or on* attributes exist in index.html.
   ============================================================ */

/* ── TASK-14 (Step 1): Early theme restore ────────────────────
   Runs immediately (top-level, before DOMContentLoaded).
   The <script> tag is at the end of <body>, so <html> is in
   the DOM and data-theme is applied before the first CSS paint,
   preventing any light/dark flash on reload.
   ──────────────────────────────────────────────────────────── */
(function () {
  var saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') {
    document.documentElement.setAttribute('data-theme', saved);
  }
}());

/* ============================================================
   Everything below runs after the DOM is fully parsed.
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* ──────────────────────────────────────────────────────────
     TASK-6 — DOM References
     ────────────────────────────────────────────────────────── */

  // Greeting
  var greetingText = document.getElementById('greeting-text');
  var dateText     = document.getElementById('date-text');
  var clockText    = document.getElementById('clock-text');
  var nameInput    = document.getElementById('name-input');
  var nameSaveBtn  = document.getElementById('name-save');

  // Timer
  var timerDisplay      = document.getElementById('timer-display');
  var btnStart          = document.getElementById('btn-start');
  var btnStop           = document.getElementById('btn-stop');
  var btnReset          = document.getElementById('btn-reset');
  var timerStatus       = document.getElementById('timer-status');
  var timerNotification = document.getElementById('timer-notification');

  // To-Do
  var taskInput    = document.getElementById('task-input');
  var btnAddTask   = document.getElementById('btn-add-task');
  var todoWarning  = document.getElementById('todo-warning');
  var taskListEl   = document.getElementById('task-list');

  // Quick Links
  var linkLabelInput = document.getElementById('link-label-input');
  var linkUrlInput   = document.getElementById('link-url-input');
  var btnAddLink     = document.getElementById('btn-add-link');
  var linksError     = document.getElementById('links-error');
  var linksContainer = document.getElementById('links-container');

  // Theme Toggle
  var themeToggleBtn = document.getElementById('theme-toggle');

  /* ──────────────────────────────────────────────────────────
     TASK-6 — Utility Functions
     ────────────────────────────────────────────────────────── */

  /**
   * Load a JSON value from localStorage.
   * Returns `fallback` if the key is missing or the value is invalid JSON.
   */
  function loadFromStorage(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  /**
   * Serialize a value to JSON and write it to localStorage.
   */
  function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  /**
   * Generate a simple unique ID (timestamp + random suffix).
   * Sufficient for a local-only, single-user application.
   */
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
  }

  /* ──────────────────────────────────────────────────────────
     TASK-7 — Greeting Widget: Clock, Date, and Greeting
     ────────────────────────────────────────────────────────── */

  var userName = '';

  /**
   * Return the greeting phrase for a given hour (0–23).
   */
  function getGreeting(hour) {
    if (hour >= 5  && hour < 12) return 'Good Morning';
    if (hour >= 12 && hour < 18) return 'Good Afternoon';
    if (hour >= 18 && hour < 22) return 'Good Evening';
    return 'Good Night';
  }

  /**
   * Pad a number to at least two digits.
   */
  function pad(n) {
    return String(n).padStart(2, '0');
  }

  /**
   * Update the greeting heading, date line, and live clock.
   * Called every second via setInterval.
   */
  function updateClock() {
    var now    = new Date();
    var hour   = now.getHours();
    var phrase = getGreeting(hour);

    // Greeting (with optional name)
    var displayName = userName ? (', ' + userName + '!') : '!';
    greetingText.textContent = phrase + displayName;

    // Date — e.g. "Friday, September 4, 2026"
    dateText.textContent = now.toLocaleDateString('en-US', {
      weekday: 'long',
      year:    'numeric',
      month:   'long',
      day:     'numeric'
    });

    // Time — HH:MM:SS
    clockText.textContent =
      pad(hour) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
  }

  /* ──────────────────────────────────────────────────────────
     TASK-8 — Greeting Widget: Custom Name
     ────────────────────────────────────────────────────────── */

  /**
   * Load saved name from localStorage and pre-fill the input.
   */
  function initGreeting() {
    var saved = localStorage.getItem('userName');
    if (saved) {
      userName = saved;
      nameInput.value = saved;
    }
    // Start clock immediately, then tick every second
    updateClock();
    setInterval(updateClock, 1000);
  }

  // Save name on button click
  nameSaveBtn.addEventListener('click', function () {
    var trimmed = nameInput.value.trim();
    if (trimmed) {
      localStorage.setItem('userName', trimmed);
      userName = trimmed;
    } else {
      localStorage.removeItem('userName');
      userName = '';
    }
    updateClock();
  });

  // Also save on Enter key in the name input
  nameInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') nameSaveBtn.click();
  });

  /* ──────────────────────────────────────────────────────────
     TASK-9 — Focus Timer
     ────────────────────────────────────────────────────────── */

  var totalSeconds = 1500; // 25 minutes
  var intervalId   = null;

  /**
   * Format seconds as MM:SS with zero-padding.
   */
  function formatTime(seconds) {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return pad(m) + ':' + pad(s);
  }

  /**
   * Update the timer display element.
   */
  function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(totalSeconds);
  }

  function setTimerStatus(text) {
    timerStatus.textContent = text;
  }

  function startTimer() {
    // Guard: already running
    if (intervalId !== null) return;
    // Guard: timer already finished — must Reset before starting again
    if (totalSeconds === 0) return;

    // Hide any previous completion notification
    timerNotification.classList.add('hidden');

    intervalId = setInterval(function () {
      totalSeconds -= 1;
      // Clamp: never go below zero
      if (totalSeconds < 0) totalSeconds = 0;
      updateTimerDisplay();

      if (totalSeconds === 0) {
        stopTimer();
        // Show in-page completion notification
        timerNotification.classList.remove('hidden');
        setTimerStatus('Complete');
      }
    }, 1000);

    setTimerStatus('Running');
  }

  function stopTimer() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    // Only update status to "Paused" if timer is not complete
    if (totalSeconds > 0) {
      setTimerStatus('Paused');
    }
  }

  function resetTimer() {
    stopTimer();
    totalSeconds = 1500;
    updateTimerDisplay();
    timerNotification.classList.add('hidden');
    setTimerStatus('Ready');
  }

  function initTimer() {
    updateTimerDisplay();
    btnStart.addEventListener('click', startTimer);
    btnStop.addEventListener('click', stopTimer);
    btnReset.addEventListener('click', resetTimer);
  }

  /* ──────────────────────────────────────────────────────────
     TASK-10 — To-Do List: Core CRUD
     TASK-11 — To-Do List: Inline Edit
     TASK-12 — Duplicate Prevention
     ────────────────────────────────────────────────────────── */

  var tasks = loadFromStorage('tasks', []);

  function saveTasks() {
    saveToStorage('tasks', tasks);
  }

  /**
   * TASK-12: Shared duplicate checker.
   * Returns true if any task (excluding excludeId) has the same
   * text (case-insensitive, trimmed) as the provided text.
   */
  function isDuplicate(text, excludeId) {
    var normalised = text.trim().toLowerCase();
    return tasks.some(function (t) {
      return t.id !== excludeId &&
             t.text.trim().toLowerCase() === normalised;
    });
  }

  /**
   * Show a warning message in the to-do warning area.
   */
  function showTodoWarning(message) {
    todoWarning.textContent = message;
    todoWarning.classList.remove('hidden');
  }

  function hideTodoWarning() {
    todoWarning.textContent = '';
    todoWarning.classList.add('hidden');
  }

  /**
   * Render the full task list from the in-memory `tasks` array.
   * All user text is written via textContent — never innerHTML.
   */
  function renderTasks() {
    // Clear existing list items
    while (taskListEl.firstChild) {
      taskListEl.removeChild(taskListEl.firstChild);
    }

    tasks.forEach(function (task) {
      var li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');
      li.setAttribute('data-id', task.id);

      // Checkbox
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = task.completed;
      checkbox.setAttribute('aria-label', 'Mark task complete');
      checkbox.addEventListener('change', function () {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks();
      });

      // Task text span
      var span = document.createElement('span');
      span.className = 'task-text';
      span.textContent = task.text;

      // Action buttons container
      var actions = document.createElement('div');
      actions.className = 'task-actions';

      // Edit button
      var editBtn = document.createElement('button');
      editBtn.className = 'btn btn-secondary btn-small';
      editBtn.textContent = 'Edit';
      editBtn.setAttribute('aria-label', 'Edit task');
      editBtn.addEventListener('click', function () {
        editTask(task.id, li);
      });

      // Delete button
      var deleteBtn = document.createElement('button');
      deleteBtn.className = 'btn btn-danger btn-small';
      deleteBtn.textContent = 'Delete';
      deleteBtn.setAttribute('aria-label', 'Delete task');
      deleteBtn.addEventListener('click', function () {
        tasks = tasks.filter(function (t) { return t.id !== task.id; });
        saveTasks();
        renderTasks();
      });

      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);

      li.appendChild(checkbox);
      li.appendChild(span);
      li.appendChild(actions);

      taskListEl.appendChild(li);
    });
  }

  /**
   * TASK-11: Switch a task list item into inline edit mode.
   */
  function editTask(id, li) {
    var task = tasks.find(function (t) { return t.id === id; });
    if (!task) return;

    // Replace text span with an input
    var span = li.querySelector('.task-text');
    var editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'task-edit-input';
    editInput.value = task.text;
    editInput.setAttribute('aria-label', 'Edit task text');
    editInput.maxLength = 200;
    li.replaceChild(editInput, span);

    // Replace action buttons with Save + Cancel
    var actions = li.querySelector('.task-actions');
    while (actions.firstChild) {
      actions.removeChild(actions.firstChild);
    }

    var saveBtn = document.createElement('button');
    saveBtn.className = 'btn btn-primary btn-small';
    saveBtn.textContent = 'Save';
    saveBtn.setAttribute('aria-label', 'Save edited task');

    var cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn btn-secondary btn-small';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.setAttribute('aria-label', 'Cancel edit');

    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);

    // Focus the edit input
    editInput.focus();
    editInput.select();

    // Save handler
    function doSave() {
      var newText = editInput.value.trim();

      if (!newText) {
        showTodoWarning('Task text cannot be empty.');
        editInput.focus();
        return;
      }

      if (isDuplicate(newText, id)) {
        showTodoWarning('A task with that name already exists.');
        editInput.focus();
        return;
      }

      task.text = newText;
      hideTodoWarning();
      saveTasks();
      renderTasks();
    }

    saveBtn.addEventListener('click', doSave);
    cancelBtn.addEventListener('click', function () {
      hideTodoWarning();
      renderTasks();
    });
    editInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter')  doSave();
      if (e.key === 'Escape') { hideTodoWarning(); renderTasks(); }
    });
  }

  /**
   * TASK-10 + TASK-12: Add a new task.
   */
  function addTask() {
    var text = taskInput.value.trim();

    if (!text) return; // silently ignore empty input

    if (isDuplicate(text, null)) {
      showTodoWarning('Task already exists!');
      return;
    }

    hideTodoWarning();
    tasks.push({ id: generateId(), text: text, completed: false });
    saveTasks();
    renderTasks();
    taskInput.value = '';
    taskInput.focus();
  }

  function initTodo() {
    renderTasks();
    btnAddTask.addEventListener('click', addTask);
    taskInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') addTask();
    });
    // Hide warning as user types
    taskInput.addEventListener('input', hideTodoWarning);
  }

  /* ──────────────────────────────────────────────────────────
     TASK-13 — Quick Links
     ────────────────────────────────────────────────────────── */

  var quickLinks = loadFromStorage('quickLinks', []);

  function saveLinks() {
    saveToStorage('quickLinks', quickLinks);
  }

  /**
   * Validate a URL string: must parse correctly AND use http/https.
   * Returns the parsed URL object on success, or null on failure.
   */
  function parseValidUrl(urlString) {
    try {
      var parsed = new URL(urlString);
      if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  function showLinksError(message) {
    linksError.textContent = message;
    linksError.classList.remove('hidden');
  }

  function hideLinksError() {
    linksError.textContent = '';
    linksError.classList.add('hidden');
  }

  /**
   * Render all quick link cards.
   * User text is set via textContent; href is set via setAttribute.
   */
  function renderLinks() {
    // Clear container
    while (linksContainer.firstChild) {
      linksContainer.removeChild(linksContainer.firstChild);
    }

    quickLinks.forEach(function (link) {
      var card = document.createElement('div');
      card.className = 'link-card';

      // Anchor element — opens in new tab safely
      var anchor = document.createElement('a');
      anchor.textContent = link.label;   // safe: no innerHTML
      anchor.setAttribute('href', link.url);
      anchor.target = '_blank';
      anchor.rel    = 'noopener noreferrer';

      // Delete button
      var delBtn = document.createElement('button');
      delBtn.className = 'link-delete-btn';
      delBtn.textContent = '×';
      delBtn.setAttribute('aria-label', 'Remove ' + link.label + ' link');
      delBtn.addEventListener('click', function () {
        quickLinks = quickLinks.filter(function (l) { return l.id !== link.id; });
        saveLinks();
        renderLinks();
      });

      card.appendChild(anchor);
      card.appendChild(delBtn);
      linksContainer.appendChild(card);
    });
  }

  /**
   * Add a new quick link after validating label and URL.
   */
  function addLink() {
    var label = linkLabelInput.value.trim();
    var url   = linkUrlInput.value.trim();

    if (!label || !url) {
      showLinksError('Please enter both a label and a URL.');
      return;
    }

    var parsed = parseValidUrl(url);
    if (!parsed) {
      showLinksError('Please enter a valid http or https URL.');
      return;
    }

    hideLinksError();
    quickLinks.push({ id: generateId(), label: label, url: parsed.href });
    saveLinks();
    renderLinks();
    linkLabelInput.value = '';
    linkUrlInput.value   = '';
    linkLabelInput.focus();
  }

  function initLinks() {
    renderLinks();
    btnAddLink.addEventListener('click', addLink);
    linkUrlInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') addLink();
    });
    linkLabelInput.addEventListener('input', hideLinksError);
    linkUrlInput.addEventListener('input', hideLinksError);
  }

  /* ──────────────────────────────────────────────────────────
     TASK-14 — Light / Dark Mode Toggle
     (Theme was already applied at the top of this file before
     DOMContentLoaded; here we just wire the button.)
     ────────────────────────────────────────────────────────── */

  /**
   * Update the toggle button's icon and aria-label to match
   * the current data-theme attribute.
   */
  function syncThemeButton() {
    var current = document.documentElement.getAttribute('data-theme');
    if (current === 'dark') {
      themeToggleBtn.textContent = '☀️';
      themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      themeToggleBtn.textContent = '🌙';
      themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  function toggleTheme() {
    var current  = document.documentElement.getAttribute('data-theme') || 'light';
    var newTheme = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    syncThemeButton();
  }

  function initTheme() {
    // Ensure button reflects the theme that was set by the top-level IIFE
    syncThemeButton();
    themeToggleBtn.addEventListener('click', toggleTheme);
  }

  /* ──────────────────────────────────────────────────────────
     TASK-6 — Main init: wire everything up
     ────────────────────────────────────────────────────────── */

  function init() {
    initTheme();
    initGreeting();
    initTimer();
    initTodo();
    initLinks();
  }

  init();

}); // end DOMContentLoaded
