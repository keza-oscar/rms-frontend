import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import RestaurantScene from '../components/3D/RestaurantScene';

function WaiterDashboard({ user }) {
  const { get } = useApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await get('/orders');
        if (data && Array.isArray(data)) {
          const activeOrders = data.filter(
            (order) => order.status === 'Pending' || order.status === 'In Progress'
          );
          setOrders(activeOrders);
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
        <h1>🍽️ Waiter Dashboard - 3D Service Hub</h1>
        <p>Your active tables and orders</p>
      </div>

      {/* 3D SCENE */}
      <div style={{ marginBottom: '40px' }}>
        <RestaurantScene />
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="table-container">
          <div className="table-header">
            <h3 className="table-title">Active Orders</h3>
            <div style={{ color: '#d4a574', fontWeight: 'bold' }}>
              {orders.length} active order{orders.length !== 1 ? 's' : ''}
            </div>
          </div>

          {orders.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Table</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.order_id}>
                    <td>#{order.order_id}</td>
                    <td style={{ fontWeight: 'bold' }}>Table {order.table_id || '-'}</td>
                    <td>{order.customer_name || 'Walk-in'}</td>
                    <td>
                      <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-secondary" style={{ fontSize: '12px' }}>
                        Ready
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">✨</div>
              <h3>No active orders</h3>
              <p>Great! You're all caught up!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default WaiterDashboard;