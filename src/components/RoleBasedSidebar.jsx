import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function RoleBasedSidebar({ user, onLogout }) {
  const location = useLocation();

  // Different nav items per role
  const getNavItems = () => {
    const roleId = user?.role_id;

    switch (roleId) {
      case 4: // WAITER
        return [
          { path: '/dashboard', label: 'My Orders', icon: '🍽️' },
          { path: '/waiter-menu', label: 'Menu Management', icon: '📝' },
        ];

      case 5: // CHEF
        return [
          { path: '/dashboard', label: 'Kitchen', icon: '👨‍🍳' },
          { path: '/chef-menu', label: 'Menu Management', icon: '📝' },
          { path: '/chef-inventory', label: 'Inventory', icon: '📦' },
        ];

      case 2: // MANAGER
  return [
    { path: '/dashboard', label: 'Analytics', icon: '📊' },
    { path: '/realtime-tracker', label: 'Live Orders', icon: '🔄' },  // ADD
    { path: '/order-workflow', label: 'Order Workflow', icon: '📋' },
    { path: '/advanced-analytics', label: 'Advanced Analytics', icon: '📈' },  // ADD
    { path: '/manager-inventory', label: 'Inventory Mgmt', icon: '📦' },
    { path: '/reports', label: 'Reports', icon: '📈' },
    { path: '/low-stock', label: 'Low Stock', icon: '⚠️' },
  ];

      case 3: // CASHIER
  return [
    { path: '/dashboard', label: 'Payments', icon: '💳' },
    { path: '/payment-processing', label: 'Process Payment', icon: '💰' },  // ADD
    { path: '/realtime-tracker', label: 'Live Orders', icon: '🔄' },  // ADD
    { path: '/customers', label: 'Customers', icon: '👥' },
  ];

      case 6: // AUDITOR
        return [
          { path: '/dashboard', label: 'Overview', icon: '👀' },
          { path: '/audit-trail', label: 'Audit Trail', icon: '📋' },
          { path: '/reports', label: 'Reports', icon: '📈' },
          { path: '/audit-inventory', label: 'Inventory', icon: '📦' },
        ];

      case 1: // ADMIN (default)
      default:
        return [
          { path: '/dashboard', label: 'Dashboard', icon: '📊' },
          { path: '/orders', label: 'Orders', icon: '📦' },
          { path: '/menu', label: 'Menu', icon: '🍽️' },
          { path: '/customers', label: 'Customers', icon: '👥' },
          { path: '/manager-inventory', label: 'Inventory', icon: '📦' },
          { path: '/reports', label: 'Reports', icon: '📈' },
          { path: '/audit-trail', label: 'Audit Trail', icon: '📋' },
        ];
    }
  };

  const navItems = getNavItems();

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
        <div style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#252f3f', borderRadius: '6px', fontSize: '11px', textAlign: 'center' }}>
          <p style={{ margin: 0, color: '#b0b8c1' }}>Role:</p>
          <p style={{ margin: '5px 0 0 0', color: '#d4a574', fontWeight: 'bold' }}>
            {user?.role_id === 1 ? 'Admin' : 
             user?.role_id === 2 ? 'Manager' :
             user?.role_id === 3 ? 'Cashier' :
             user?.role_id === 4 ? 'Waiter' :
             user?.role_id === 5 ? 'Chef' :
             user?.role_id === 6 ? 'Auditor' : 'User'}
          </p>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default RoleBasedSidebar;