import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/posts`,
    withCredentials: true
})

export async function getFeed(page = 1, limit = 3){
    const response = await api.get(`/feed?page=${page}&limit=${limit}`)
    return response.data
}

export async function updatePost(postId, payload) {
    const response = await api.patch(`/${postId}`, payload)
    return response.data
}

export async function deletePost(postId) {
    const response = await api.delete(`/${postId}`)
    return response.data
}
