# Career Transition Dashboard

A lightweight static web app for tracking a 6-month transition toward:
- IT Project Coordinator / Project Manager track
- IT Support / Systems / Analyst track
- Long-term public-sector / government technology roles

## Features
- Daily / Weekly / Monthly views
- Persistent task completion using browser localStorage
- Persistent checklist state
- Persistent notes on each task
- Progress by workstream
- Roadmap data separated into `roadmap.json` for easy updates
- Mobile-friendly layout

## Run locally
Because the app loads `roadmap.json`, serve the folder through a small local web server rather than double-clicking `index.html`.

Example:
```bash
python3 -m http.server 8000
```
Then visit http://localhost:8000

## Host on GitHub Pages
1. Create a GitHub repository.
2. Upload all files in this folder.
3. In GitHub repository settings, enable Pages from the main branch/root.
4. The dashboard will be available at your GitHub Pages URL.

## Updating the roadmap
Most roadmap changes only require editing `roadmap.json`.
The UI code lives in `index.html`, `style.css`, and `app.js`.

## Important
Progress and notes are stored in the browser/device using localStorage. They are not synced between devices yet.
A later version can add cloud persistence if desired.
