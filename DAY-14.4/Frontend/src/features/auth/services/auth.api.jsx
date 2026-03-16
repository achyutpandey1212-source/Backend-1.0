import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  withCredentials: true,
});

export async function register(username, email, password) {
  try {
    const response = await api.post("/register", {
      username,
      email,
      password,
    });

    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function login(username, password) {
  try {
    const response = await api.post("/login", {
      username,
      password,
    });

    return response.data;
  } catch (err) {
    throw err;
  }
}

export async function getMe() {
  const response = await api.get("/get-me");
  return response.data;
}

export async function logout() {
  const response = await api.post("/logout");
  return response.data;
}

export async function searchUsers(query) {
  const response = await api.get(`/search?query=${encodeURIComponent(query)}`);
  return response.data;
}
