import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api/bookmarks`,
  withCredentials: true,
});

export async function getMyBookmarks() {
  const response = await api.get("/me");
  return response.data;
}

export async function addBookmark(postId) {
  const response = await api.post(`/${postId}`);
  return response.data;
}

export async function removeBookmark(postId) {
  const response = await api.delete(`/${postId}`);
  return response.data;
}
