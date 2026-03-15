import { useEffect } from "react";
import "../styles/feed.scss";
import Post from "../components/Post";
import { usePost } from "../hooks/usePost";

const Feed = () => {
  const { feed, handleGetFeed, loading } = usePost();

  useEffect(() => {
    handleGetFeed();
  }, []);

  if (loading || !feed) {
    return (
      <main>
        <h1>Feed is Loading...</h1>
      </main>
    );
  }

  return (
    <div className="feed-container">
      {feed.map((postData) => (
        <Post key={postData._id || postData.id} postData={postData} />
      ))}
    </div>
  );
};

export default Feed;
