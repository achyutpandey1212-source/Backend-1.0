import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div className="homepage">
      <h1>Welcome to Instagram Clone</h1>
      <p>Share your moments with friends and family. Connect, discover, and inspire.</p>
      <div className="home-actions">
        <Link to="/login">
          <button className="home-btn primary">Log In</button>
        </Link>
        <Link to="/register">
          <button className="home-btn secondary">Sign Up</button>
        </Link>
      </div>
    </div>
  );
};

export default Homepage;
