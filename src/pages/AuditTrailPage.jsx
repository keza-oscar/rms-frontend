import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

function AuditTrailPage() {
  const { get } = useApi();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await get('/orders');
        if (data && Array.isArray(data)) {
          // Sort by most recent first
          const sorted = [...data].sort((a, b) => new Date(b.order_date) - new Date(a.order_date));
          setOrders(sorted);
        }
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
        <h1>Audit Trail 📋</h1>
        <p>Complete activity log of all transactions</p>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Transaction History</h3>
          <span style={{ color: '#d4a574', fontWeight: 'bold' }}>
            {orders.length} records
          </span>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : orders.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Date & Time</th>
                <th>Table</th>
                <th>Staff</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id}>
                  <td style={{ fontWeight: 'bold', color: '#d4a574' }}>#{order.order_id}</td>
                  <td>{order.customer_name || 'Walk-in'}</td>
                  <td style={{ fontSize: '12px' }}>
                    {new Date(order.order_date).toLocaleString()}
                  </td>
                  <td>Table {order.table_id || '-'}</td>
                  <td>Staff {order.staff_id || '-'}</td>
                  <td style={{ fontWeight: 'bold', color: '#27ae60' }}>
                    {(order.total_amount || 0).toLocaleString()} TZS
                  </td>
                  <td>
                    <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <h3>No audit records found</h3>
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#1a2332',
          border: '1px solid #2a3544',
          borderRadius: '12px'
        }}
      >
        <h4 style={{ marginBottom: '10px' }}>Audit Information</h4>
        <p style={{ fontSize: '13px', color: '#b0b8c1', margin: '5px 0' }}>
          • All orders are logged with complete details
        </p>
        <p style={{ fontSize: '13px', color: '#b0b8c1', margin: '5px 0' }}>
          • Timestamps track when transactions occurred
        </p>
        <p style={{ fontSize: '13px', color: '#b0b8c1', margin: '5px 0' }}>
          • Staff ID identifies who processed each order
        </p>
        <p style={{ fontSize: '13px', color: '#b0b8c1', margin: '5px 0' }}>
          • Amount tracking ensures all revenue is accounted for
        </p>
      </div>
    </div>
  );
}

export default AuditTrailPage;