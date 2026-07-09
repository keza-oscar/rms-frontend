import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

function WaiterMenuManager() {
  const { get, post, put } = useApi();
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    item_name: '',
    category_id: 1,
    price: '',
    description: '',
  });

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    try {
      const data = await get('/menu');
      setMenu(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenu = async (e) => {
    e.preventDefault();
    try {
      await post('/menu', {
        ...formData,
        category_id: parseInt(formData.category_id),
        price: parseFloat(formData.price),
      });
      setShowAddForm(false);
      setFormData({ item_name: '', category_id: 1, price: '', description: '' });
      fetchMenu();
      alert('Menu item added!');
    } catch (error) {
      alert('Failed to add menu item');
    }
  };

  const handleToggleAvailability = async (itemId, currentStatus) => {
    try {
      await put(`/menu/${itemId}`, { availability: !currentStatus });
      fetchMenu();
    } catch (error) {
      alert('Failed to update menu item');
    }
  };

  return (
    <div>
      <div className="dashboard-header">
        <h1>Menu Management 📝</h1>
        <p>Add new dishes or toggle availability</p>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Available Menu Items</h3>
          <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Add New Dish'}
          </button>
        </div>

        {showAddForm && (
          <div style={{ padding: '20px', backgroundColor: '#252f3f', borderBottom: '1px solid #2a3544' }}>
            <form onSubmit={handleAddMenu}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Dish Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Chapati"
                    value={formData.item_name}
                    onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price (TZS)</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label>Description</label>
                  <textarea
                    placeholder="Traditional bread..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">Add to Menu</button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="spinner"></div>
        ) : menu.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', padding: '20px' }}>
            {menu.map((item) => (
              <div
                key={item.item_id}
                className="stat-card"
                style={{
                  opacity: item.availability ? 1 : 0.6,
                  borderColor: item.availability ? '#d4a574' : '#e74c3c',
                  borderWidth: '2px'
                }}
              >
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{item.item_name}</h3>
                <p style={{ color: '#b0b8c1', fontSize: '13px', marginBottom: '15px' }}>
                  {item.description || 'No description'}
                </p>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ color: '#d4a574', fontWeight: 'bold', fontSize: '16px' }}>
                    {item.price} TZS
                  </span>
                </div>
                <button
                  onClick={() => handleToggleAvailability(item.item_id, item.availability)}
                  className={item.availability ? 'btn-primary' : 'btn-danger'}
                >
                  {item.availability ? '✓ Available' : '✗ Not Available'}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No menu items</h3>
            <p>Add your first dish!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WaiterMenuManager;