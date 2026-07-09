import React from 'react';

function Header({ user, onLogout }) {
  return (
    <div className="header">
      <div className="header-left">
        <h1>Restaurant Management System</h1>
      </div>
      <div className="header-right">
        <div className="user-profile">
          <div className="user-avatar">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <h3>{user?.username || 'User'}</h3>
            <p>Role: Admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;