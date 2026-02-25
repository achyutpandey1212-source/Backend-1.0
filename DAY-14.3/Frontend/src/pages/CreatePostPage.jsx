import { useState } from "react";
import { createPost } from "../api/postApi";

function CreatePostPage() {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [uploadInfo, setUploadInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return setError("Select an image first");

    setError("");
    setLoading(true);
    try {
      const res = await createPost(caption, image);
      setUploadInfo(res.data);
      console.log("Created post:", res.data);
      setCaption("");
      setImage(null);
    } catch (err) {
      setError(err.response?.data?.message || "Post failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1 className="form-title">Create new post</h1>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Caption</label>
          <textarea
            className="textarea"
            rows={3}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption…"
          />
        </div>

        <div className="field">
          <label className="label">Image</label>
          <input
            className="file-input"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Share"}
        </button>
      </form>

      {uploadInfo?.url && (
        <div className="preview">
          <div className="preview-title">Preview</div>
          <img src={uploadInfo.url} alt="" className="preview-img" />
        </div>
      )}
    </div>
  );
}

export default CreatePostPage;
