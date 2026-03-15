import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import axios from "axios";
import "../styles/profile.scss";

const CompleteProfile = () => {
  const { setUser } = useAuth();
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!profilePic) {
      setError("Profile picture is required");
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
      navigate("/feed");
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
    <main className="profile-page">
      <section className="profile-header">
        <div className="profile-avatar">
          <div className="profile-avatar-placeholder">
            {profilePic ? (
              <span>Preview ready</span>
            ) : (
              <span>Upload photo</span>
            )}
          </div>
        </div>

        <div className="profile-info">
          <h2>Complete Your Profile</h2>
          <p className="profile-bio">
            Add a profile picture and bio to start using the app.
          </p>

          <form className="complete-profile-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="profilepic">Profile Picture</label>
              <input
                id="profilepic"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setProfilePic(e.target.files?.[0] || null)
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                rows="3"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell people a bit about yourself..."
              />
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                />
                Private account
              </label>
            </div>

            {error && <p className="error-text">{error}</p>}

            <button
              type="submit"
              className="profile-btn primary"
              disabled={submitting}
            >
              {submitting ? "Saving..." : "Save Profile"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default CompleteProfile;

