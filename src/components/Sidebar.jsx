import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Sidebar({ user, onLogout }) {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/orders', label: 'Orders', icon: '📦' },
    { path: '/menu', label: 'Menu', icon: '🍽️' },
    { path: '/customers', label: 'Customers', icon: '👥' },
    { path: '/inventory', label: 'Inventory', icon: '📦' },
    { path: '/reports', label: 'Reports', icon: '📈' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🍽️</div>
        <div className="sidebar-logo-text">
          <h2>Mr. Appetite</h2>
          <p>RMS</p>
        </div>
      </div>

      <nav className="nav-menu">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;