import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

function Inventory() {
  const { get } = useApi();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchInventory();
  }, [get]);

  const lowStock = inventory.filter((item) => item.quantity < item.reorder_level);

  return (
    <div>
      <div className="dashboard-header">
        <h1>Inventory Management 📦</h1>
        <p>Monitor stock levels and reorder</p>
      </div>

      {lowStock.length > 0 && (
        <div
          style={{
            padding: '15px',
            backgroundColor: 'rgba(231, 76, 60, 0.1)',
            border: '1px solid #e74c3c',
            borderRadius: '8px',
            marginBottom: '20px',
            color: '#e74c3c',
          }}
        >
          ⚠️ {lowStock.length} item(s) below reorder level
        </div>
      )}

      <div className="table-container">
        <div className="table-header">
          <h3 className="table-title">Stock Levels</h3>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : inventory.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit</th>
                <th>Reorder Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => {
                const isLowStock = item.quantity < item.reorder_level;
                return (
                  <tr key={item.inventory_id} style={{ backgroundColor: isLowStock ? 'rgba(231, 76, 60, 0.05)' : 'transparent' }}>
                    <td>{item.item_name}</td>
                    <td className={isLowStock ? 'low-stock' : ''}>{item.quantity}</td>
                    <td>{item.unit || 'pcs'}</td>
                    <td>{item.reorder_level}</td>
                    <td>
                      <span className={isLowStock ? 'low-stock' : ''} style={{ fontWeight: '600' }}>
                        {isLowStock ? '⚠️ Low Stock' : '✓ Ok'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <h3>No inventory items</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default Inventory;