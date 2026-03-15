import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import SearchBar from './SearchBar';
import Notifications from './Notifications';
import './Header.scss';

const Header = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/feed" className="logo">
          Instagram Clone
        </Link>

        <SearchBar />

        <nav className="nav-links">
          <Notifications />
          <Link to="/feed" className="nav-link">
            🏠 Home
          </Link>
          <Link to="/create" className="nav-link">
            ➕ Create
          </Link>
          <Link to={`/profile/${user?._id || user?.id}`} className="nav-link">
            👤 Profile
          </Link>
          <button onClick={handleLogoutClick} className="nav-link logout-btn">
            🚪 Logout
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;