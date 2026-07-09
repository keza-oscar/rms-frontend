import React, { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useSearch } from '../hooks/useSearch';

function Menu() {
  const { get } = useApi();
  const { searchMenu } = useSearch();
  const [menu, setMenu] = useState([]);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await get('/menu');
        setMenu(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [get]);

  useEffect(() => {
    let results = menu;
    
    if (filter !== 'All') {
      results = results.filter((item) => item.category_name === filter);
    }
    
    results = searchMenu(results, searchQuery);
    setFilteredMenu(results);
  }, [searchQuery, filter, menu, searchMenu]);

  const categories = ['All', ...new Set(menu.map((item) => item.category_name || 'Uncategorized'))];

  return (
    <div>
      <div className="dashboard-header">
        <h1>Menu Management 🍽️</h1>
        <p>View all available menu items</p>
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Search menu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '10px 15px',
            backgroundColor: '#252f3f',
            border: '1px solid #2a3544',
            color: '#fff',
            borderRadius: '6px',
            fontSize: '13px'
          }}
        />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={filter === cat ? 'btn-primary' : 'btn-secondary'}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item) => (
              <div
                key={item.item_id}
                className="stat-card"
                style={{ cursor: 'pointer', transition: 'all 0.3s' }}
              >
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ fontSize: '12px', color: '#b0b8c1', textTransform: 'uppercase' }}>
                    {item.category_name || 'Uncategorized'}
                  </span>
                </div>
                <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{item.item_name}</h3>
                <p style={{ color: '#b0b8c1', fontSize: '13px', marginBottom: '15px' }}>
                  {item.description || 'No description'}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div className="stat-value" style={{ fontSize: '24px', margin: 0 }}>
                    {item.price || 0} TZS
                  </div>
                  <span style={{ color: item.availability ? '#27ae60' : '#e74c3c', fontWeight: '600' }}>
                    {item.availability ? '✓ Available' : '✗ Unavailable'}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <h3>No menu items found</h3>
              <p>Try searching with different keywords or filter by category</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Menu;