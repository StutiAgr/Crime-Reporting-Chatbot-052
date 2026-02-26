import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <main id="home" className="hero">
      <div className="hero-text">
        <h1>Your Voice <span>Matters</span></h1>
        <p>
          Report crimes safely and securely. We are dedicated to helping
          women find justice and support without fear.
        </p>
        <Link to="/chatbot">
          <button className="report-btn">Report a Crime</button>
        </Link>
      </div>
      <div className="hero-image">
        <img
          src="../home-page-img.png"
          alt="Illustration of woman reporting"
          height={"400px"}
          width={"300px"}
        />
      </div>
    </main>
  );
};

export default Hero;
