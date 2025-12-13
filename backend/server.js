const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Temporary in-memory storage (DB later)
let habits = [];

// Get all habits
app.get("/habits", (req, res) => {
  res.json(habits);
});

// Create a habit
app.post("/habits", (req, res) => {
  const habit = {
    id: Date.now(),
    name: req.body.name,
    completed: false
  };
  habits.push(habit);
  res.status(201).json(habit);
});

// Toggle completion
app.put("/habits/:id", (req, res) => {
  const habit = habits.find(h => h.id == req.params.id);
  if (habit) {
    habit.completed = !habit.completed;
    res.json(habit);
  } else {
    res.status(404).json({ message: "Habit not found" });
  }
});

app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
