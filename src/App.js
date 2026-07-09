import LowStockNotification from './components/LowStockNotification';
import OrderWorkflow from './pages/OrderWorkflow';
import './App.css';
import './styles/mobile.css';  // ADD THIS LINE
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import PaymentProcessing from './pages/PaymentProcessing';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import RealtimeTracker from './pages/RealtimeTracker';
import Landing3D from './pages/Landing3D';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import WaiterMenuManager from './pages/WaiterMenuManager';
import ChefDashboard from './pages/ChefDashboard';
import CashierDashboard from './pages/CashierDashboard';
import AuditorDashboard from './pages/AuditorDashboard';
import Orders from './pages/Orders';
import Menu from './pages/Menu';
import Customers from './pages/Customers';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';
import ManagerInventory from './pages/ManagerInventory';
import AuditTrailPage from './pages/AuditTrailPage';
import WaiterDashboardMobile from './pages/WaiterDashboardMobile';

// Components
import RoleBasedSidebar from './components/RoleBasedSidebar';
import Header from './components/Header';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Get dashboard based on role
 
const getDashboard = () => {
  const roleId = user?.role_id;
  
  switch (roleId) {
    case 1:
      return <AdminDashboard user={user} />;
    case 2:
      return <ManagerDashboard user={user} />;
    case 3:
      return <CashierDashboard user={user} />; // Already mobile-optimized
    case 4:
      return <WaiterDashboardMobile user={user} />; // Mobile version
    case 5:
      return <ChefDashboard user={user} />; // Already mobile-optimized
    case 6:
      return <AuditorDashboard user={user} />;
    default:
      return <AdminDashboard user={user} />;
  }
};
  return (
    <Router>
      {isAuthenticated ? (
        <div className="app-container">
          <RoleBasedSidebar user={user} onLogout={handleLogout} />
          <div className="main-content">
               <Header user={user} onLogout={handleLogout} />
                 <LowStockNotification />
          <div className="page-content">
              <Routes>
                <Route path="/dashboard" element={getDashboard()} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/menu" element={<Menu />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/waiter-menu" element={<WaiterMenuManager />} />
                <Route path="/manager-inventory" element={<ManagerInventory />} />
                <Route path="/audit-trail" element={<AuditTrailPage />} />
                <Route path="/chef-inventory" element={<Inventory />} />
                <Route path="/audit-inventory" element={<Inventory />} />
                <Route path="/low-stock" element={<Inventory />} />
                <Route path="/cashier-process" element={<CashierDashboard />} />
                <Route path="/chef-menu" element={<WaiterMenuManager />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
                <Route path="/order-workflow" element={<OrderWorkflow />} />
                <Route path="/payment-processing" element={<PaymentProcessing />} />
                <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
                <Route path="/realtime-tracker" element={<RealtimeTracker />} />
                <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing3D />} />
                <Route path="/login" element={<Login onLogin={handleLogin} />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;