# Firefly Catcher — A Cozy Autumn Night in Ohio

A browser game where you catch glowing fireflies drifting across a meadow on a peaceful Ohio autumn night. Click or tap the fireflies before their glow fades to earn points.

## How to Play

- **Click or tap** on glowing fireflies to catch them
- Each round lasts **45 seconds**
- Fireflies appear, glow brightly, then fade away — catch them while they shine
- **Brighter fireflies = more points**: catching at peak glow earns up to 25 points; a dim firefly earns around 10
- After the round ends, enter your name to save your score to the persistent high-score table

## How Scoring Works

Each firefly has a glow lifecycle: it fades in, reaches peak brightness, then fades out. When you click a firefly, the score is calculated as:

**10 + (glow_brightness × 15)** — rounded to the nearest integer.

At peak glow (~100% brightness), a catch is worth 25 points. A barely-visible firefly is worth ~10. Your total score is the sum of all catches in the round.

## Setup and Running

Requires **Node.js 22**.

```bash
npm install
npm start
```

The server starts on port **3000** by default. Set the `PORT` environment variable to use a different port:

```bash
PORT=8080 npm start
```

Then open the game in your browser at `http://localhost:<port>/`.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Port to bind the server to |
| `DB_PATH` | `./scores.db` | Path to the SQLite database file |

## API

### `GET api/scores`

Returns the top 10 scores as a JSON array, ordered by score descending.

### `POST api/scores`

Submit a new score. Body (JSON):

```json
{
  "name": "string (1-20 chars, required)",
  "score": "integer (0-99999, required)",
  "fireflies_caught": "integer (0-9999, required)"
}
```

Returns `201` on success, `400` with `{ "error": "..." }` on validation failure.

## Hosting Notes

- All URLs used by the game page are **relative** — works behind a reverse proxy with a path prefix
- CORS is enabled for cross-origin requests (supports the CSP sandbox embedding)
- No external CDN, web fonts, or third-party scripts — fully self-contained
- No cookies, localStorage, or sessionStorage required — scores are stored server-side in SQLite
- The server stays in the **foreground** until killed
- Form submission uses `fetch()` with `preventDefault()` — no native form navigation

## Tech Stack

- **Server**: Node.js + Express
- **Database**: SQLite via better-sqlite3 (WAL mode)
- **Frontend**: Vanilla HTML5 Canvas + CSS, served as static files by Express
