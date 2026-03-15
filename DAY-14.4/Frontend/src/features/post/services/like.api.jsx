import axios from "axios";

const likeApi = axios.create({
  baseURL: "http://localhost:3000/api",
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

