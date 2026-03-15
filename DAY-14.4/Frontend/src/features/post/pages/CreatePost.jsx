import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/posts";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!caption.trim()) {
      newErrors.caption = "Caption is required";
    }

    if (!image) {
      newErrors.image = "Image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("caption", caption.trim());
      formData.append("image", image);

      await axios.post(`${API_BASE_URL}/`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/feed");
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to create post. Please try again.";
      setApiError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setImage(file || null);
    if (file) {
      setErrors((prev) => ({ ...prev, image: undefined }));
    }
  };

  return (
    <main className="create-post-page">
      <section className="create-post-card">
        <h1>Create New Post</h1>

        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="image">Image</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {errors.image && <p className="error-text">{errors.image}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a title"
            />
            {errors.title && <p className="error-text">{errors.title}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="caption">Caption</label>
            <textarea
              id="caption"
              rows="3"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write a caption..."
            />
            {errors.caption && <p className="error-text">{errors.caption}</p>}
          </div>

          {apiError && <p className="error-text api-error">{apiError}</p>}

          <button
            type="submit"
            className="primary-btn"
            disabled={submitting}
          >
            {submitting ? "Posting..." : "Post"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default CreatePost;

