import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUsers } from '../features/auth/services/auth.api';
import './SearchBar.scss';

const SearchBar = ({ inputId }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (searchQuery) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchUsers(searchQuery);
      setResults(response.users || []);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    handleSearch(value);
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`);
    setQuery('');
    setShowResults(false);
  };

  const handleBlur = () => {
    // Delay hiding results to allow click on results
    setTimeout(() => setShowResults(false), 150);
  };

  return (
    <div className="search-container">
      <input
        id={inputId}
        type="text"
        placeholder="Search users..."
        value={query}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onFocus={() => query && setShowResults(true)}
        className="search-input"
      />

      {showResults && (
        <div className="search-results">
          {isSearching ? (
            <div className="search-loading">Searching...</div>
          ) : results.length > 0 ? (
            results.map((user) => (
              <div
                key={user._id}
                className="search-result-item"
                onClick={() => handleUserClick(user._id)}
              >
                <div className="user-avatar">
                  <span>{user.username.charAt(0).toUpperCase()}</span>
                </div>
                <span className="user-username">{user.username}</span>
              </div>
            ))
          ) : query.length >= 2 ? (
            <div className="no-results">No users found</div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
