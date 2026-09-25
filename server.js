const express = require('express');
const cors = require('cors');
const path = require('path');
const Database = require('better-sqlite3');

const PORT = parseInt(process.env.PORT, 10) || 3000;
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'scores.db');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    score INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

const insertScore = db.prepare('INSERT INTO scores (name, score) VALUES (?, ?)');
const topScores = db.prepare('SELECT name, score, created_at FROM scores ORDER BY score DESC, created_at ASC LIMIT 20');

const app = express();

app.use(cors());
app.options('*', cors());

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const MAX_SCORE = 99999;
const NAME_MAX_LEN = 20;
const NAME_PATTERN = /^[a-zA-Z0-9 _\-\.]{1,20}$/;

app.get('/api/scores', (_req, res) => {
  const rows = topScores.all();
  res.json(rows);
});

app.post('/api/scores', (req, res) => {
  const { name, score } = req.body;

  if (typeof name !== 'string' || !NAME_PATTERN.test(name.trim())) {
    return res.status(400).json({
      error: `Name must be 1-${NAME_MAX_LEN} characters: letters, digits, spaces, hyphens, underscores, periods.`
    });
  }

  if (typeof score !== 'number' || !Number.isInteger(score) || score < 0 || score > MAX_SCORE) {
    return res.status(400).json({
      error: `Score must be an integer between 0 and ${MAX_SCORE}.`
    });
  }

  const trimmed = name.trim();
  insertScore.run(trimmed, score);
  res.status(201).json({ name: trimmed, score });
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Ohio Firefly Night running at http://127.0.0.1:${PORT}`);
});
