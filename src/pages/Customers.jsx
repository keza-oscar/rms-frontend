import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useSearch } from '../hooks/useSearch';

function Customers() {
  const { get, post } = useApi();
  const { searchCustomers } = useSearch();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    setFilteredCustomers(searchCustomers(customers, searchQuery));
  }, [searchQuery, customers, searchCustomers]);

  const fetchCustomers = async () => {
    try {
      const data = await get('/customers');
      setCustomers(Array.isArray(data) ? data : []);
    } catch (error) {
      setError('Failed to load customers');
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return phone.length >= 10;
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setError('');

    // VALIDATION
    if (!formData.first_name.trim()) {
      setError('First name is required');
      return;
    }
    if (!formData.last_name.trim()) {
      setError('Last name is required');
      return;
    }
    if (formData.phone && !validatePhone(formData.phone)) {
      setError('Phone must be at least 10 digits');
      return;
    }
    if (formData.email && !validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      await post('/customers', formData);
      setShowForm(false);
      setFormData({ first_name: '', last_name: '', phone: '', email: '' });
      fetchCustomers();
      alert('✅ Customer added successfully!');
    } catch (error) {
      setError('❌ Failed to add customer');
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Customers 👥</h1>
        <p>Manage customer information</p>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Customer List</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="text"
              placeholder="🔍 Search customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '10px 15px',
                backgroundColor: '#252f3f',
                border: '1px solid #2a3544',
                color: '#fff',
                borderRadius: '6px',
                width: '200px',
                fontSize: '13px'
              }}
            />
            <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
              {showForm ? 'Cancel' : '+ Add Customer'}
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <div style={{ padding: '20px', backgroundColor: '#252f3f' }}>
            <form onSubmit={handleAddCustomer}>
              <div className="form-grid">
                <input
                  type="text"
                  placeholder="First Name *"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                />
                <input
                  type="text"
                  placeholder="Last Name *"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone (10+ digits)"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <button type="submit" className="btn-primary">Add Customer</button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="spinner"></div>
        ) : filteredCustomers.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.customer_id}>
                  <td><strong>{customer.first_name} {customer.last_name}</strong></td>
                  <td>{customer.phone || 'N/A'}</td>
                  <td>{customer.email || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : searchQuery ? (
          <div className="empty-state">
            <h3>No customers found</h3>
            <p>Try searching with different keywords</p>
          </div>
        ) : (
          <div className="empty-state">
            <h3>No customers yet</h3>
            <p>Add your first customer!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Customers;