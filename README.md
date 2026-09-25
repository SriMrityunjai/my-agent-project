# Ohio Fireflies

A cozy browser game set on an autumn night in Ohio. Catch glowing fireflies drifting through the dark before they fade away.

## How to Play

Fireflies appear and float downward through the night sky, glowing softly. Click or tap a firefly to catch it before it fades. Each round lasts **45 seconds**.

### Scoring

Each firefly has a lifecycle: it fades in, reaches peak brightness, then dims and disappears. Points earned depend on when you catch it:

- **At peak glow (bright):** up to **100 points**
- **While fading in or out:** fewer points proportional to brightness
- **After it fades:** gone forever, 0 points

Catch fireflies at their brightest for the highest score. After the round ends, enter your name to save your score to the persistent high-score table.

## Setup and Running

Requires **Node.js 22**.

```bash
npm install
npm start
```

The server listens on `http://127.0.0.1:3000` by default. Set the `PORT` environment variable to choose a different port:

```bash
PORT=8080 npm start
```

Open the server URL in a browser to play.

## API

- `GET /api/scores` — returns the top 10 scores as JSON
- `POST /api/scores` — saves a score; body: `{"name": "string", "score": integer}`
  - Name: 1-20 characters, required
  - Score: integer 0-99999, required
  - Returns 201 on success, 400 with `{"error": "..."}` on invalid input

Scores are stored in a SQLite database (`scores.db`) that persists across restarts.

## Hosting

- All page URLs are relative (works behind a reverse proxy with a path prefix)
- No external CDN, fonts, or scripts — fully self-contained
- No cookies, localStorage, or session storage required
- CORS enabled for cross-origin requests
- Form submission handled via JavaScript fetch (no native form navigation)

## Project Structure

```
server.js          — Express server: API routes + static file serving + SQLite persistence
public/index.html  — Complete game: canvas rendering, input handling, score submission
package.json       — Dependencies (express, better-sqlite3, cors)
```
