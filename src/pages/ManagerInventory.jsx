import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

function ManagerInventory() {
  const { get, post, put, delete: deleteApi } = useApi();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    item_name: '',
    quantity: '',
    unit: 'kg',
    reorder_level: '',
    supplier_id: 1,
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const data = await get('/inventory');
      setInventory(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      await post('/inventory', {
        ...formData,
        quantity: parseInt(formData.quantity),
        reorder_level: parseInt(formData.reorder_level),
      });
      setShowAddForm(false);
      setFormData({ item_name: '', quantity: '', unit: 'kg', reorder_level: '', supplier_id: 1 });
      fetchInventory();
      alert('Inventory added!');
    } catch (error) {
      alert('Failed to add inventory');
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      await put(`/inventory/${itemId}`, { quantity: parseInt(newQuantity) });
      fetchInventory();
    } catch (error) {
      alert('Failed to update quantity');
    }
  };

  const handleDeleteItem = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteApi(`/inventory/${itemId}`);
        fetchInventory();
        alert('Item deleted!');
      } catch (error) {
        alert('Failed to delete item');
      }
    }
  };

  const lowStockItems = inventory.filter((item) => item.quantity < item.reorder_level);

  return (
    <div>
      <div className="dashboard-header">
        <h1>Inventory Management 📦</h1>
        <p>Add stock, track quantities, manage reorders</p>
      </div>

      {lowStockItems.length > 0 && (
        <div style={{
          padding: '15px',
          backgroundColor: 'rgba(231, 76, 60, 0.15)',
          border: '2px solid #e74c3c',
          borderRadius: '8px',
          marginBottom: '20px',
          color: '#e74c3c',
          fontWeight: 'bold'
        }}>
          ⚠️ {lowStockItems.length} item(s) below reorder level - Action needed!
        </div>
      )}

      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Inventory Stock</h3>
          <button className="btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? 'Cancel' : '+ Add Stock'}
          </button>
        </div>

        {showAddForm && (
          <div style={{ padding: '20px', backgroundColor: '#252f3f', borderBottom: '1px solid #2a3544' }}>
            <form onSubmit={handleAddInventory}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Item Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Flour"
                    value={formData.item_name}
                    onChange={(e) => setFormData({ ...formData, item_name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    placeholder="100"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="select"
                  >
                    <option>kg</option>
                    <option>liters</option>
                    <option>pcs</option>
                    <option>bags</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Reorder Level</label>
                  <input
                    type="number"
                    placeholder="20"
                    value={formData.reorder_level}
                    onChange={(e) => setFormData({ ...formData, reorder_level: e.target.value })}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">Add to Inventory</button>
            </form>
          </div>
        )}

        {loading ? (
          <div className="spinner"></div>
        ) : inventory.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Current Stock</th>
                <th>Unit</th>
                <th>Reorder Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const isLow = item.quantity < item.reorder_level;
                return (
                  <tr
                    key={item.inventory_id}
                    style={{ backgroundColor: isLow ? 'rgba(231, 76, 60, 0.05)' : 'transparent' }}
                  >
                    <td style={{ fontWeight: '500' }}>{item.item_name}</td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.inventory_id, e.target.value)}
                        style={{
                          width: '80px',
                          padding: '5px',
                          backgroundColor: '#252f3f',
                          border: '1px solid #2a3544',
                          color: '#fff',
                          borderRadius: '4px'
                        }}
                      />
                    </td>
                    <td>{item.unit || 'pcs'}</td>
                    <td>{item.reorder_level}</td>
                    <td>
                      <span style={{
                        color: isLow ? '#e74c3c' : '#27ae60',
                        fontWeight: '600'
                      }}>
                        {isLow ? '⚠️ LOW' : '✓ OK'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleDeleteItem(item.inventory_id)}
                        className="btn-danger"
                        style={{ fontSize: '12px' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <h3>No inventory items</h3>
            <p>Add your first item!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ManagerInventory;