export default function HabitList({ habits, onToggle }) {
  return (
    <ul>
      {habits.map(h => (
        <li key={h.id}>
          <input
            type="checkbox"
            checked={h.completed}
            onChange={() => onToggle(h.id)}
          />
          {h.name}
        </li>
      ))}
    </ul>
  );
}
