import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000"
});

export const fetchHabits = () => API.get("/habits");
export const createHabit = (name) => API.post("/habits", { name });
export const toggleToday = (id) =>
  API.post(`/habits/${id}/toggle`);
