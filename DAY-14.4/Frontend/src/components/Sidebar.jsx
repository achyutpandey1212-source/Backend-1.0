import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import SearchBar from "./SearchBar";
import Notifications from "./Notifications";
import "./Sidebar.scss";

const Sidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?._id || user?.id;

  return (
    <aside className="app-leftbar">
      <div className="sidebar-logo">Instagram</div>
      <nav className="sidebar-nav">
        <button className="nav-item active" onClick={() => navigate("/feed")}>
          <span className="nav-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22 11.5L12 3 2 11.5V21h7v-6h6v6h7z" />
            </svg>
          </span>
          Home
        </button>

        <div className="sidebar-search">
          <SearchBar inputId="sidebar-search-input" />
        </div>

        <button
          className="nav-item"
          onClick={() => {
            const el = document.getElementById("sidebar-search-input");
            if (el) el.focus();
          }}
        >
          <span className="nav-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M21 21l-4.3-4.3m1.8-4.7a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
            </svg>
          </span>
          Search
        </button>

        <div className="nav-item notif-item">
          <Notifications />
          <span>Notifications</span>
        </div>

        <button className="nav-item" onClick={() => navigate("/create")}>
          <span className="nav-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </span>
          Create
        </button>

        <button
          className="nav-item"
          onClick={() => userId && navigate(`/profile/${userId}`)}
        >
          <span className="nav-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c2.2-4 13.8-4 16 0" />
            </svg>
          </span>
          Profile
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
