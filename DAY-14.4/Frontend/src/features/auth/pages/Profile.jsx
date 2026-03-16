import { useEffect, useRef, useState } from "react";
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
  const tabsRef = useRef(null);
  const postsTabRef = useRef(null);
  const savedTabRef = useRef(null);
  const indicatorRef = useRef(null);

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

  const updateIndicator = () => {
    if (!tabsRef.current || !indicatorRef.current) return;
    const activeEl = activeTab === "posts" ? postsTabRef.current : savedTabRef.current;
    if (!activeEl) return;
    const tabsRect = tabsRef.current.getBoundingClientRect();
    const activeRect = activeEl.getBoundingClientRect();
    const left = activeRect.left - tabsRect.left;
    indicatorRef.current.style.width = `${activeRect.width}px`;
    indicatorRef.current.style.transform = `translateX(${left}px)`;
  };

  useEffect(() => {
    if (!tabsRef.current || !indicatorRef.current) return;
    const raf = requestAnimationFrame(updateIndicator);
    return () => cancelAnimationFrame(raf);
  }, [activeTab, isOwnProfile, posts.length, savedPosts.length, loading, savedLoading]);

  useEffect(() => {
    if (document?.fonts?.ready) {
      document.fonts.ready.then(() => {
        requestAnimationFrame(updateIndicator);
      });
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      updateIndicator();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

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

  const username = profile.user?.username || profile.username;
  const isPrivate = profile.isPrivate;
  const joinedAt = profile.createdAt ? new Date(profile.createdAt) : null;
  const joinedText = joinedAt
    ? `Joined ${joinedAt.toLocaleString("en-US", { month: "long", year: "numeric" })}`
    : "";

  return (
    <main className="profile-page with-header">
      <section className="profile-header">
        <div className="profile-avatar">
          <img src={profile.profileImg || profile.profileImage} alt={username} />
        </div>

        <div className="profile-info">
          <div className="profile-username-row">
            <h2>
              {username}
              {isPrivate && <span className="private-lock" aria-label="Private account">🔒</span>}
            </h2>

            {isOwnProfile ? (
              <button
                className="profile-btn secondary"
                onClick={() => navigate("/complete-profile", { state: { from: "profile" } })}
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
              <span className="count">{posts.length}</span>
              <span className="label">posts</span>
            </li>
            <li>
              <span className="count">
                {profile.followerCount ?? profile.followers ?? 0}
              </span>
              <span className="label">followers</span>
            </li>
            <li>
              <span className="count">
                {profile.followingCount ?? profile.following ?? 0}
              </span>
              <span className="label">following</span>
            </li>
          </ul>

          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          {(profile.location || profile.website || joinedText) && (
            <p className="profile-meta">
              {profile.location && <span>{profile.location}</span>}
              {profile.website && <span>{profile.website}</span>}
              {joinedText && <span>{joinedText}</span>}
            </p>
          )}
        </div>
      </section>

      <section className="profile-posts">
        {isOwnProfile && (
          <div className="profile-tabs" ref={tabsRef}>
            <button
              className={activeTab === "posts" ? "tab-btn active" : "tab-btn"}
              onClick={() => setActiveTab("posts")}
              ref={postsTabRef}
            >
              Posts
            </button>
            <button
              className={activeTab === "saved" ? "tab-btn active" : "tab-btn"}
              onClick={() => setActiveTab("saved")}
              ref={savedTabRef}
            >
              Saved
            </button>
            <span ref={indicatorRef} className="tab-indicator" />
          </div>
        )}

        {activeTab === "saved" && isOwnProfile ? (
          <>
            {savedLoading && <p className="empty-state subtle">Loading saved posts...</p>}
            {savedPosts.length === 0 && !savedLoading ? (
              <div className="empty-state-block">
                <p className="empty-state">No saved posts yet.</p>
              </div>
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
          <div className="empty-state-block">
            <p className="empty-state">
              {isOwnProfile
                ? "You haven't posted anything yet."
                : "This user hasn't posted anything yet."}
            </p>
            {isOwnProfile && (
              <>
                <p className="empty-state-sub">Share your first photo by tapping Create.</p>
                <button className="ghost-btn" onClick={() => navigate("/create")}>
                  Create Post
                </button>
              </>
            )}
          </div>
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

