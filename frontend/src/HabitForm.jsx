import { useState } from "react";

export default function HabitForm({ onAdd }) {
  const [name, setName] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd(name);
    setName("");
  };

  return (
    <form onSubmit={submit}>
      <input
        placeholder="New habit"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button>Add</button>
    </form>
  );
}
