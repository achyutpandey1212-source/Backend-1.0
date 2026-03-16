import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const likeApi = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

export async function likePost(postId) {
  const response = await likeApi.post(`/${postId}/like`);
  return response.data;
}

export async function unlikePost(postId) {
  const response = await likeApi.delete(`/${postId}/unlike`);
  return response.data;
}

