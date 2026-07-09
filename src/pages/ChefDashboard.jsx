import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import RestaurantScene from '../components/3D/RestaurantScene';

function ChefDashboard({ user }) {
  const { get } = useApi();
  const [menu, setMenu] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const menuRes = await get('/menu');
        if (menuRes && Array.isArray(menuRes)) {
          setMenu(menuRes.filter(item => item.availability));
        }

        const invRes = await get('/inventory');
        if (invRes && Array.isArray(invRes)) {
          setInventory(invRes);
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
        <h1>🍳 Kitchen Dashboard - 3D Edition</h1>
        <p>Available menu items & ingredient inventory</p>
      </div>

      {/* 3D SCENE */}
      <div style={{ marginBottom: '40px' }}>
        <RestaurantScene />
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          {/* AVAILABLE MENU ITEMS */}
          <div className="table-container">
            <div className="table-header">
              <h3 className="table-title">Available Menu Items</h3>
              <span style={{ color: '#d4a574', fontWeight: 'bold' }}>
                {menu.length} items ready
              </span>
            </div>

            {menu.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', padding: '20px' }}>
                {menu.map((item) => (
                  <div key={item.item_id} className="stat-card">
                    <h4 style={{ margin: '0 0 10px 0', color: '#d4a574' }}>
                      {item.item_name}
                    </h4>
                    <p style={{ color: '#b0b8c1', fontSize: '13px', margin: 0 }}>
                      {item.description || 'No description'}
                    </p>
                    <div style={{ marginTop: '10px', color: '#27ae60', fontWeight: 'bold' }}>
                      ✓ Available Now
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No menu items available</h3>
              </div>
            )}
          </div>

          {/* INGREDIENT INVENTORY */}
          <div className="table-container" style={{ marginTop: '30px' }}>
            <div className="table-header">
              <h3 className="table-title">Ingredient Stock</h3>
            </div>

            {inventory.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Unit</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((item) => {
                    const isLow = item.quantity < item.reorder_level;
                    return (
                      <tr key={item.inventory_id} style={{ backgroundColor: isLow ? 'rgba(231, 76, 60, 0.05)' : 'transparent' }}>
                        <td style={{ fontWeight: '500' }}>{item.item_name}</td>
                        <td style={{ fontSize: '16px', fontWeight: 'bold', color: isLow ? '#e74c3c' : '#27ae60' }}>
                          {item.quantity}
                        </td>
                        <td>{item.unit || 'pcs'}</td>
                        <td>
                          <span style={{
                            color: isLow ? '#e74c3c' : '#27ae60',
                            fontWeight: '600',
                            fontSize: '14px'
                          }}>
                            {isLow ? '⚠️ LOW' : '✓ OK'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="empty-state">
                <h3>No inventory data</h3>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ChefDashboard;