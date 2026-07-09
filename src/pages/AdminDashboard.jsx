import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import RestaurantScene from '../components/3D/RestaurantScene';
import StatCube from '../components/3D/StatCube';

function AdminDashboard({ user }) {
  const { get } = useApi();
  const [stats, setStats] = useState({ total_orders: 0, completed_orders: 0, total_revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportRes = await get('/reports/daily-sales');
        if (reportRes) setStats(reportRes);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [get]);

  return (
    <div>
      <div className="dashboard-header">
        <h1>🎨 Admin Dashboard - 3D Edition</h1>
        <p>Welcome back, {user?.username}! 👑</p>
      </div>

      {/* 3D HERO SCENE */}
      <div style={{ marginBottom: '40px' }}>
        <RestaurantScene />
      </div>

      {/* 3D STAT CUBES */}
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          marginBottom: '40px'
        }}>
          <StatCube label="Total Orders" value={stats.total_orders || 0} color="#d4a574" />
          <StatCube label="Completed" value={stats.completed_orders || 0} color="#27ae60" />
          <StatCube label="Revenue (TZS)" value={(stats.total_revenue || 0).toLocaleString()} color="#3498db" />
          <StatCube 
            label="Completion Rate" 
            value={stats.total_orders ? Math.round((stats.completed_orders / stats.total_orders) * 100) + '%' : '0%'} 
            color="#9b59b6" 
          />
        </div>
      )}

      {/* TRADITIONAL STATS BELOW */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Today's Orders</span>
          <div className="stat-value">{stats.total_orders || 0}</div>
          <div className="stat-change">All orders</div>
        </div>

        <div className="stat-card">
          <span className="stat-label">Completed</span>
          <div className="stat-value">{stats.completed_orders || 0}</div>
          <div className="stat-change">Finished</div>
        </div>

        <div className="stat-card">
          <span className="stat-label">Revenue</span>
          <div className="stat-value" style={{ fontSize: '24px' }}>
            {(stats.total_revenue || 0).toLocaleString()} TZS
          </div>
          <div className="stat-change">Today's total</div>
        </div>

        <div className="stat-card">
          <span className="stat-label">Avg Order</span>
          <div className="stat-value">
            {stats.total_orders ? Math.round(stats.total_revenue / stats.total_orders) : 0} TZS
          </div>
          <div className="stat-change">Per transaction</div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;