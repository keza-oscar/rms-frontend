import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

function Dashboard({ user }) {
  const { get } = useApi();
  const [stats, setStats] = useState({ total_orders: 0, completed_orders: 0, total_revenue: 0 });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reportRes = await get('/reports/daily-sales');
        if (reportRes) setStats(reportRes);

        const ordersRes = await get('/orders');
        if (ordersRes && Array.isArray(ordersRes)) {
          setRecentOrders(ordersRes.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [get]);

  return (
    <div>
      <div className="dashboard-header">
        <h1>Welcome back, {user?.username}! 👋</h1>
        <p>Here's your restaurant overview</p>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">Total Orders</span>
                <div className="stat-icon">📦</div>
              </div>
              <div className="stat-value">{stats.total_orders || 0}</div>
              <div className="stat-change">Today</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">Completed</span>
                <div className="stat-icon">✅</div>
              </div>
              <div className="stat-value">{stats.completed_orders || 0}</div>
              <div className="stat-change">Finished</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">Total Revenue</span>
                <div className="stat-icon">💰</div>
              </div>
              <div className="stat-value">{(stats.total_revenue || 0).toLocaleString()}</div>
              <div className="stat-change">TZS Today</div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-label">Avg Order Value</span>
                <div className="stat-icon">📊</div>
              </div>
              <div className="stat-value">
                {stats.total_orders ? Math.round(stats.total_revenue / stats.total_orders) : 0}
              </div>
              <div className="stat-change">TZS Per Order</div>
            </div>
          </div>

          <div className="table-container">
            <div className="table-header">
              <h3 className="table-title">Recent Orders</h3>
            </div>
            {recentOrders.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.order_id}>
                      <td>#{order.order_id}</td>
                      <td>{order.customer_name || 'Walk-in'}</td>
                      <td>{new Date(order.order_date).toLocaleDateString()}</td>
                      <td>{(order.total_amount || 0).toLocaleString()} TZS</td>
                      <td>
                        <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                          {order.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📭</div>
                <h3>No orders yet</h3>
                <p>Create your first order to get started</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;