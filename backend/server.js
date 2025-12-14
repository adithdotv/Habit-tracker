const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let habits = [];
let habitLogs = [];

// Utility
const today = () => new Date().toISOString().split("T")[0];

// Create habit
app.post("/habits", (req, res) => {
  const habit = {
    id: Date.now(),
    name: req.body.name,
    createdAt: today()
  };
  habits.push(habit);
  res.status(201).json(habit);
});

// Get all habits with today status + analytics
app.get("/habits", (req, res) => {
  const result = habits.map(habit => {
    const logs = habitLogs.filter(l => l.habitId === habit.id);
    const todayLog = logs.find(l => l.date === today());

    return {
      ...habit,
      completedToday: todayLog?.completed || false,
      streak: calculateStreak(logs),
      consistency: calculateConsistency(logs)
    };
  });
  res.json(result);
});

// Toggle today completion
app.post("/habits/:id/toggle", (req, res) => {
  const habitId = Number(req.params.id);
  let log = habitLogs.find(
    l => l.habitId === habitId && l.date === today()
  );

  if (!log) {
    log = { habitId, date: today(), completed: true };
    habitLogs.push(log);
  } else {
    log.completed = !log.completed;
  }

  res.json(log);
});

/* -------- Analytics Functions -------- */

function calculateStreak(logs) {
  const completedDates = logs
    .filter(l => l.completed)
    .map(l => l.date)
    .sort()
    .reverse();

  let streak = 0;
  let currentDate = today();

  for (let d of completedDates) {
    if (d === currentDate) {
      streak++;
      currentDate = previousDate(currentDate);
    } else {
      break;
    }
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
