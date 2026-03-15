import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

export async function getMyProfile() {
  const response = await api.get("/auth/get-me");
  return response.data;
}

export async function getUserProfile(userId) {
  const response = await api.get(`/userprofile/${userId}`);
  return response.data;
}

export async function getUserPosts(userId) {
  const response = await api.get(`/posts/me/${userId}`);
  return response.data;
}

export async function followUser(targetUserId) {
  const response = await api.post(`/${targetUserId}/follow`);
  return response.data;
}

export async function unfollowUser(unfollowId) {
  const response = await api.delete(`/${unfollowId}/unfollow`);
  return response.data;
}

export async function checkFollowStatus(targetUserId) {
  const response = await api.get(`/status/${targetUserId}`);
  return response.data;
}

export async function getPendingRequests() {
  const response = await api.get('/requests');
  return response.data;
}

export async function acceptFollowRequest(followId) {
  const response = await api.patch(`/${followId}/accept`);
  return response.data;
}

export async function rejectFollowRequest(followId) {
  const response = await api.patch(`/${followId}/reject`);
  return response.data;
}

