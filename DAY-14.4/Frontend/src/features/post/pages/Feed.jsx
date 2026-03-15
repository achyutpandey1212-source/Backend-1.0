import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "../styles/feed.scss";
import Post from "../components/Post";
import { usePost } from "../hooks/usePost";

const PAGE_LIMIT = 6;

const Feed = () => {
  const { feed, handleGetFeed, loading, bookmarks } = usePost();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const loaderRef = useRef(null);
  const isFetchingRef = useRef(false);

  const isEmpty = useMemo(() => !loading && (!feed || feed.length === 0), [feed, loading]);

  const loadPage = useCallback(
    async (nextPage) => {
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      setError(null);
      setLoadingMore(true);

      try {
        const posts = await handleGetFeed({
          page: nextPage,
          limit: PAGE_LIMIT,
          append: nextPage > 1,
          fetchBookmarks: nextPage === 1,
        });

        setHasMore(posts.length === PAGE_LIMIT);
        setPage(nextPage);
      } catch (err) {
        console.error("Feed load failed", err);
        setError(err.message || "Failed to load feed");
      } finally {
        setLoadingMore(false);
        isFetchingRef.current = false;
      }
    },
    [handleGetFeed]
  );

  useEffect(() => {
    loadPage(1);
  }, [loadPage]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          hasMore &&
          !loading &&
          !loadingMore &&
          !isFetchingRef.current
        ) {
          loadPage(page + 1);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, loadPage, page]);

  if (loading && isEmpty) {
    return (
      <main className="main-loading">
        <h1>Loading feed...</h1>
      </main>
    );
  }

  return (
    <div className="feed-container">
      {error && <div className="error-state">{error}</div>}
      {isEmpty && !error && <div className="empty-state">No posts yet.</div>}
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

      <div className="feed-loader" ref={loaderRef}>
        {(loadingMore || (loading && page === 1)) && (
          <div className="loader">
            <div className="dot" />
            <div className="dot" />
            <div className="dot" />
          </div>
        )}
        {!hasMore && feed && feed.length > 0 && (
          <div className="end-message">No more posts to load</div>
        )}
      </div>
    </div>
  );
};

export default Feed;
