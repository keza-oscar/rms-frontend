import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import RestaurantScene from '../components/3D/RestaurantScene';

function AuditorDashboard({ user }) {
  const { get } = useApi();
  const [stats, setStats] = useState({});
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
        <h1>👀 Auditor Overview - 3D Compliance Monitor</h1>
        <p>System-wide monitoring and compliance</p>
      </div>

      {/* 3D SCENE */}
      <div style={{ marginBottom: '40px' }}>
        <RestaurantScene />
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Total Orders</span>
              <div className="stat-value">{stats.total_orders || 0}</div>
              <div className="stat-change">All time</div>
            </div>
            <div className="stat-card">
              <span className="stat-label">Completed Orders</span>
              <div className="stat-value">{stats.completed_orders || 0}</div>
              <div className="stat-change">Successful</div>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Revenue</span>
              <div className="stat-value" style={{ fontSize: '24px' }}>
                {(stats.total_revenue || 0).toLocaleString()} TZS
              </div>
              <div className="stat-change">All transactions</div>
            </div>
            <div className="stat-card">
              <span className="stat-label">Completion Rate</span>
              <div className="stat-value">
                {stats.total_orders ? Math.round((stats.completed_orders / stats.total_orders) * 100) : 0}%
              </div>
              <div className="stat-change">Efficiency</div>
            </div>
          </div>

          <div
            style={{
              marginTop: '30px',
              padding: '20px',
              backgroundColor: '#1a2332',
              border: '1px solid #2a3544',
              borderRadius: '12px',
              color: '#b0b8c1'
            }}
          >
            <h3 style={{ color: '#fff', marginBottom: '15px' }}>Audit Overview</h3>
            <p>✓ All user actions are logged in Audit Trail</p>
            <p>✓ Track who made changes, when, and what changed</p>
            <p>✓ View detailed transaction history</p>
            <p>✓ Monitor system-wide activity</p>
            <p style={{ marginTop: '15px', fontSize: '12px', color: '#888' }}>
              Navigate to "Audit Trail" page for detailed logs
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default AuditorDashboard;