import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

function RealtimeTracker() {
  const { get } = useApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await get('/orders');
        if (data && Array.isArray(data)) {
          setOrders(data);
          setLastUpdate(new Date());
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchOrders();

    // Refresh every 10 seconds
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, [get]);

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'rgba(243, 156, 18, 0.15)';
      case 'In Progress':
        return 'rgba(52, 152, 219, 0.15)';
      case 'Ready':
        return 'rgba(155, 89, 182, 0.15)';
      case 'Completed':
        return 'rgba(39, 174, 96, 0.15)';
      default:
        return 'rgba(149, 165, 166, 0.15)';
    }
  };

  const getStatusBorderColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#f39c12';
      case 'In Progress':
        return '#3498db';
      case 'Ready':
        return '#9b59b6';
      case 'Completed':
        return '#27ae60';
      default:
        return '#95a5a6';
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Real-time Order Tracker 🔄</h1>
        <p>Live updates of all orders (updates every 10 seconds)</p>
      </div>

      <div style={{
        padding: '10px 15px',
        backgroundColor: '#252f3f',
        borderRadius: '6px',
        marginBottom: '20px',
        fontSize: '12px',
        color: '#b0b8c1'
      }}>
        Last updated: {lastUpdate.toLocaleTimeString()}
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '15px'
        }}>
          {orders.map((order) => (
            <div
              key={order.order_id}
              style={{
                padding: '15px',
                backgroundColor: getStatusBgColor(order.status),
                borderLeft: `4px solid ${getStatusBorderColor(order.status)}`,
                borderRadius: '8px',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ fontWeight: '700', fontSize: '16px' }}>
                  Order #{order.order_id}
                </div>
                <div style={{
                  padding: '4px 8px',
                  backgroundColor: getStatusBorderColor(order.status),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {order.status}
                </div>
              </div>

              <div style={{ fontSize: '13px', color: '#b0b8c1', marginBottom: '8px' }}>
                {order.customer_name || 'Walk-in'} • Table {order.table_id || '-'}
              </div>

              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#d4a574',
                marginBottom: '10px'
              }}>
                {(order.total_amount || 0).toLocaleString()} TZS
              </div>

              <div style={{
                fontSize: '11px',
                color: '#b0b8c1'
              }}>
                {new Date(order.order_date).toLocaleTimeString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RealtimeTracker;