import { useEffect, useState } from "react";
import { fetchHabits, createHabit, toggleHabit } from "./api";
import HabitForm from "./HabitForm";
import HabitList from "./HabitList";

export default function App() {
  const [habits, setHabits] = useState([]);

  useEffect(() => {
    loadHabits();
  }, []);

  const loadHabits = async () => {
    const res = await fetchHabits();
    setHabits(res.data);
  };

  const addHabit = async (name) => {
    await createHabit(name);
    loadHabits();
  };

  const toggle = async (id) => {
    await toggleHabit(id);
    loadHabits();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Habit Tracker</h1>
      <HabitForm onAdd={addHabit} />
      <HabitList habits={habits} onToggle={toggle} />
    </div>
  );
}
