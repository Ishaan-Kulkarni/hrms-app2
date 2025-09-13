import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/employees', label: 'Employees', icon: '👥' },
  ];

  return (
    <aside className="sidebar">
      <h2>🏢 HRMS</h2>
      <nav>
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={location.pathname === item.path ? 'active' : ''}
              >
                <span className="icon">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div style={{ 
        position: 'absolute', 
        bottom: '20px', 
        left: '20px',
        right: '20px',
        fontSize: '12px',
        opacity: '0.7'
      }}>
        <p>Logged in as: {user?.name}</p>
        <p>Role: {user?.role}</p>
      </div>
    </aside>
  );
};

export default Sidebar;