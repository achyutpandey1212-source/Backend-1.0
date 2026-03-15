// /post/components/Post.jsx
import { usePost } from '../hooks/usePost';
import { useContext } from 'react';
import { PostContext } from '../post.context';

const Post = ({ postData }) => {
  const { post } = useContext(PostContext);
  const currentPost = postData || post;
  
  if (!currentPost) return null;

  return (
    <article className="post-card">
      <div className="post-header">
        <div className="user-info">
          <img 
            src={currentPost.userProfile?.profileImg} 
            alt={currentPost.user.username} 
            className="profile-pic"
          />
          <span className="username">{currentPost.user.username}</span>
        </div>
        <button className="more-btn">⋯</button>
      </div>

      {/* Image */}
      <div className="post-image">
        <img src={currentPost.imgUrl} alt={currentPost.caption} />
      </div>

      {/* Actions */}
      <div className="post-actions">
        <div className="action-buttons">
          <button className="action-btn">❤️</button>
          <button className="action-btn">💬</button>
          <button className="action-btn">📤</button>
        </div>
        <button className="action-btn bookmark">🔖</button>
      </div>

      {/* Likes */}
      <div className="likes-count">
        {currentPost.likesCount || 0} likes
      </div>

      {/* Caption */}
      <div className="post-caption">
        <span className="username">{currentPost.user.username}</span>
        {currentPost.caption}
      </div>

      {/* Comments hint */}
      <div className="view-comments">
        View all {currentPost.commentsCount || 0} comments
      </div>

      {/* Time */}
      <div className="post-time">
        {currentPost.createdAt ? new Date(currentPost.createdAt).toLocaleDateString() : '1d'}
      </div>
    </article>
  );
};

export default Post;
