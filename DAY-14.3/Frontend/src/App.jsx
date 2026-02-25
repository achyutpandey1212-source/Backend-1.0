import { Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import CreatePostPage from "./pages/CreatePostPage";

function App() {
  return (
    <div className="app-shell">
      <nav
        style={{
          borderBottom: "1px solid #262626",
          padding: "0.8rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#050505",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Link to="/" style={{ fontWeight: 700, letterSpacing: "0.04em" }}>
          InstaClone
        </Link>
        <div style={{ display: "flex", gap: "1rem", fontSize: "0.9rem" }}>
          <Link to="/create">Create</Link>
          <Link to="/login">Login</Link>
        </div>
      </nav>

      <main className="app-main">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/" element={<div style={{ color: "#a8a8a8" }}>Feed coming soon…</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
