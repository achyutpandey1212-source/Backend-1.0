import axiosClient from "./axiosClient";

export const createPost = (caption, imageFile) => {
  const formData = new FormData();
  formData.append("caption", caption);
  formData.append("image", imageFile); // key = multer.single("image")

  return axiosClient.post("/posts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// later: list posts
export const getPosts = () => axiosClient.get("/posts");
