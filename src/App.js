import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import './styles/mobile.css';
import './styles/public.css';

// RMS Pages
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
import OrderWorkflow from './pages/OrderWorkflow';
import PaymentProcessing from './pages/PaymentProcessing';
import AdvancedAnalytics from './pages/AdvancedAnalytics';
import RealtimeTracker from './pages/RealtimeTracker';

// PUBLIC WEBSITE Pages
import Landing from './pages/Public/Landing';
import PublicMenu from './pages/Public/Menu';
import Reservations from './pages/Public/Reservations';
import Order from './pages/Public/Order';
import Checkout from './pages/Public/Checkout';
import OrderTracking from './pages/Public/OrderTracking';
import Reviews from './pages/Public/Reviews';
import Contact from './pages/Public/Contact';
import TestPage from './pages/Public/TestPage';

// Components
import RoleBasedSidebar from './components/RoleBasedSidebar';
import Header from './components/Header';
import LowStockNotification from './components/LowStockNotification';

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

  const getDashboard = () => {
    const roleId = user?.role_id;
    
    switch (roleId) {
      case 1:
        return <AdminDashboard user={user} />;
      case 2:
        return <ManagerDashboard user={user} />;
      case 3:
        return <CashierDashboard user={user} />;
      case 4:
        return <WaiterDashboardMobile user={user} />;
      case 5:
        return <ChefDashboard user={user} />;
      case 6:
        return <AuditorDashboard user={user} />;
      default:
        return <AdminDashboard user={user} />;
    }
  };

  return (
    <Router>
      <Routes>
        {/* PUBLIC WEBSITE - No login required */}
        <Route path="/public/" element={<Landing />} />
        <Route path="/public/menu" element={<PublicMenu />} />
        <Route path="/public/reservations" element={<Reservations />} />
        <Route path="/public/order" element={<Order />} />
        <Route path="/public/checkout" element={<Checkout />} />
        <Route path="/public/order-tracking" element={<OrderTracking />} />
        <Route path="/public/reviews" element={<Reviews />} />
        <Route path="/public/contact" element={<Contact />} />
        <Route path="/public/test" element={<TestPage />} />

        {/* LOGIN */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* RMS DASHBOARD - Requires authentication */}
        {isAuthenticated ? (
          <Route
            path="/*"
            element={
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
                      <Route path="/order-workflow" element={<OrderWorkflow />} />
                      <Route path="/payment-processing" element={<PaymentProcessing />} />
                      <Route path="/advanced-analytics" element={<AdvancedAnalytics />} />
                      <Route path="/realtime-tracker" element={<RealtimeTracker />} />
                      <Route path="/" element={<Navigate to="/dashboard" />} />
                      <Route path="*" element={<Navigate to="/dashboard" />} />
                    </Routes>
                  </div>
                </div>
              </div>
            }
          />
        ) : (
          <>
            <Route path="/" element={<Navigate to="/public/" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;