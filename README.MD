# Task Management System

A simple and intuitive Task Management System built to help users organize their work, track progress, and easily identify priority levels through color-coded indicators.

## Features
1. Task Creation (Input)
-  Dynamic Interface: Users can add or remove multiple task rows dynamically before submitting.
-  Data Fields:
    -  Title: Name of the task.
    -  Due Date: Deadline for completion.
    -  Estimated Hours: Effort required (1-10 scale).
    -  Importance: Priority level (1-10 scale).
    -  Dependencies: List of Task IDs (supported by backend logic).

2. Task Analysis (Output)
-  Instant Scoring: Upon submission, tasks are processed by the backend algorithm.
-  Visual Ranking: Tasks are displayed as cards, sorted by their calculated score.
-  Priority Indicators: The top 3 tasks are visually highlighted:
    - Red Shadow (Urgent focus)
    - Orange Shadow
    - Green Shadow
-  Detailed Breakdown: Each card displays the raw data plus the final calculated Priority Score.

3. Strategy Selection
-  Real-time Re-ranking: Users can switch strategies via a dropdown to re-sort existing tasks without re-entering data.
-  Contextual Reasoning: The system provides a text explanation for *why* a task got its score based on the chosen strategy (e.g., *"Urgency=8, Importance=9 → Final Score=8.6"*).


## Tech Stack

1. Frontend:
- HTML5 / CSS3
- Vanilla JavaScript (DOM Manipulation, Async/Await Fetch)
- FontAwesome (UI Icons)

2. Backend:
- Python 3
- Django & Django REST Framework (DRF)
- SQLite Database

## API Endpoints

### 1. Analyze Tasks (POST)
- Endpoint: `/api/tasks/analyze/`
- Description: Accepts raw task data, runs the "Balance" algorithm, saves to DB, and returns sorted results.
- Body Example: 
    ```json
    [
      {
        "title": "Fix Bug",
        "due_date": "2024-12-01",
        "estimated_hours": 2,
        "importance": 8,
        "score": 7.23
      }
    ]
    ```

### 2. Get Suggestions (GET)
- Endpoint: `/api/tasks/suggest/?strategy={type}`
- Parameters: `strategy` (Options: `sb`, `fw`, `hi`, `dd`)
- Description: Re-calculates scores for all stored tasks based on the requested strategy and returns the top 3 with reasoning.


## Setup Instructions
1.  **Clone the Repository** and navigate to the project folder.

2.  **Backend Setup:**
    ```bash
    cd backend
    pip install django djangorestframework
    python manage.py migrate
    python manage.py runserver
    ```

3.  **Frontend Setup:**
    * Navigate to the `frontend` folder.
    * Open `index.html` in your browser.
    * *Note: If using VS Code Live Server, ensure `settings.json` ignores `.sqlite3` files to prevent auto-reloading loop.*

## Algorithm Logic

The `PriorityCalculator` class normalizes inputs to ensure fair scoring:
* **Urgency:** `(Due Date - Today)`. Closer dates = Higher score.
* **Effort:** Inverted logic. Lower hours = Higher score.
* **Importance:** Direct mapping (High input = High score).

*Example Formula (Smart Balance):*
`Score = (Urgency * 0.4) + (Importance * 0.4) + (Effort * 0.15) + (Dependencies * 0.05)`


## screeshots

### Dashboard Page
![Dashboard Page](https://github.com/psawner/Task-Manager/blob/main/screenshots/dashboard.png)

- single task input
![Dashboard1 Page](https://github.com/psawner/Task-Manager/blob/main/screenshots/dashboard1.png)
![Dashboard2 Page](https://github.com/psawner/Task-Manager/blob/main/screenshots/dashboard2.png)

- multiple tasks input
![Dashboard3 Page](https://github.com/psawner/Task-Manager/blob/main/screenshots/dashboard3.png)
![Dashboard4 Page](https://github.com/psawner/Task-Manager/blob/main/screenshots/dashboard4.png)
![Dashboard5 Page](https://github.com/psawner/Task-Manager/blob/main/screenshots/dashboard5.png)
![Dashboard6 Page](https://github.com/psawner/Task-Manager/blob/main/screenshots/dashboard6.png)
![Dashboard7 Page](https://github.com/psawner/Task-Manager/blob/main/screenshots/dashboard7.png)
![Dashboard8 Page](https://github.com/psawner/Task-Manager/blob/main/screenshots/dashboard8.png)

- small screen-size
![Responsive](https://github.com/psawner/Task-Manager/blob/main/screenshots/responsive.png)
![Responsive1](https://github.com/psawner/Task-Manager/blob/main/screenshots/responsive1.png)