import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useSearch } from '../hooks/useSearch';

function Orders() {
  const { get, post, put } = useApi();
  const { searchOrders } = useSearch();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    staff_id: 1,
    table_id: '',
    items: [],
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setFilteredOrders(searchOrders(orders, searchQuery));
  }, [searchQuery, orders, searchOrders]);

  const fetchOrders = async () => {
    try {
      const data = await get('/orders');
      setOrders(Array.isArray(data) ? data : []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load orders');
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    
    // VALIDATION
    if (!formData.customer_id) {
      setError('Customer ID is required');
      return;
    }
    if (!formData.table_id) {
      setError('Table ID is required');
      return;
    }

    try {
      const newOrder = await post('/orders', formData);
      if (newOrder) {
        setShowForm(false);
        setFormData({ customer_id: '', staff_id: 1, table_id: '', items: [] });
        setError('');
        fetchOrders();
        alert('✅ Order created successfully!');
      }
    } catch (err) {
      setError('❌ Failed to create order. Customer or table may not exist.');
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await put(`/orders/${orderId}/status`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      setError('❌ Failed to update order status');
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Orders Management 📋</h1>
        <p>View and manage all orders</p>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">All Orders</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="🔍 Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '10px 15px',
                backgroundColor: '#252f3f',
                border: '1px solid #2a3544',
                color: '#fff',
                borderRadius: '6px',
                width: '250px',
                fontSize: '13px'
              }}
            />
            <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Create Order'}
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <div style={{ padding: '20px', backgroundColor: '#252f3f', borderBottom: '1px solid #2a3544' }}>
            <form onSubmit={handleCreateOrder}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Customer ID *</label>
                  <input
                    type="number"
                    value={formData.customer_id}
                    onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                    placeholder="e.g., 1"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Table ID *</label>
                  <input
                    type="number"
                    value={formData.table_id}
                    onChange={(e) => setFormData({ ...formData, table_id: e.target.value })}
                    placeholder="e.g., 1"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">Create Order</button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="spinner"></div>
        ) : filteredOrders.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
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
                  <td>
                    <select
                      value={order.status || 'Pending'}
                      onChange={(e) => handleUpdateStatus(order.order_id, e.target.value)}
                      className="select"
                      style={{ width: '120px' }}
                    >
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Ready</option>
                      <option>Completed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : searchQuery ? (
          <div className="empty-state">
            <h3>No orders found</h3>
            <p>Try searching with different keywords</p>
          </div>
        ) : (
          <div className="empty-state">
            <h3>No orders found</h3>
            <p>Create your first order to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;