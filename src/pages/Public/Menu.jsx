import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addCartItem, getCart, getCartCount, saveCart } from '../../utils/cart';

const localMenuImages = [
  { matches: ['samosa'], src: '/images/menu/samosa.jpg' },
  { matches: ['mango', 'juice'], src: '/images/menu/mango-juice.jpg' },
  { matches: ['chocolate', 'cake'], src: '/images/menu/chocolate-cake.jpg' },
  { matches: ['chapati', 'chapatti'], src: '/images/menu/chapati.jpg' },
  { matches: ['ugali', 'fish', 'tilapia'], src: '/images/menu/ugali-fish.jpg' },
];

const getLocalMenuImage = (itemName = '') => {
  const normalizedName = itemName.toLowerCase();
  return localMenuImages.find(({ matches }) => matches.some((match) => normalizedName.includes(match)))?.src;
};

function Menu() {
  const navigate = useNavigate();
  const fallbackImage = '/images/menu/default-dish.svg';
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [cartCount, setCartCount] = useState(() => getCartCount());
  const [toast, setToast] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/menu');
        const data = await response.json();
        setMenu(data || []);
        
        const cats = ['All', ...new Set(data.map(item => item.category_name || 'Other'))];
        setCategories(cats);
      } catch (error) {
        console.error('Error fetching menu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const addToCart = (item) => {
    const updatedCart = addCartItem(getCart(), item);
    saveCart(updatedCart);
    setCartCount(getCartCount(updatedCart));
    setToast(`${item.item_name} added to your cart`);
  };

  const filteredMenu = selectedCategory === 'All' 
    ? menu 
    : menu.filter(item => item.category_name === selectedCategory);

  return (
    <div className="public-container">
      {/* NAV */}
      <nav className="public-nav">
        <div className="nav-brand">
          <h1>MIDTOWN</h1>
        </div>
        <div className="nav-links">
          <a href="/" onClick={() => navigate('/public/')}>Home</a>
          <a href="#menu">Menu</a>
          <a onClick={() => navigate('/public/reservations')}>Reserve</a>
          <button className="cart-badge" onClick={() => navigate('/public/order')}>Cart <span>{cartCount}</span></button>
          <button className="btn-login" onClick={() => navigate('/login')}>Staff</button>
        </div>
      </nav>

      <section className="menu-section">
        <h1>Our Menu</h1>
        <p className="subtitle">Carefully crafted dishes with nostalgic appeal</p>

        {/* CATEGORY FILTER */}
        <div className="category-filter">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* MENU GRID */}
        {loading ? (
          <div className="spinner"></div>
        ) : (
          <div className="menu-grid">
            {filteredMenu.map(item => (
              <div key={item.item_id} className="menu-card">
                <div className="menu-image">
                  <img 
                    src={item.image_url || item.image || getLocalMenuImage(item.item_name) || fallbackImage}
                    alt={item.item_name}
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = getLocalMenuImage(item.item_name) || fallbackImage;
                    }}
                  />
                  {item.availability && <span className="badge">Available</span>}
                </div>
                <div className="menu-content">
                  <h3>{item.item_name}</h3>
                  <p className="description">{item.description || 'Delicious dish'}</p>
                  <div className="menu-footer">
                    <span className="price">{item.price || 0} TZS</span>
                    <button 
                      className="btn-order"
                      onClick={() => addToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="public-footer">
        <p>&copy; 2025 Midtown Restaurant</p>
      </footer>
      {toast && <div className="cart-toast" role="status">{toast}</div>}
    </div>
  );
}

export default Menu;
