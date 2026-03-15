import { getFeed } from "../services/post.api";
import { getMyBookmarks } from "../services/bookmark.api";
import { useCallback, useContext } from "react";
import { PostContext } from "../post.context";

export const usePost = () => {
  const context = useContext(PostContext);

  const {
    loading,
    setLoading,
    post,
    setPost,
    feed,
    setFeed,
    bookmarks,
    setBookmarks,
  } = context;

  const handleGetFeed = useCallback(
    async ({ page = 1, limit = 0, append = false, fetchBookmarks = true } = {}) => {
      if (!append) {
        setFeed([]);
      }
      setLoading(true);

      try {
        const [feedData, bookmarkData] = await Promise.all([
          getFeed({ page, limit }),
          fetchBookmarks ? getMyBookmarks() : Promise.resolve({ posts: [] }),
        ]);

        const posts = feedData.posts || [];

        setFeed((current) => (append ? [...(current || []), ...posts] : posts));
        if (fetchBookmarks) {
          setBookmarks(bookmarkData.posts || []);
        }

        return posts;
      } catch (error) {
        // If there are no posts yet, backend may return 404.
        if (error?.response?.status === 404) {
          setFeed((current) => (append ? current : []));
          return [];
        }

        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setBookmarks, setFeed, setLoading]
  );

  return { loading, feed, post, bookmarks, handleGetFeed };
};
