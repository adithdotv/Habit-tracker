export default function HabitList({ habits, onToggle }) {
  return (
    <ul>
      {habits.map(h => (
        <li key={h.id}>
          <input
            type="checkbox"
            checked={h.completedToday}
            onChange={() => onToggle(h.id)}
          />
          <strong>{h.name}</strong>
          <div>
            🔥 Streak: {h.streak} days | 📊 Consistency: {h.consistency}%
          </div>
        </li>
      ))}
    </ul>
  );
}
