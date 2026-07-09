import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';

function LowStockNotification() {
  const { get } = useApi();
  const [lowStockItems, setLowStockItems] = useState([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const data = await get('/inventory');
        if (data && Array.isArray(data)) {
          const low = data.filter(item => item.quantity < item.reorder_level);
          setLowStockItems(low);
          
          // Show notification if there are low stock items
          if (low.length > 0) {
            setShow(true);
          }
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    // Check on mount and every 5 minutes
    fetchInventory();
    const interval = setInterval(fetchInventory, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [get]);

  if (!show || lowStockItems.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#e74c3c',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 10px 30px rgba(231, 76, 60, 0.3)',
        maxWidth: '350px',
        zIndex: 1000,
        animation: 'slideIn 0.3s ease-out'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px' }}>
        <div style={{ fontWeight: '700', fontSize: '16px' }}>
          ⚠️ Low Stock Alert
        </div>
        <button
          onClick={() => setShow(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '20px',
            cursor: 'pointer',
            padding: 0
          }}
        >
          ×
        </button>
      </div>

      <p style={{ margin: '0 0 10px 0', fontSize: '13px' }}>
        {lowStockItems.length} item(s) below reorder level:
      </p>

      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {lowStockItems.map((item) => (
          <div
            key={item.inventory_id}
            style={{
              padding: '8px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              marginBottom: '8px',
              borderRadius: '4px',
              fontSize: '12px'
            }}
          >
            <strong>{item.item_name}</strong>
            <div style={{ fontSize: '11px', opacity: 0.9 }}>
              Current: {item.quantity} / Reorder: {item.reorder_level}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default LowStockNotification;