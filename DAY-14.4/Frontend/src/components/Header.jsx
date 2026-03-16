import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import SearchBar from "./SearchBar";
import Notifications from "./Notifications";
import "./Header.scss";

const Header = () => {
  const { user, handleLogout } = useAuth();
  const navigate = useNavigate();
  const profileId = user?._id || user?.id;
  const profileLink = profileId ? `/profile/${profileId}` : "/profile";

  const handleLogoutClick = async () => {
    await handleLogout();
    navigate("/");
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
          <NavLink to="/feed" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
              </svg>
            </span>
            <span className="nav-text">Feed</span>
          </NavLink>
          <NavLink to="/create" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
            <span className="nav-text">Create</span>
          </NavLink>
          <NavLink
            to={profileLink}
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8a7 7 0 0 1 14 0" />
              </svg>
            </span>
            <span className="nav-text">Profile</span>
          </NavLink>
          <button onClick={handleLogoutClick} className="nav-link logout-btn">
            <span className="nav-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 7l5 5-5 5M20 12H9M12 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h6" />
              </svg>
            </span>
            <span className="nav-text">Logout</span>
          </button>
        </nav>
      </div>

      <nav className="mobile-nav">
        <NavLink to="/feed" className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1z" />
          </svg>
        </NavLink>
        <NavLink to="/create" className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </NavLink>
        <NavLink
          to={profileLink}
          className={({ isActive }) => `mobile-nav-link ${isActive ? "active" : ""}`}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm-7 8a7 7 0 0 1 14 0" />
          </svg>
        </NavLink>
      </nav>
    </header>
  );
};

export default Header;
