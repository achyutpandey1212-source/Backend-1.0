import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/bookmarks",
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
