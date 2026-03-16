import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const [fileError, setFileError] = useState("");
  const [localPreview, setLocalPreview] = useState("");
  const fileInputRef = useRef(null);
  const captionMax = 2200;

  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

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

      await axios.post(`${API_BASE_URL}/api/posts/`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/feed", { state: { toast: "Your post is live ✅" } });
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
    const file = e.target.files?.[0] || null;
    setFileError("");

    if (!file) {
      setImage(null);
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
      setLocalPreview("");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setFileError("Please select a valid image file (JPG/PNG).");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError("Image must be 5MB or smaller.");
      return;
    }

    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }
    const previewUrl = URL.createObjectURL(file);
    setLocalPreview(previewUrl);
    setImage(file);
    setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const canSubmit =
    !submitting &&
    Boolean(title.trim()) &&
    Boolean(caption.trim()) &&
    Boolean(image) &&
    !fileError;

  const fileName = image?.name || "No file selected";

  return (
    <main className="create-post-page">
      <section className="create-post-card">
        <h1>Create New Post</h1>
        <p className="create-post-subtitle">
          Share a moment with your followers.
        </p>

        <form onSubmit={handleSubmit} className="create-post-form">
          <div className="form-group">
            <label htmlFor="image">Image</label>
            <input
              ref={fileInputRef}
              id="image"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            <div className={`file-row ${fileError ? "file-error" : ""}`}>
              <span className="file-icon">IMG</span>
              <span className="file-name" title={fileName}>
                {fileName}
              </span>
              <label className="file-button mini" htmlFor="image">
                {image ? "Change" : "Add"}
              </label>
            </div>
            {localPreview && (
              <div className="file-thumb">
                <span className="thumb-label">Preview</span>
                <img src={localPreview} alt="Selected post" />
              </div>
            )}
            <p className="helper-text">
              JPG/PNG - up to 5MB - 4:5 or 1:1 works best
            </p>
            {errors.image && <p className="error-text">{errors.image}</p>}
            {fileError && <p className="error-text">{fileError}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="title">Post title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your post a short title"
            />
            {errors.title && <p className="error-text">{errors.title}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="caption">Caption</label>
            <textarea
              id="caption"
              rows="5"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              maxLength={captionMax}
              placeholder="Write a caption... #anime #edit #delhi"
            />
            <div className="char-counter">
              {caption.length}/{captionMax}
            </div>
            {errors.caption && <p className="error-text">{errors.caption}</p>}
          </div>

          {apiError && <p className="error-text api-error">{apiError}</p>}

          <button
            type="submit"
            className="primary-btn"
            disabled={!canSubmit}
          >
            {submitting ? (
              <>
                <span className="btn-spinner" aria-hidden="true" />
                Posting...
              </>
            ) : (
              "Post"
            )}
          </button>
          <button type="button" className="link-button subtle-link" disabled>
            Save draft (coming soon)
          </button>
        </form>
      </section>
    </main>
  );
};

export default CreatePost;

