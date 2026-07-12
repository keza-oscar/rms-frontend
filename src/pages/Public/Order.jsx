import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { addCartItem, getCart, getCartCount, saveCart } from '../../utils/cart';

function Order() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState(getCart);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/menu')
      .then((response) => { if (!response.ok) throw new Error('Unable to load the menu.'); return response.json(); })
      .then((data) => setMenu(Array.isArray(data) ? data : []))
      .catch((error) => console.error('Error fetching menu:', error))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const item = location.state?.item;
    if (item) {
      setCart((currentCart) => addCartItem(currentCart, item));
      setToast(`${item.item_name} added to your cart`);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.pathname, location.state]);

  useEffect(() => { saveCart(cart); }, [cart]);
  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timeout);
  }, [toast]);

  const addToCart = (item) => {
    setCart((currentCart) => addCartItem(currentCart, item));
    setToast(`${item.item_name} added to your cart`);
  };

  const changeQuantity = (itemId, quantity) => setCart((currentCart) => quantity < 1
    ? currentCart.filter((item) => item.item_id !== itemId)
    : currentCart.map((item) => item.item_id === itemId ? { ...item, quantity } : item));

  const total = useMemo(() => cart.reduce((sum, item) => sum + Number(item.price || 0) * item.quantity, 0), [cart]);

  return (
    <div className="public-container">
      <nav className="public-nav"><div className="nav-brand"><h1>MIDTOWN</h1></div><div className="nav-links"><button onClick={() => navigate('/public/')}>Home</button><button onClick={() => navigate('/public/menu')}>Menu</button><button className="cart-badge" onClick={() => document.querySelector('.cart-column')?.scrollIntoView({ behavior: 'smooth' })}>Cart <span>{getCartCount(cart)}</span></button></div></nav>
      <section className="order-page">
        <h1>Place Your Order</h1><p className="subtitle">Add items to your cart, then proceed to checkout.</p>
        <div className="order-container">
          <div className="menu-column"><h2>Menu</h2>{loading ? <div className="spinner" /> : <div className="menu-list">{menu.map((item) => <div className="order-item" key={item.item_id}><div className="item-info"><h4>{item.item_name}</h4><p>{item.description || 'Delicious dish'}</p><span className="price">{Number(item.price || 0).toLocaleString()} TZS</span></div><button className="btn-add" aria-label={`Add ${item.item_name} to cart`} onClick={() => addToCart(item)}>+</button></div>)}</div>}</div>
          <aside className="cart-column"><h2>Your Cart</h2>{cart.length === 0 ? <p className="empty-cart">Your cart is empty.</p> : <div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.item_id}><div className="cart-item-info"><h5>{item.item_name}</h5></div><div className="quantity-control"><button aria-label={`Decrease ${item.item_name}`} onClick={() => changeQuantity(item.item_id, item.quantity - 1)}>-</button><span>{item.quantity}</span><button aria-label={`Increase ${item.item_name}`} onClick={() => changeQuantity(item.item_id, item.quantity + 1)}>+</button></div><span className="item-total">{(Number(item.price || 0) * item.quantity).toLocaleString()} TZS</span></div>)}</div>}<div className="cart-summary"><div className="summary-row total"><span>Total</span><span>{total.toLocaleString()} TZS</span></div></div><button className="btn-primary" disabled={!cart.length} onClick={() => navigate('/public/checkout', { state: { cart, total } })}>Checkout</button></aside>
        </div>
      </section>
      <footer className="public-footer"><p>&copy; 2025 Midtown Restaurant</p></footer>
      {toast && <div className="cart-toast" role="status">{toast}</div>}
    </div>
  );
}

export default Order;
