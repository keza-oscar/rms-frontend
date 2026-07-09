import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

function OrderWorkflow() {
  const { get } = useApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await get('/orders');
        if (data && Array.isArray(data)) {
          setOrders(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [get]);

  const getStatusColor = (status) => {
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return '⏳';
      case 'In Progress':
        return '👨‍🍳';
      case 'Ready':
        return '✓';
      case 'Completed':
        return '✅';
      default:
        return '?';
    }
  };

  const statusFlow = ['Pending', 'In Progress', 'Ready', 'Completed'];

  return (
    <div>
      <div className="dashboard-header">
        <h1>Order Status Workflow 📋</h1>
        <p>View orders at each stage of preparation</p>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div>
          {/* STATUS PIPELINE */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '20px',
            marginBottom: '30px'
          }}>
            {statusFlow.map((status) => {
              const count = orders.filter(o => o.status === status).length;
              return (
                <div
                  key={status}
                  className="stat-card"
                  style={{
                    borderLeft: `4px solid ${getStatusColor(status)}`,
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '10px' }}>
                    {getStatusIcon(status)}
                  </div>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>{status}</h3>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: getStatusColor(status) }}>
                    {count}
                  </div>
                </div>
              );
            })}
          </div>

          {/* DETAILED STATUS VIEW */}
          {statusFlow.map((status) => {
            const statusOrders = orders.filter(o => o.status === status);
            return (
              <div key={status} style={{ marginBottom: '30px' }}>
                <div className="table-container">
                  <div className="table-header">
                    <h3 className="table-title">
                      {getStatusIcon(status)} {status} ({statusOrders.length})
                    </h3>
                  </div>

                  {statusOrders.length > 0 ? (
                    <table>
                      <thead>
                        <tr>
                          <th>Order #</th>
                          <th>Customer</th>
                          <th>Table</th>
                          <th>Time Since Order</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {statusOrders.map((order) => {
                          const orderTime = new Date(order.order_date);
                          const now = new Date();
                          const diffMinutes = Math.floor((now - orderTime) / 60000);
                          
                          return (
                            <tr key={order.order_id}>
                              <td style={{ fontWeight: 'bold', color: '#d4a574' }}>
                                #{order.order_id}
                              </td>
                              <td>{order.customer_name || 'Walk-in'}</td>
                              <td>Table {order.table_id || '-'}</td>
                              <td style={{ fontWeight: '600' }}>
                                {diffMinutes < 1 ? 'Just now' : `${diffMinutes}m ago`}
                              </td>
                              <td style={{ color: '#27ae60', fontWeight: '600' }}>
                                {(order.total_amount || 0).toLocaleString()} TZS
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    <div className="empty-state">
                      <p>No orders in {status.toLowerCase()} status</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OrderWorkflow;