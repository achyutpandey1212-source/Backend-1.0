import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/feed.scss";
import Post from "../components/Post";
import { usePost } from "../hooks/usePost";
import { useAuth } from "../../auth/hooks/useAuth";

const Feed = () => {
  const { feed, handleGetFeed, loading, bookmarks } = usePost();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const userId = user?._id || user?.id;
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [toast, setToast] = useState("");
  const loaderRef = useRef(null);

  useEffect(() => {
    const loadInitial = async () => {
      const posts = await handleGetFeed(1, 3, false);
      setHasMore(posts.length > 0);
    };
    loadInitial();
  }, []);

  useEffect(() => {
    if (location.state?.toast) {
      setToast(location.state.toast);
      const timer = setTimeout(() => setToast(""), 2500);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading && hasMore) {
          const nextPage = page + 1;
          const posts = await handleGetFeed(nextPage, 3, true);
          setPage(nextPage);
          if (!posts || posts.length === 0) {
            setHasMore(false);
          }
        }
      },
      { rootMargin: "200px" },
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [page, loading, hasMore]);

  if (loading && (!feed || feed.length === 0)) {
    return (
      <main className="main-loading">
        <h1>Loading feed...</h1>
      </main>
    );
  }

  return (
    <div className="feed-shell">
      {toast && <div className="toast">{toast}</div>}
      <aside className="feed-leftbar"></aside>
      <main className="feed-container">
        {feed && feed.length === 0 && !loading && (
          <div className="empty-state">No posts yet.</div>
        )}
        {(feed || []).map((postData) => {
          const postId = postData._id || postData.id;
          const isBookmarked = bookmarks?.some((b) => (b._id || b.id) === postId);
          return (
            <Post
              key={postId}
              postData={postData}
              isBookmarked={isBookmarked}
            />
          );
        })}
        <div ref={loaderRef} className="feed-loader" />
      </main>

      <aside className="feed-rightbar"></aside>
    </div>
  );
};

export default Feed;
