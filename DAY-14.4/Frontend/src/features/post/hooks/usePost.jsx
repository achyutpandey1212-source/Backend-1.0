import { getFeed } from "../services/post.api";
import { getMyBookmarks } from "../services/bookmark.api";
import { useContext } from "react";
import { PostContext } from "../post.context";

export const usePost = () => {
  const context = useContext(PostContext);

  const { loading, setLoading, post, setPost, feed, setFeed, bookmarks, setBookmarks } = context;

  const handleGetFeed = async (page = 1, limit = 3, append = false) => {
    setLoading(true);
    try {
      const [feedData, bookmarkData] = await Promise.all([
        getFeed(page, limit),
        getMyBookmarks(),
      ]);
      setFeed((prev) => (append ? [...(prev || []), ...(feedData.posts || [])] : feedData.posts));
      setBookmarks(bookmarkData.posts || []);
      return feedData.posts || [];
    } catch (err) {
      if (!append) {
        setFeed([]);
      }
      return [];
    } finally {
      setLoading(false);
    }
  };

  return { loading, feed, post, bookmarks, handleGetFeed}
};
