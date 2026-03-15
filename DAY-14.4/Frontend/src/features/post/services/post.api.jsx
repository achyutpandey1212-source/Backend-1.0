import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/api/posts",
    withCredentials: true
})

export async function getFeed({ page = 1, limit = 0 } = {}) {
    const response = await api.get('/feed', {
        params: {
            page,
            limit,
        },
    });
    return response.data;
}

export async function updatePost(postId, payload) {
    const response = await api.patch(`/${postId}`, payload)
    return response.data
}

export async function deletePost(postId) {
    const response = await api.delete(`/${postId}`)
    return response.data
}
