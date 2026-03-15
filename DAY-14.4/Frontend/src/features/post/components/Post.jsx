// /post/components/Post.jsx
import { useContext, useEffect, useState } from 'react';
import { PostContext } from '../post.context';
import { likePost, unlikePost } from '../services/like.api';
import { getComments, createComment, replyToComment, deleteComment } from '../services/comment.api';
import { addBookmark, removeBookmark } from '../services/bookmark.api';
import { updatePost, deletePost } from '../services/post.api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';

const Post = ({ postData, isBookmarked: isBookmarkedProp }) => {
  const { post } = useContext(PostContext);
  const currentPost = postData || post;
  const postId = currentPost?._id || currentPost?.id;
  const initialLikeCount = currentPost?.likeCount ?? currentPost?.likesCount ?? 0;
  const navigate = useNavigate();
  const { user } = useAuth();
  const ownerId = currentPost?.user?._id || currentPost?.user?.id;
  const currentUserId = user?._id || user?.id;
  const isOwner = ownerId && currentUserId && ownerId === currentUserId;

  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [likeLoading, setLikeLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(!!isBookmarkedProp);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentLoading, setCommentLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [commentCount, setCommentCount] = useState(currentPost?.commentCount ?? 0);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(currentPost?.title || "");
  const [editCaption, setEditCaption] = useState(currentPost?.caption || "");
  const [displayTitle, setDisplayTitle] = useState(currentPost?.title || "");
  const [displayCaption, setDisplayCaption] = useState(currentPost?.caption || "");
  const [isDeleted, setIsDeleted] = useState(false);

  if (!currentPost) return null;
  if (isDeleted) return null;

  useEffect(() => {
    setIsBookmarked(!!isBookmarkedProp);
  }, [isBookmarkedProp]);

  const handleProfileClick = () => {
    const userId = currentPost.user?._id || currentPost.user?.id;
    if (userId) {
      navigate(`/profile/${userId}`);
    }
  };

  const handleToggleLike = async () => {
    if (!postId || likeLoading) return;

    try {
      setLikeLoading(true);

      if (!isLiked) {
        const data = await likePost(postId);
        setIsLiked(true);
        if (typeof data.likeCount === "number") {
          setLikeCount(data.likeCount);
        } else {
          setLikeCount((prev) => prev + 1);
        }
      } else {
        const data = await unlikePost(postId);
        setIsLiked(false);
        if (typeof data.likeCount === "number") {
          setLikeCount(data.likeCount);
        } else {
          setLikeCount((prev) => Math.max(0, prev - 1));
        }
      }
    } catch (err) {
      // silently fail for now; could show toast
    } finally {
      setLikeLoading(false);
    }
  };

  const handleToggleBookmark = async () => {
    if (!postId || bookmarkLoading) return;

    try {
      setBookmarkLoading(true);
      if (isBookmarked) {
        await removeBookmark(postId);
        setIsBookmarked(false);
      } else {
        await addBookmark(postId);
        setIsBookmarked(true);
      }
    } catch (err) {
      // silently fail for now; could show toast
    } finally {
      setBookmarkLoading(false);
    }
  };

  const loadComments = async () => {
    if (!postId) return;
    try {
      setCommentLoading(true);
      const data = await getComments(postId);
      setComments(data.comments || []);
    } finally {
      setCommentLoading(false);
    }
  };

  const toggleComments = async () => {
    const nextState = !commentsOpen;
    setCommentsOpen(nextState);
    if (nextState && comments.length === 0) {
      await loadComments();
    }
  };

  const insertReply = (items, parentId, reply) => {
    return items.map((item) => {
      if ((item._id || item.id) === parentId) {
        const nextReplies = Array.isArray(item.replies) ? item.replies : [];
        return { ...item, replies: [...nextReplies, reply] };
      }
      if (item.replies && item.replies.length > 0) {
        return { ...item, replies: insertReply(item.replies, parentId, reply) };
      }
      return item;
    });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    try {
      if (replyTo) {
        const data = await replyToComment(postId, replyTo, commentInput.trim());
        const reply = data.comment;
        setComments((prev) => insertReply(prev, replyTo, reply));
      } else {
        const data = await createComment(postId, commentInput.trim());
        const newComment = data.comment;
        setComments((prev) => [...prev, newComment]);
      }
      setCommentInput("");
      setReplyTo(null);
      setCommentCount((prev) => prev + 1);
    } catch (err) {
      // optionally show error
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const data = await deleteComment(commentId);
      const deletedCount = data.deletedCount || 1;
      setCommentCount((prev) => Math.max(0, prev - deletedCount));
      await loadComments();
    } catch (err) {
      // optionally show error
    }
  };

  const handleEditSave = async () => {
    if (!postId) return;
    try {
      const data = await updatePost(postId, {
        title: editTitle,
        caption: editCaption,
      });
      setDisplayTitle(data.post?.title || editTitle);
      setDisplayCaption(data.post?.caption || editCaption);
      setIsEditing(false);
    } catch (err) {
      // optionally show error
    }
  };

  const handleDeletePost = async () => {
    if (!postId) return;
    try {
      await deletePost(postId);
      setIsDeleted(true);
    } catch (err) {
      // optionally show error
    }
  };

  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  return (
    <article className="post-card">
      <div className="post-header">
        <div className="user-info">
          <img
            src={currentPost.userProfile?.profileImg}
            alt={currentPost.user.username}
            className="profile-pic"
            onClick={handleProfileClick}
            style={{ cursor: 'pointer' }}
          />
          <span className="username" onClick={handleProfileClick} style={{ cursor: 'pointer' }}>{currentPost.user.username}</span>
        </div>
        <div className="post-menu">
          <button className="more-btn" onClick={() => setShowMenu((v) => !v)} aria-label="More options">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </button>
          {showMenu && isOwner && (
            <div className="post-menu-dropdown">
              <button className="menu-item" onClick={() => setIsEditing(true)}>Edit</button>
              <button className="menu-item danger" onClick={handleDeletePost}>Delete</button>
            </div>
          )}
        </div>
      </div>

      {/* Image */}
      <div className="post-image">
        <img src={currentPost.imgUrl} alt={currentPost.caption} />
      </div>

      {/* Title */}
      {displayTitle && (
        <div className="post-title">
          {displayTitle}
        </div>
      )}

      {/* Actions */}
      <div className="post-actions">
        <div className="action-buttons">
          <button
            className={`action-btn ${isLiked ? "active" : ""}`}
            onClick={handleToggleLike}
            disabled={likeLoading}
            aria-label="Like"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 21s-7-4.7-7-10a4 4 0 0 1 7-2.3A4 4 0 0 1 19 11c0 5.3-7 10-7 10z" />
            </svg>
          </button>
          <button className="action-btn" onClick={toggleComments} aria-label="Comment">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-6a8 8 0 1 1 18-5z" />
            </svg>
          </button>
          <button className="action-btn" aria-label="Share">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M3 12l18-9-6.5 18-3-6.5z" />
            </svg>
          </button>
        </div>
        <button className={`action-btn bookmark ${isBookmarked ? "active" : ""}`} onClick={handleToggleBookmark} disabled={bookmarkLoading} aria-label="Save">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 3h12v18l-6-4-6 4z" />
          </svg>
        </button>
      </div>

      {/* Likes */}
      <div className="likes-count">
        {likeCount} likes
      </div>

      {/* Caption */}
      <div className="post-caption">
        <span className="username">{currentPost.user.username}</span>
        {displayCaption}
      </div>

      {/* Edit */}
      {isEditing && (
        <div className="post-edit">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Edit title"
          />
          <textarea
            rows="2"
            value={editCaption}
            onChange={(e) => setEditCaption(e.target.value)}
            placeholder="Edit caption"
          />
          <div className="edit-actions">
            <button className="edit-btn" onClick={handleEditSave}>Save</button>
            <button className="edit-btn secondary" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Comments hint */}
      <div className="view-comments" onClick={toggleComments}>
        View all {commentCount} comments
      </div>

      {commentsOpen && (
        <div className="comments-section">
          {commentLoading ? (
            <div className="comment-loading">Loading comments...</div>
          ) : (
            <div className="comment-list">
              {comments.length === 0 && (
                <div className="comment-empty">No comments yet.</div>
              )}
              {comments.map((comment) => (
                <div key={comment._id || comment.id} className="comment-item">
                  <div className="comment-body">
                    <span className="comment-username">{comment.user?.username}</span>
                    <span className="comment-text">{comment.content}</span>
                  </div>
                  <div className="comment-actions">
                    <button className="comment-action" onClick={() => setReplyTo(comment._id || comment.id)}>Reply</button>
                    {(comment.user?._id === currentUserId || comment.user?.id === currentUserId) && (
                      <button className="comment-action danger" onClick={() => handleDeleteComment(comment._id || comment.id)}>Delete</button>
                    )}
                  </div>
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="comment-replies">
                      {comment.replies.map((reply) => (
                        <div key={reply._id || reply.id} className="comment-item reply">
                          <div className="comment-body">
                            <span className="comment-username">{reply.user?.username}</span>
                            <span className="comment-text">{reply.content}</span>
                          </div>
                          {(reply.user?._id === currentUserId || reply.user?.id === currentUserId) && (
                            <div className="comment-actions">
                              <button className="comment-action danger" onClick={() => handleDeleteComment(reply._id || reply.id)}>Delete</button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <form className="comment-composer" onSubmit={handleCommentSubmit}>
            {replyTo && (
              <div className="replying-to">
                Replying to comment
                <button type="button" onClick={() => setReplyTo(null)}>Cancel</button>
              </div>
            )}
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            />
            <button type="submit">Post</button>
          </form>
        </div>
      )}

      {/* Time */}
      <div className="post-time">
        {currentPost.createdAt ? formatDate(currentPost.createdAt) : ""}
      </div>
    </article>
  );
};

export default Post;
