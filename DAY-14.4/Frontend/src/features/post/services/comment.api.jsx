import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/posts",
  withCredentials: true,
});

export async function getComments(postId) {
  const response = await api.get(`/${postId}/comments`);
  return response.data;
}

export async function createComment(postId, content) {
  const response = await api.post(`/${postId}/comments`, { content });
  return response.data;
}

export async function replyToComment(postId, parentId, content) {
  const response = await api.post(`/${postId}/comments/${parentId}/replies`, {
    content,
  });
  return response.data;
}

export async function deleteComment(commentId) {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
}
