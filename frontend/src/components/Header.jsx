import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="logo">SafeSpace</div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/#about">About</Link>
        <Link to="/resources">Resources</Link>
        {localStorage.getItem("authToken") ? <Link to="/complaints">Complaints</Link> : null}
        <Link to="/chatbot">AI Assistant</Link>

        {localStorage.getItem("authToken") ? (
          <>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-link">Login</Link>
            <Link to="/signup" className="signup-link">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
