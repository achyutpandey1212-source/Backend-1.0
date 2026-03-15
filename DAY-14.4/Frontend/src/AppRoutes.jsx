import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import Login from "./features/auth/pages/Login";
import Register from "./features/auth/pages/Register";
import Home from "./features/LandingPage/pages/Homepage";
import Feed from "./features/post/pages/Feed"
import CreatePost from "./features/post/pages/CreatePost";
import Profile from "./features/auth/pages/Profile";
import CompleteProfile from "./features/auth/pages/CompleteProfile";
import Header from "./components/Header";
import { useAuth } from "./features/auth/hooks/useAuth";

function RequireProfile({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.hasProfile) {
    return <Navigate to="/complete-profile" replace />;
  }

  return (
    <>
      <Header />
      {children}
    </>
  );
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/feed"
          element={
            <RequireProfile>
              <Feed />
            </RequireProfile>
          }
        />
        <Route
          path="/create"
          element={
            <RequireProfile>
              <CreatePost />
            </RequireProfile>
          }
        />
        <Route
          path="/profile/:userId?"
          element={
            <RequireProfile>
              <Profile />
            </RequireProfile>
          }
        />
        <Route
          path="/profile/:userId"
          element={
            <RequireProfile>
              <Profile />
            </RequireProfile>
          }
        />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
