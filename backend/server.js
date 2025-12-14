const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const today = () => new Date().toISOString().split("T")[0];

/* ---------------- HABITS ---------------- */

// Create habit
app.post("/habits", async (req, res) => {
  const { name } = req.body;

  const result = await pool.query(
    "INSERT INTO habits (name, created_at) VALUES ($1, $2) RETURNING *",
    [name, today()]
  );

  res.status(201).json(result.rows[0]);
});

// Get all habits with analytics
app.get("/habits", async (req, res) => {
  const habitsResult = await pool.query("SELECT * FROM habits");

  const habits = [];

  for (let habit of habitsResult.rows) {
    const logsResult = await pool.query(
      "SELECT * FROM habit_logs WHERE habit_id = $1",
      [habit.id]
    );

    const logs = logsResult.rows;

    habits.push({
      ...habit,
      completedToday: logs.some(
        l => l.log_date === today() && l.completed
      ),
      streak: calculateStreak(logs),
      consistency: calculateConsistency(logs)
    });
  }

  res.json(habits);
});

// Toggle today completion
app.post("/habits/:id/toggle", async (req, res) => {
  const habitId = Number(req.params.id);

  const existing = await pool.query(
    "SELECT * FROM habit_logs WHERE habit_id=$1 AND log_date=$2",
    [habitId, today()]
  );

  if (existing.rows.length === 0) {
    const result = await pool.query(
      "INSERT INTO habit_logs (habit_id, log_date, completed) VALUES ($1, $2, true) RETURNING *",
      [habitId, today()]
    );
    return res.json(result.rows[0]);
  } else {
    const current = existing.rows[0];
    const result = await pool.query(
      "UPDATE habit_logs SET completed=$1 WHERE id=$2 RETURNING *",
      [!current.completed, current.id]
    );
    return res.json(result.rows[0]);
  }
});

/* -------- Analytics Functions -------- */

function calculateStreak(logs) {
  const completedDates = logs
    .filter(l => l.completed)
    .map(l => l.log_date)
    .sort()
    .reverse();

  let streak = 0;
  let current = today();

  for (let d of completedDates) {
    if (d === current) {
      streak++;
      current = previousDate(current);
    } else break;
  }
  return streak;
}

function calculateConsistency(logs) {
  if (logs.length === 0) return 0;
  const completed = logs.filter(l => l.completed).length;
  return Math.round((completed / logs.length) * 100);
}

function previousDate(date) {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
