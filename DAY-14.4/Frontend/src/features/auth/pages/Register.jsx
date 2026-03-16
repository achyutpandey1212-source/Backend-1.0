import "../styles/form.scss";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { handleRegister } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const result = await handleRegister(username, email, password);

    if (result?.user) {
      setError("");
      if (!result.user.hasProfile) {
        navigate("/complete-profile");
      } else {
        navigate("/feed");
      }
      return;
    }

    if (result?.error) {
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
        <h1>Make a new Instagram Account</h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              onInput={(e) => {
                setEmail(e.target.value);
              }}
              type="text"
              id="login"
              name="login"
              required
            />
            <label htmlFor="login">Email</label>
          </div>
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
            <label htmlFor="login">Username</label>
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
          <button>Register</button>
          {error && <p className="form-error">{error}</p>}

          <div className="link">
            <p>Already registered?</p>
            <a href="/login">Log in</a>
          </div>
        </form>
      </div>
    </main>
  );
};

export default Register;
