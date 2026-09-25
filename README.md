# Ohio Firefly Night

A cozy browser game set on an autumn night in Ohio. Catch glowing fireflies before they fade into the darkness.

## How to Play

Fireflies appear and drift across a starry autumn sky. **Click or tap** a firefly to catch it before it fades away. Each round lasts **60 seconds**.

### Scoring

- Each firefly caught earns **10–50 points** based on its brightness at the moment you catch it.
- A firefly at full glow is worth 50 points; one that has nearly faded is worth closer to 10.
- Fireflies that fade away completely count as escaped — they earn nothing.
- As the round progresses, fireflies spawn faster, giving more chances but demanding quicker reflexes.

Your final score is the total points from all fireflies caught during the round.

## Setup and Run

Requires **Node.js 18+**.

```bash
npm install --production
node server.js
```

The server starts on `http://127.0.0.1:3000` by default. Set the `PORT` environment variable to choose a different port:

```bash
PORT=8080 node server.js
```

Open the server URL in a browser to play.

## API

### `GET /api/scores`

Returns the top 20 scores as a JSON array, ordered by score descending.

### `POST /api/scores`

Submit a score. Body: `{ "name": "string", "score": integer }`.

- **name**: 1–20 characters; letters, digits, spaces, hyphens, underscores, periods.
- **score**: integer, 0–99999.

Returns `201` on success, `400` with `{ "error": "..." }` on invalid input.

## Persistence

Scores are stored in a SQLite database (`scores.db` in the project root, configurable via `DB_PATH`). Data survives server restarts.

## Hosting Notes

- All page URLs are relative — works behind a reverse proxy with a path prefix.
- CORS is enabled for cross-origin requests including preflight.
- No external CDN, fonts, or third-party scripts — everything is self-contained.
- No cookies, localStorage, or sessionStorage required.
- Form submission is handled via JavaScript fetch (no native form navigation).
