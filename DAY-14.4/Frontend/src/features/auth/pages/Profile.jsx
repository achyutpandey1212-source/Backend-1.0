import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.jsx";
import {
  getMyProfile,
  getUserProfile,
  getUserPosts,
  followUser,
  unfollowUser,
  checkFollowStatus,
} from "../services/profile.api.jsx";
import { getMyBookmarks } from "../../post/services/bookmark.api.jsx";
import "../styles/profile.scss";

const Profile = () => {
  const { user } = useAuth();
  const { userId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [followStatus, setFollowStatus] = useState("not_following");
  const [activeTab, setActiveTab] = useState("posts");
  const [savedPosts, setSavedPosts] = useState([]);
  const [savedLoading, setSavedLoading] = useState(false);

  const isOwnProfile =
    !userId || userId === user?._id || userId === user?.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        let profileData;
        if (isOwnProfile) {
          profileData = await getMyProfile();
          setProfile(profileData.user);
        } else {
          profileData = await getUserProfile(userId);
          setProfile(profileData.userProfile);
        }

        const postsData = await getUserPosts(userId || profileData.user._id || profileData.user.id);
        setPosts(postsData.posts || []);

        if (!isOwnProfile) {
          const statusData = await checkFollowStatus(userId);
          setIsFollowing(statusData.status === "accepted");
          setFollowStatus(statusData.status); // "not_following", "pending", "accepted"
        }
      } catch (err) {
        const message =
          err?.response?.data?.message || "Failed to load profile.";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [userId, user, isOwnProfile]);

  useEffect(() => {
    const fetchSaved = async () => {
      if (!isOwnProfile || activeTab !== "saved") return;
      try {
        setSavedLoading(true);
        const data = await getMyBookmarks();
        setSavedPosts(data.posts || []);
      } catch (err) {
        setSavedPosts((prev) => prev);
      } finally {
        setSavedLoading(false);
      }
    };

    fetchSaved();
  }, [activeTab, isOwnProfile]);

  const handleFollowToggle = async () => {
    if (!user || !userId || followLoading) return;

    try {
      setFollowLoading(true);
      if (followStatus === "accepted") {
        await unfollowUser(userId);
        setIsFollowing(false);
        setFollowStatus("not_following");
      } else {
        await followUser(userId);
        // After follow, check status again or assume based on response
        const statusData = await checkFollowStatus(userId);
        setFollowStatus(statusData.status);
        setIsFollowing(statusData.status === "accepted");
      }
    } catch (err) {
      // optionally show error
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="profile-page">
        <h1>Loading profile...</h1>
      </main>
    );
  }

  if (error) {
    return (
      <main className="profile-page">
        <h1>{error}</h1>
      </main>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <main className="profile-page">
      <section className="profile-header">
        <div className="profile-avatar">
          <img src={profile.profileImg || profile.profileImage} alt={profile.user?.username || profile.username} />
        </div>

        <div className="profile-info">
          <div className="profile-username-row">
            <h2>{profile.user?.username || profile.username}</h2>

            {isOwnProfile ? (
              <button
                className="profile-btn secondary"
                onClick={() => navigate("/complete-profile")}
              >
                Edit Profile
              </button>
            ) : (
              <button
                className="profile-btn primary"
                onClick={handleFollowToggle}
                disabled={followLoading}
              >
                {followStatus === "pending" ? "Requested" : followStatus === "accepted" ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>

          <ul className="profile-stats">
            <li>
              <span className="count">{posts.length}</span> posts
            </li>
            <li>
              <span className="count">
                {profile.followerCount ?? profile.followers ?? 0}
              </span>{" "}
              followers
            </li>
            <li>
              <span className="count">
                {profile.followingCount ?? profile.following ?? 0}
              </span>{" "}
              following
            </li>
          </ul>

          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
        </div>
      </section>

      <section className="profile-posts">
        {isOwnProfile && (
          <div className="profile-tabs">
            <button
              className={activeTab === "posts" ? "tab-btn active" : "tab-btn"}
              onClick={() => setActiveTab("posts")}
            >
              Posts
            </button>
            <button
              className={activeTab === "saved" ? "tab-btn active" : "tab-btn"}
              onClick={() => setActiveTab("saved")}
            >
              Saved
            </button>
          </div>
        )}

        {activeTab === "saved" && isOwnProfile ? (
          <>
            {savedLoading && <p className="empty-state subtle">Loading saved posts...</p>}
            {savedPosts.length === 0 && !savedLoading ? (
              <p className="empty-state">No saved posts yet.</p>
            ) : (
              <div className="posts-grid">
                {savedPosts.map((post) => (
                  <div key={post._id || post.id} className="post-tile">
                    <img src={post.imgUrl} alt={post.caption || "Saved Post"} />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : posts.length === 0 ? (
          <p className="empty-state">No posts yet.</p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <div key={post._id || post.id} className="post-tile">
                <img src={post.imgUrl} alt={post.caption || "Post"} />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Profile;

