import { useState, useEffect, useRef } from 'react';
import { getPendingRequests, acceptFollowRequest, rejectFollowRequest } from '../features/auth/services/profile.api';
import './Notifications.scss';

const Notifications = () => {
  const [requests, setRequests] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await getPendingRequests();
        setRequests(response.requests || []);
      } catch (error) {
        console.error('Error fetching requests:', error);
        setRequests([]);
      }
    };

    if (isOpen) {
      fetchRequests();
    }
  }, [isOpen]);

  const handleAccept = async (followId) => {
    setLoading(true);
    try {
      await acceptFollowRequest(followId);
      setRequests(requests.filter(req => req._id !== followId));
    } catch (error) {
      console.error('Error accepting request:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (followId) => {
    setLoading(true);
    try {
      await rejectFollowRequest(followId);
      setRequests(requests.filter(req => req._id !== followId));
    } catch (error) {
      console.error('Error rejecting request:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="notifications-container" ref={dropdownRef}>
      <button
        className="notifications-btn"
        onClick={toggleDropdown}
        title="Notifications"
      >
        🔔
        {requests.length > 0 && (
          <span className="notification-count">{requests.length}</span>
        )}
      </button>

      {isOpen && (
        <div className="notifications-dropdown">
          <div className="dropdown-header">
            <h3>Follow Requests</h3>
          </div>

          <div className="dropdown-content">
            {requests.length === 0 ? (
              <div className="no-requests">
                No pending requests
              </div>
            ) : (
              requests.map((request) => (
                <div key={request._id} className="request-item">
                  <div className="request-info">
                    <div className="user-avatar">
                      <span>{request.follower.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="request-details">
                      <span className="username">{request.follower.username}</span>
                      <span className="request-text">wants to follow you</span>
                    </div>
                  </div>

                  <div className="request-actions">
                    <button
                      className="accept-btn"
                      onClick={() => handleAccept(request._id)}
                      disabled={loading}
                    >
                      Accept
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleReject(request._id)}
                      disabled={loading}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;