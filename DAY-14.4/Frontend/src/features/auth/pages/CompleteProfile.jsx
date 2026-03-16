import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import axios from "axios";
import "../styles/profile.scss";

const CompleteProfile = () => {
  const { setUser, user } = useAuth();
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState("");
  const [fileError, setFileError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [localPreview, setLocalPreview] = useState("");
  const fileInputRef = useRef(null);

  const navigate = useNavigate();
  const fallbackAvatar = user?.profileImage || "";
  const bioMax = 150;

  useEffect(() => {
    return () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    };
  }, [localPreview]);

  const handleFileChange = (file) => {
    setError("");
    setFileError("");

    if (!file) {
      setProfilePic(null);
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
    setProfilePic(file);
  };

  const displayAvatar = localPreview || fallbackAvatar;
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : "IG";
  const isDirty = Boolean(profilePic) || bio.trim().length > 0;
  const bioTooLong = bio.length > bioMax;
  const canSubmit = isDirty && !submitting && !bioTooLong && !fileError;
  const fileName = profilePic?.name || "No file selected";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!profilePic && !bio.trim()) {
      setError("Add a photo or a short bio to continue.");
      return;
    }
    if (bioTooLong) {
      setError(`Bio must be ${bioMax} characters or less.`);
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("profilepic", profilePic);
      formData.append("bio", bio.trim());
      formData.append("isPrivate", isPrivate);

      await axios.post("http://localhost:3000/api/userprofile", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Refresh user data to include hasProfile = true
      const meResponse = await axios.get(
        "http://localhost:3000/api/auth/get-me",
        { withCredentials: true },
      );

      setUser(meResponse.data.user);
      navigate("/feed", { state: { toast: "Profile updated ✅" } });
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Failed to complete profile. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="profile-page complete-profile">
      <section className="profile-header">
        <div className="profile-avatar">
          <div className="profile-avatar-placeholder has-image">
            {displayAvatar ? (
              <img src={displayAvatar} alt="Profile preview" />
            ) : (
              <span className="avatar-initials">{initials}</span>
            )}
          </div>
          <div className="avatar-actions">
            <label
              className={`file-button ${fileError ? "error" : ""}`}
              htmlFor="profilepic"
            >
              {profilePic ? "Change photo" : "Upload photo"}
            </label>
          </div>
          <p className="avatar-hint">JPG/PNG - up to 5MB - 4:5 or 1:1 works best</p>
        </div>

        <div className="profile-info">
          <h2>Complete Your Profile</h2>
          <p className="profile-subtitle">Share a photo with your followers.</p>
          <p className="profile-bio">
            Add a profile picture and bio to start using the app.
          </p>
          <div className="profile-handle">
            Editing as <span>@{user?.username || "user"}</span>
          </div>

          <form className="complete-profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="profilepic">Profile Picture</label>
              <input
                ref={fileInputRef}
                id="profilepic"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  handleFileChange(e.target.files?.[0] || null)
                }
              />
              <div className={`file-row ${fileError ? "file-error" : ""}`}>
                <span className="file-icon">IMG</span>
                <span className="file-name" title={fileName}>
                  {fileName}
                </span>
                <label className="file-button mini" htmlFor="profilepic">
                  Change
                </label>
              </div>
              {profilePic && (
                <div className="file-thumb">
                  <img src={localPreview} alt="Selected profile" />
                </div>
              )}
              <p className="helper-text">
                JPG/PNG - up to 5MB - 4:5 or 1:1 works best
              </p>
              {fileError && <p className="error-text">{fileError}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                rows="4"
                value={bio}
                className={bioTooLong ? "input-error" : ""}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell people a bit about yourself..."
              />
              <div className="char-counter">
                {bio.length}/{bioMax}
              </div>
              {bioTooLong && (
                <p className="error-text">Bio must be {bioMax} characters or less.</p>
              )}
            </div>

            <div className="form-group privacy-toggle">
              <div>
                <h4>Private account</h4>
                <p>Only approved followers can see your photos and posts.</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
                <span className="slider" />
              </label>
            </div>

            {error && <p className="error-text">{error}</p>}

            <button
              type="submit"
              className="profile-btn primary"
              disabled={!canSubmit}
            >
              {submitting ? "Saving..." : "Save Profile"}
            </button>
            <button
              type="button"
              className="link-button skip-button"
              onClick={() => navigate("/")}
            >
              Skip for now
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default CompleteProfile;

