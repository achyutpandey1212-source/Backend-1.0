import { useState } from "react";
import { login } from "../api/authApi";

function LoginPage() {
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await login(form);
      console.log("Logged in");
      // later: navigate("/"); 
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">InstaClone</h1>
        <p className="auth-subtitle">Log in to see photos from your friends.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email (or leave empty if using username)"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Username</label>
            <input
              className="auth-input"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Username"
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
            />
          </div>

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="auth-button">
            Log in
          </button>
        </form>

        <div className="auth-footer">
          Don&apos;t have an account?{" "}
          <span className="auth-link">Sign up</span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
