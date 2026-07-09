import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import RestaurantScene from '../components/3D/RestaurantScene';

function ManagerDashboard({ user }) {
  const { get } = useApi();
  const [report, setReport] = useState({});
  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportData = await get('/reports/daily-sales');
        if (reportData) setReport(reportData);

        const topData = await get('/reports/top-items');
        if (topData) setTopItems(Array.isArray(topData) ? topData : []);
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
        <h1>📊 Manager Dashboard - 3D Analytics</h1>
        <p>Sales analysis with 3D visualization</p>
      </div>

      {/* 3D SCENE */}
      <div style={{ marginBottom: '40px' }}>
        <RestaurantScene />
      </div>

      {/* SALES METRICS */}
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Total Orders</span>
              <div className="stat-value">{report.total_orders || 0}</div>
            </div>
            <div className="stat-card">
              <span className="stat-label">Completed</span>
              <div className="stat-value">{report.completed_orders || 0}</div>
            </div>
            <div className="stat-card">
              <span className="stat-label">Total Revenue</span>
              <div className="stat-value" style={{ fontSize: '24px' }}>
                {(report.total_revenue || 0).toLocaleString()} TZS
              </div>
            </div>
            <div className="stat-card">
              <span className="stat-label">Avg Order Value</span>
              <div className="stat-value">
                {report.total_orders ? Math.round(report.total_revenue / report.total_orders) : 0} TZS
              </div>
            </div>
          </div>

          {/* TOP SELLING ITEMS */}
          <div className="table-container" style={{ marginTop: '30px' }}>
            <div className="table-header">
              <h3 className="table-title">🏆 Top Selling Items</h3>
            </div>
            {topItems.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Item Name</th>
                    <th>Quantity Sold</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {topItems.map((item, index) => (
                    <tr key={item.item_id}>
                      <td style={{ fontWeight: 'bold', fontSize: '16px' }}>
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'} #{index + 1}
                      </td>
                      <td>{item.item_name}</td>
                      <td style={{ fontWeight: '600' }}>{item.total_quantity || 0}</td>
                      <td style={{ fontWeight: 'bold', color: '#d4a574' }}>
                        {(item.total_revenue || 0).toLocaleString()} TZS
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <h3>No sales data available</h3>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ManagerDashboard;