const express = require("express");
const cors = require("cors");
const path = require("path");
const Database = require("better-sqlite3");

const PORT = parseInt(process.env.PORT, 10) || 3000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, "scores.db");

const db = new Database(DB_PATH);
db.pragma("journal_mode = WAL");
db.pragma("synchronous = FULL");
db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    fireflies_caught INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const insertScore = db.prepare(
  "INSERT INTO scores (name, score, fireflies_caught) VALUES (@name, @score, @fireflies_caught)"
);
const topScores = db.prepare(
  "SELECT id, name, score, fireflies_caught, created_at FROM scores ORDER BY score DESC, created_at ASC LIMIT 10"
);

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/scores", (_req, res) => {
  const rows = topScores.all();
  res.json(rows);
});

app.post("/api/scores", (req, res) => {
  const { name, score, fireflies_caught } = req.body;

  if (typeof name !== "string" || name.trim().length === 0) {
    return res.status(400).json({ error: "Name is required and must be a non-empty string." });
  }
  if (name.trim().length > 20) {
    return res.status(400).json({ error: "Name must be 20 characters or fewer." });
  }
  if (typeof score !== "number" || !Number.isInteger(score) || score < 0 || score > 99999) {
    return res.status(400).json({ error: "Score must be an integer between 0 and 99999." });
  }
  if (
    typeof fireflies_caught !== "number" ||
    !Number.isInteger(fireflies_caught) ||
    fireflies_caught < 0 ||
    fireflies_caught > 9999
  ) {
    return res
      .status(400)
      .json({ error: "fireflies_caught must be an integer between 0 and 9999." });
  }

  const trimmedName = name.trim();
  const result = insertScore.run({
    name: trimmedName,
    score,
    fireflies_caught,
  });
  db.pragma("wal_checkpoint(TRUNCATE)");

  res.status(201).json({
    id: result.lastInsertRowid,
    name: trimmedName,
    score,
    fireflies_caught,
  });
});

const server = app.listen(PORT, "0.0.0.0", () => {
  console.log(`Firefly Catcher running on http://localhost:${PORT}`);
});

function shutdown() {
  try { db.pragma("wal_checkpoint(TRUNCATE)"); } catch (_) {}
  try { db.close(); } catch (_) {}
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 1000);
}
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
