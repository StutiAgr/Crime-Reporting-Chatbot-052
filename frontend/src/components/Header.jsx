import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = ({ adminOnly = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-detect if on admin dashboard
  const isAdminDashboard = location.pathname === '/admin-dashboard';
  const showAdminOnly = adminOnly || isAdminDashboard;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="logo">SafeSpace</div>
      {!showAdminOnly && (
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
      )}
      {showAdminOnly && (
        <nav>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </nav>
      )}
    </header>
  );
};

export default Header;
