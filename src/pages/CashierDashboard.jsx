import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import RestaurantScene from '../components/3D/RestaurantScene';

function CashierDashboard({ user }) {
  const { get } = useApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalToday, setTotalToday] = useState(0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await get('/orders');
        if (data && Array.isArray(data)) {
          const completedOrders = data.filter(
            (order) => order.status === 'Ready' || order.status === 'Completed'
          );
          setOrders(completedOrders);

          const total = completedOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
          setTotalToday(total);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [get]);

  return (
    <div>
      <div className="dashboard-header">
        <h1>💳 Cashier Station - 3D Payment Hub</h1>
        <p>Process payments and manage transactions</p>
      </div>

      {/* 3D SCENE */}
      <div style={{ marginBottom: '40px' }}>
        <RestaurantScene />
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          {/* TODAY'S TOTAL */}
          <div className="stats-grid">
            <div className="stat-card" style={{ gridColumn: '1 / -1', maxWidth: '400px' }}>
              <span className="stat-label">Today's Total Revenue</span>
              <div className="stat-value" style={{ fontSize: '32px', color: '#27ae60' }}>
                {totalToday.toLocaleString()} TZS
              </div>
              <div className="stat-change">{orders.length} completed orders</div>
            </div>
          </div>

          {/* PAYMENT PENDING */}
          <div className="table-container" style={{ marginTop: '30px' }}>
            <div className="table-header">
              <h3 className="table-title">Ready for Payment</h3>
            </div>

            {orders.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.order_id}>
                      <td style={{ fontWeight: 'bold' }}>#{order.order_id}</td>
                      <td>{order.customer_name || 'Walk-in'}</td>
                      <td style={{ fontWeight: 'bold', color: '#d4a574' }}>
                        {(order.total_amount || 0).toLocaleString()} TZS
                      </td>
                      <td>
                        <span className="status-badge" style={{ backgroundColor: '#3498db', color: 'white' }}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn-primary" style={{ fontSize: '12px' }}>
                          Pay
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">✨</div>
                <h3>No pending payments</h3>
                <p>All orders have been processed!</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default CashierDashboard;