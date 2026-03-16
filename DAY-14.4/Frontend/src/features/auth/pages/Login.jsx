import "../styles/form.scss";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(""); // not in use right now
  const [error, setError] = useState("");
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const result = await handleLogin(username, password);
    if (result?.user) {
      setError("");
      if (result.user.hasProfile) {
        navigate("/feed");
      } else {
        navigate("/complete-profile");
      }
    } else if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <main className="auth-page">
      <div className="left-block">
        <img className="top" src="./insta-logo.png" alt="" />
        <h1>
          See everyday moments from your <span>close friends.</span>
        </h1>
        <img className="bottom" src="./insta-login-page-theme-img.png" alt="" />
      </div>
      <div className="form-container">
        <h1>Log into Instagram</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              onInput={(e) => {
                setUsername(e.target.value);
              }}
              type="text"
              id="login"
              name="login"
              required
            />
            <label htmlFor="login">Username, or Email</label>
          </div>
          <div className="input-group">
            <input
              onInput={(e) => {
                setPassword(e.target.value);
              }}
              type="password"
              id="password"
              name="password"
              required
            />
            <label htmlFor="password">Password</label>
          </div>
          <button>Log in</button>
          {error && <p className="form-error">{error}</p>}

          <div className="link">
            <p>Haven't registered yet?</p>
            <a href="/register">Register</a>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Login;
