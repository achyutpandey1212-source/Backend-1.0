import React from "react";
import { Link } from "react-router-dom";

const Homepage = () => {
  return (
    <div className="homepage">
      <div className="home-hero">
        <div className="hero-copy">
          <p className="hero-eyebrow">Private moments, premium feel</p>
          <h1>Share your world with a refined social canvas.</h1>
          <p className="hero-subtitle">
            Built for close circles and clean storytelling. Discover, post, and connect in a space that feels calm and modern.
          </p>
          <div className="home-actions">
            <Link to="/login">
              <button className="home-btn primary">Log In</button>
            </Link>
            <Link to="/register">
              <button className="home-btn secondary">Create Account</button>
            </Link>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="hero-card card-main">
            <div className="card-header">
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
            <div className="card-media" />
            <div className="card-meta">
              <div className="meta-line long" />
              <div className="meta-line" />
            </div>
          </div>
          <div className="hero-card card-secondary" />
          <div className="hero-card card-tertiary" />
        </div>
      </div>
    </div>
  );
};

export default Homepage;
