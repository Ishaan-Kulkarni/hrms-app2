import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ title }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="header">
      <h1>{title}</h1>
      <div className="user-info">
        <span>Welcome, {user?.name}</span>
        <span className="user-role">({user?.role})</span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;