import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useNavigate } from 'react-router-dom';

function WaiterDashboardMobile({ user }) {
  const { get } = useApi();
  const navigate = useNavigate();
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
      <div className="mobile-title">My Orders 🍽️</div>
      <div className="mobile-subtitle">Active tables and orders</div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          {/* BIG ORDER COUNTER */}
          <div className="stat-card" style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '48px', fontWeight: '700', color: '#d4a574' }}>
              {orders.length}
            </div>
            <div style={{ fontSize: '14px', color: '#b0b8c1' }}>
              Active Orders
            </div>
          </div>

          {/* LARGE ACTION BUTTONS */}
          <div style={{ display: 'grid', gap: '12px', marginBottom: '20px' }}>
            <button
              className="waiter-button btn-primary"
              onClick={() => navigate('/waiter-menu')}
            >
              📝 Update Menu
            </button>
            <button
              className="waiter-button btn-secondary"
              style={{ width: '100%' }}
            >
              🔄 Refresh Orders
            </button>
          </div>

          {/* ORDER LIST */}
          <div className="table-container">
            <div className="table-header">
              <h3 className="table-title">Active Orders</h3>
            </div>

            {orders.length > 0 ? (
              <div style={{ padding: '15px' }}>
                {orders.map((order) => (
                  <div
                    key={order.order_id}
                    style={{
                      padding: '16px',
                      backgroundColor: '#252f3f',
                      borderLeft: '4px solid #d4a574',
                      marginBottom: '12px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>
                      Order #{order.order_id}
                    </div>
                    <div style={{ fontSize: '14px', color: '#b0b8c1', marginBottom: '8px' }}>
                      Table {order.table_id || '-'} • {order.customer_name || 'Walk-in'}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '600',
                      color: '#27ae60'
                    }}>
                      ✓ {order.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">✨</div>
                <h3>All caught up!</h3>
                <p>No active orders</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default WaiterDashboardMobile;